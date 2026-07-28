export default function ExamEngineLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-main)',
      }}
    >
      {children}
    </div>
  )
}
