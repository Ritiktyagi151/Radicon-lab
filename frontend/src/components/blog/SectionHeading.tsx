type SectionHeadingProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">{eyebrow}</p>
      ) : null}
      <h2 className="mt-3 text-3xl font-bold leading-tight text-[#111111] sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-base leading-7 text-gray-500">{subtitle}</p> : null}
    </div>
  )
}
