// ============================================================
// Deep JSONB Overrides Engine (Phase 4 — Client SaaS Layer)
//
// Pure, dependency-free, isomorphic-safe utilities (usable on the
// edge + node server bundles AND the browser bundle) that power the
// tenant customization workspace over:
//   core.project_definitions.modules_config  (baseline)
//   core.project_overrides.config_override   (client delta)
//
// Invariants enforced:
//   1. Null-Value Baseline Invariant — a key present in `baseline` but
//      `null`/`undefined` inside `override` keeps the baseline value.
//      (null never means "delete me".)
//   2. Arrays are replaced COMPLETELY by the override (override wins).
//   3. Primitives are overridden only by non-null values.
//   4. Delta Overrides rule — `deepDiff` returns ONLY the keys that
//      actually changed, so `config_override` stores purely the diffs
//      (keeps rows tiny and the GIN index on config_override lean).
// ============================================================

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };

/** Depth guard — configs come from JSON so cycles are impossible, but a
 *  maliciously-deep payload must never blow the call stack on edge clients. */
const MAX_DEPTH = 100;

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneValue(value: JsonValue, depth = 0): JsonValue {
  if (depth > MAX_DEPTH) return value;
  if (Array.isArray(value)) return value.map((item) => cloneValue(item, depth + 1));
  if (isPlainObject(value)) {
    const out: JsonObject = {};
    for (const key of Object.keys(value)) out[key] = cloneValue(value[key], depth + 1);
    return out;
  }
  return value;
}

function arraysDeepEqual(a: JsonValue[], b: JsonValue[], depth = 0): boolean {
  if (depth > MAX_DEPTH) return a.length === b.length;
  if (a.length !== b.length) return false;
  return a.every((value, index) => valuesDeepEqual(value, b[index], depth + 1));
}

function valuesDeepEqual(a: JsonValue | undefined, b: JsonValue | undefined, depth = 0): boolean {
  if (depth > MAX_DEPTH) return a === b;
  if (a === b) return true;
  if (a === undefined || b === undefined) return a === b;
  if (a === null || b === null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) return arraysDeepEqual(a, b, depth);
  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys) {
      if (!valuesDeepEqual(a[key], b[key], depth + 1)) return false;
    }
    return true;
  }
  return false;
}

function mergeNode(
  baselineValue: JsonValue | undefined,
  overrideValue: JsonValue | undefined,
  depth: number
): JsonValue | undefined {
  // Null-Value Baseline Invariant.
  if (overrideValue === null || overrideValue === undefined) return baselineValue;
  if (baselineValue === null || baselineValue === undefined) return cloneValue(overrideValue, depth + 1);
  if (depth > MAX_DEPTH) return cloneValue(overrideValue, depth);

  // Arrays → complete replacement (override wins).
  if (Array.isArray(overrideValue)) return cloneValue(overrideValue, depth + 1);

  // Non-object overriding values win over primitives/arrays.
  if (!isPlainObject(overrideValue) || !isPlainObject(baselineValue)) {
    return cloneValue(overrideValue, depth + 1);
  }

  // Recursive object merge — seeded from the baseline clone so every
  // baseline branch survives even when the override never mentions it.
  const result: JsonObject = {};
  for (const key of Object.keys(baselineValue)) {
    result[key] = mergeNode(baselineValue[key], overrideValue[key], depth + 1) ?? baselineValue[key];
  }
  for (const key of Object.keys(overrideValue)) {
    const value = overrideValue[key];
    if (value === null || value === undefined) continue;
    if (!(key in baselineValue)) result[key] = cloneValue(value, depth + 1);
  }
  return result;
}

/**
 * Recursively merges an override on top of a baseline config.
 *
 * Examples:
 *   deepMerge({a:1,x:{p:1}}, {b:2,x:{q:3}}) => {a:1,b:2,x:{p:1,q:3}}
 *   deepMerge({a:1}, {a:null})             => {a:1}        (null keeps baseline)
 *   deepMerge({arr:[1]}, {arr:[2,3]})       => {arr:[2,3]}  (arrays replaced)
 *
 * Returns a fresh `JsonObject`; inputs are never mutated.
 */
export function deepMerge(
  baseline: JsonObject,
  override: JsonObject | null | undefined
): JsonObject {
  const safeBaseline = isPlainObject(baseline) ? baseline : {};
  const result = mergeNode(safeBaseline, isPlainObject(override) ? override : undefined, 0);
  return (isPlainObject(result) ? result : {}) as JsonObject;
}

function diffNode(baselineValue: JsonValue | undefined, desiredValue: JsonValue | undefined): JsonValue | undefined {
  // A null/undefined value in the desired state is not representable as a
  // delta (the DB invariant keeps the baseline) → omit it.
  if (desiredValue === null || desiredValue === undefined) return undefined;

  if (baselineValue === null || baselineValue === undefined) {
    if (isPlainObject(desiredValue)) {
      const sub = buildDiff(undefined, desiredValue);
      return Object.keys(sub).length > 0 ? sub : undefined;
    }
    return cloneValue(desiredValue);
  }

  if (!isPlainObject(desiredValue)) {
    // Primitive (or array handled below).
    if (Array.isArray(desiredValue)) {
      if (baselineValue !== null && !Array.isArray(baselineValue)) return cloneValue(desiredValue);
      if (Array.isArray(baselineValue) && arraysDeepEqual(baselineValue, desiredValue)) return undefined;
      return cloneValue(desiredValue);
    }
    // scalar equality
    return valuesDeepEqual(baselineValue, desiredValue) ? undefined : desiredValue;
  }

  if (!isPlainObject(baselineValue) || Array.isArray(baselineValue)) {
    const sub = buildDiff(undefined, desiredValue);
    return Object.keys(sub).length > 0 ? sub : undefined;
  }

  const sub = buildDiff(baselineValue, desiredValue);
  return Object.keys(sub).length > 0 ? sub : undefined;
}

function buildDiff(baseline: JsonObject | undefined, desired: JsonObject): JsonObject {
  const result: JsonObject = {};
  for (const key of Object.keys(desired)) {
    const delta = diffNode(baseline?.[key], desired[key]);
    if (delta !== undefined) result[key] = delta;
  }
  return result;
}

/**
 * Delta Overrides: returns ONLY the changed keys between `baseline` and the
 * user's `desired` state. The output is exactly the payload that gets stored
 * in `core.project_overrides.config_override`.
 *
 * Semantic guarantees:
 * - keys equal to baseline → omitted (the DB stays lean)
 * - null desired values → omitted (never representable as a delta)
 * - changed arrays → included wholesale
 * - injected nested sections → returned with their full (non-null) content
 */
export function deepDiff(baseline: JsonObject, desired: JsonObject): JsonObject {
  const safeBaseline = isPlainObject(baseline) ? baseline : {};
  const safeDesired = isPlainObject(desired) ? desired : {};
  return buildDiff(safeBaseline, safeDesired);
}