const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export type TocItem = {
  id: string
  title: string
  level: 2 | 3
}

export function getTableOfContents(content: string): TocItem[] {
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return Array.from(content.matchAll(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi)).map((match) => {
      const title = match[2].replace(/<[^>]+>/g, '').trim()

      return {
        id: slugify(title),
        title,
        level: Number(match[1]) as 2 | 3,
      }
    })
  }

  return content
    .split('\n')
    .filter((line) => /^#{2,3}\s/.test(line))
    .map((line) => {
      const level = line.startsWith('###') ? 3 : 2
      const title = line.replace(/^#{2,3}\s/, '').trim()

      return {
        id: slugify(title),
        title,
        level,
      }
    })
}

function addHeadingIds(content: string) {
  return content.replace(/<h([123])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attributes, innerHtml) => {
    if (/\sid=/.test(attributes)) return match
    const title = String(innerHtml).replace(/<[^>]+>/g, '').trim()

    return `<h${level}${attributes} id="${slugify(title)}">${innerHtml}</h${level}>`
  })
}

export default function RichContent({ content }: { content: string }) {
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return (
      <div
        className="blog-rich-content"
        dangerouslySetInnerHTML={{ __html: addHeadingIds(content) }}
      />
    )
  }

  const lines = content.split('\n')
  const blocks: React.ReactNode[] = []
  let listItems: string[] = []
  let codeLines: string[] = []
  let inCode = false

  const flushList = () => {
    if (!listItems.length) return
    blocks.push(
      <ul key={`list-${blocks.length}`} className="my-6 space-y-3 pl-6 text-gray-600">
        {listItems.map((item) => (
          <li key={item} className="list-disc leading-7">
            {item}
          </li>
        ))}
      </ul>,
    )
    listItems = []
  }

  const flushCode = () => {
    if (!codeLines.length) return
    blocks.push(
      <pre
        key={`code-${blocks.length}`}
        className="my-7 overflow-x-auto rounded-sm bg-[#111111] p-5 text-sm leading-7 text-white"
      >
        <code>{codeLines.join('\n')}</code>
      </pre>,
    )
    codeLines = []
  }

  lines.forEach((rawLine) => {
    const line = rawLine.trim()

    if (line.startsWith('```')) {
      if (inCode) {
        flushCode()
        inCode = false
      } else {
        flushList()
        inCode = true
      }
      return
    }

    if (inCode) {
      codeLines.push(rawLine)
      return
    }

    if (!line) {
      flushList()
      return
    }

    if (line.startsWith('### ')) {
      flushList()
      const title = line.replace('### ', '')
      blocks.push(
        <h3
          key={slugify(title)}
          id={slugify(title)}
          className="mb-4 mt-9 scroll-mt-28 text-2xl font-bold text-[#111111]"
        >
          {title}
        </h3>,
      )
      return
    }

    if (line.startsWith('## ')) {
      flushList()
      const title = line.replace('## ', '')
      blocks.push(
        <h2
          key={slugify(title)}
          id={slugify(title)}
          className="mb-4 mt-10 scroll-mt-28 text-3xl font-bold text-[#111111]"
        >
          {title}
        </h2>,
      )
      return
    }

    if (line.startsWith('> ')) {
      flushList()
      blocks.push(
        <blockquote
          key={`quote-${blocks.length}`}
          className="my-7 border-l-4 border-brand-600 bg-brand-50 px-6 py-5 text-lg font-semibold leading-8 text-[#111111]"
        >
          {line.replace('> ', '')}
        </blockquote>,
      )
      return
    }

    if (line.startsWith('- ')) {
      listItems.push(line.replace('- ', ''))
      return
    }

    flushList()
    blocks.push(
      <p key={`p-${blocks.length}`} className="my-5 text-base leading-8 text-gray-600">
        {line}
      </p>,
    )
  })

  flushList()
  flushCode()

  return <div className="blog-rich-content">{blocks}</div>
}
