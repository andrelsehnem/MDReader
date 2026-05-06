import { useRef, useState } from 'react'
import { EditorToolbar } from '../components/EditorToolbar.tsx'
import { MarkdownPreview } from '../components/MarkdownPreview.tsx'
import { useEditorContext } from '../state/useEditorContext.ts'

const sanitizeFileName = (value: string) => {
  const trimmed = value.trim()
  const cleaned = trimmed.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ')
  return cleaned || 'novo'
}

export function EditorPage() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const syncingFromEditor = useRef(false)
  const syncingFromPreview = useRef(false)
  const [syncScrollEnabled, setSyncScrollEnabled] = useState(true)
  const {
    markdown,
    setMarkdown,
    undo,
    redo,
    imageMap,
    currentDocPath,
    setCurrentDocPath,
    setImageMap,
    documentTitle,
    setDocumentTitle,
    clearDraft,
  } = useEditorContext()

  const handleEditorKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isModifierPressed = event.ctrlKey || event.metaKey
    if (!isModifierPressed) return

    const pressedKey = event.key.toLowerCase()

    if (pressedKey === 'z' && !event.shiftKey) {
      event.preventDefault()
      undo()
      return
    }

    if (pressedKey === 'y' || (pressedKey === 'z' && event.shiftKey)) {
      event.preventDefault()
      redo()
    }
  }

  const handleNewMarkdown = () => {
    setMarkdown('')
    setDocumentTitle('novo')
    setCurrentDocPath('novo.md')
    setImageMap({})
    requestAnimationFrame(() => {
      textareaRef.current?.focus()
    })
  }

  const handleSaveMarkdown = () => {
    const fileName = `${sanitizeFileName(documentTitle)}.md`
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = fileName
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const syncPreviewFromEditor = () => {
    const editor = textareaRef.current
    const preview = previewRef.current
    if (!syncScrollEnabled || !editor || !preview || syncingFromPreview.current) return

    const maxEditorScroll = editor.scrollHeight - editor.clientHeight
    const maxPreviewScroll = preview.scrollHeight - preview.clientHeight
    const ratio = maxEditorScroll > 0 ? editor.scrollTop / maxEditorScroll : 0

    syncingFromEditor.current = true
    preview.scrollTop = ratio * Math.max(0, maxPreviewScroll)
    requestAnimationFrame(() => {
      syncingFromEditor.current = false
    })
  }

  const syncEditorFromPreview = () => {
    const editor = textareaRef.current
    const preview = previewRef.current
    if (!syncScrollEnabled || !editor || !preview || syncingFromEditor.current) return

    const maxEditorScroll = editor.scrollHeight - editor.clientHeight
    const maxPreviewScroll = preview.scrollHeight - preview.clientHeight
    const ratio = maxPreviewScroll > 0 ? preview.scrollTop / maxPreviewScroll : 0

    syncingFromPreview.current = true
    editor.scrollTop = ratio * Math.max(0, maxEditorScroll)
    requestAnimationFrame(() => {
      syncingFromPreview.current = false
    })
  }

  return (
    <section className="page editor-page">
      <h2>2) Editor Markdown</h2>
      <p className="page-subtitle">Digite do lado esquerdo e visualize formatado do lado direito.</p>

      <div className="page-actions">
        <button type="button" onClick={handleNewMarkdown}>
          Novo .md em branco
        </button>
        <label className="file-title-label" htmlFor="file-title-input">
          Título
        </label>
        <input
          id="file-title-input"
          className="file-title-input"
          type="text"
          value={documentTitle}
          onChange={(event) => {
            const nextTitle = event.target.value
            setDocumentTitle(nextTitle)
            setCurrentDocPath(`${sanitizeFileName(nextTitle)}.md`)
          }}
          placeholder="nome-do-arquivo"
          aria-label="Título do arquivo"
        />
        <button type="button" onClick={handleSaveMarkdown}>
          Salvar .md
        </button>
        <button type="button" onClick={clearDraft}>
          Limpar rascunho
        </button>
        <label className="sync-toggle" htmlFor="sync-scroll-toggle">
          <input
            id="sync-scroll-toggle"
            type="checkbox"
            checked={syncScrollEnabled}
            onChange={(event) => setSyncScrollEnabled(event.target.checked)}
          />
          Sincronizar rolagem
        </label>
      </div>

      <div className="editor-grid">
        <div className="editor-text-section">
          <div className="editor-tools">
            <EditorToolbar textareaRef={textareaRef} value={markdown} onChange={setMarkdown} />
          </div>

          <div className="editor-pane">
            <h3>Texto</h3>
            <div className="editor-text-frame">
              <textarea
                ref={textareaRef}
                value={markdown}
                onChange={(event) => setMarkdown(event.target.value)}
                onKeyDown={handleEditorKeyDown}
                onScroll={syncPreviewFromEditor}
                spellCheck={false}
                aria-label="Editor markdown"
              />
            </div>
          </div>
        </div>

        <div className="editor-pane">
          <h3>Preview</h3>
          <div className="preview-scroller" onScroll={syncEditorFromPreview}>
            <MarkdownPreview markdown={markdown} imageMap={imageMap} docPath={currentDocPath} containerRef={previewRef} />
          </div>
        </div>
      </div>
    </section>
  )
}