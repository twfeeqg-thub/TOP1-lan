'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Was there an active controller BEFORE this update cycle? On a first
      // ever install there is none, so the initial controllerchange (from
      // install → claim) must NOT reload the page.
      const hadController = !!navigator.serviceWorker.controller;

      const onControllerChange = () => {
        if (hadController) {
          // aisahl-static-v1 → v2 takeover: reload once so the page never
          // keeps serving stale v1 markup from an old controller.
          window.location.reload();
        }
      };
      navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Service worker registration failed silently
        });
      });

      return () => {
        navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      };
    }
  }, []);

  return null;
}
