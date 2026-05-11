'use client'

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,
  Underline as UnderlineIcon,
  Unlink,
} from 'lucide-react'
import Image from '@tiptap/extension-image'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import TextAlign from '@tiptap/extension-text-align'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type RichTextEditorProps = {
  label: string
  value: string
  onChange: (value: string) => void
  onUploadImage: (file: File) => Promise<string>
  required?: boolean
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  onUploadImage,
  required,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'min-h-[320px] rounded-b-2xl bg-white px-4 py-4 text-sm font-semibold leading-7 text-slate-700 outline-none',
      },
    },
    onUpdate: ({ editor: activeEditor }) => {
      onChange(activeEditor.isEmpty ? '' : activeEditor.getHTML())
    },
  })

  useEffect(() => {
    if (!editor || editor.getHTML() === value) return
    editor.commands.setContent(value || '', { emitUpdate: false })
  }, [editor, value])

  const setLink = () => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Enter link URL', previousUrl || 'https://')

    if (url === null) return
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  const insertUploadedImage = async (file?: File) => {
    if (!file || !editor) return
    setIsUploading(true)
    try {
      const url = await onUploadImage(file)
      editor.chain().focus().setImage({ src: url }).run()
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="block md:col-span-2">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-black text-slate-700">{label}</span>
        {required ? <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Required</span> : null}
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-brand-300">
        <Toolbar
          editor={editor}
          isUploading={isUploading}
          onSetLink={setLink}
          onSelectImage={() => fileInputRef.current?.click()}
        />
        <EditorContent editor={editor} />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => void insertUploadedImage(event.target.files?.[0])}
      />
    </div>
  )
}

function Toolbar({
  editor,
  isUploading,
  onSetLink,
  onSelectImage,
}: {
  editor: Editor | null
  isUploading: boolean
  onSetLink: () => void
  onSelectImage: () => void
}) {
  const disabled = !editor

  return (
    <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 p-3">
      <ToolButton label="Bold" active={editor?.isActive('bold')} disabled={disabled} onClick={() => editor?.chain().focus().toggleBold().run()}>
        <Bold size={16} />
      </ToolButton>
      <ToolButton label="Italic" active={editor?.isActive('italic')} disabled={disabled} onClick={() => editor?.chain().focus().toggleItalic().run()}>
        <Italic size={16} />
      </ToolButton>
      <ToolButton label="Underline" active={editor?.isActive('underline')} disabled={disabled} onClick={() => editor?.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon size={16} />
      </ToolButton>
      <ToolButton label="Heading 1" active={editor?.isActive('heading', { level: 1 })} disabled={disabled} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
        <Heading1 size={16} />
      </ToolButton>
      <ToolButton label="Heading 2" active={editor?.isActive('heading', { level: 2 })} disabled={disabled} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 size={16} />
      </ToolButton>
      <ToolButton label="Heading 3" active={editor?.isActive('heading', { level: 3 })} disabled={disabled} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 size={16} />
      </ToolButton>
      <ToolButton label="Bullet list" active={editor?.isActive('bulletList')} disabled={disabled} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
        <List size={16} />
      </ToolButton>
      <ToolButton label="Ordered list" active={editor?.isActive('orderedList')} disabled={disabled} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={16} />
      </ToolButton>
      <ToolButton label="Quote" active={editor?.isActive('blockquote')} disabled={disabled} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
        <Quote size={16} />
      </ToolButton>
      <ToolButton label="Align left" active={editor?.isActive({ textAlign: 'left' })} disabled={disabled} onClick={() => editor?.chain().focus().setTextAlign('left').run()}>
        <AlignLeft size={16} />
      </ToolButton>
      <ToolButton label="Align center" active={editor?.isActive({ textAlign: 'center' })} disabled={disabled} onClick={() => editor?.chain().focus().setTextAlign('center').run()}>
        <AlignCenter size={16} />
      </ToolButton>
      <ToolButton label="Align right" active={editor?.isActive({ textAlign: 'right' })} disabled={disabled} onClick={() => editor?.chain().focus().setTextAlign('right').run()}>
        <AlignRight size={16} />
      </ToolButton>
      <ToolButton label="Justify" active={editor?.isActive({ textAlign: 'justify' })} disabled={disabled} onClick={() => editor?.chain().focus().setTextAlign('justify').run()}>
        <AlignJustify size={16} />
      </ToolButton>
      <ToolButton label="Insert link" active={editor?.isActive('link')} disabled={disabled} onClick={onSetLink}>
        <LinkIcon size={16} />
      </ToolButton>
      <ToolButton label="Remove link" disabled={disabled || !editor?.isActive('link')} onClick={() => editor?.chain().focus().unsetLink().run()}>
        <Unlink size={16} />
      </ToolButton>
      <ToolButton label="Insert table" disabled={disabled} onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
        <TableIcon size={16} />
      </ToolButton>
      <ToolButton label={isUploading ? 'Uploading image' : 'Insert image'} disabled={disabled || isUploading} onClick={onSelectImage}>
        <ImageIcon size={16} />
      </ToolButton>
    </div>
  )
}

function ToolButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`grid h-9 w-9 place-items-center rounded-xl border text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? 'border-brand-500 bg-brand-600 text-white shadow-md shadow-brand-100'
          : 'border-slate-200 bg-white hover:border-brand-300 hover:text-brand-600'
      }`}
    >
      {children}
    </button>
  )
}
