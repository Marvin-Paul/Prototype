export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-xl mx-auto text-ink-2">{subtitle}</p>
      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[linear-gradient(90deg,var(--primary-color),var(--secondary-color))]" />
    </div>
  )
}
