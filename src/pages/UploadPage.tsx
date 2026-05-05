import { useMemo, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { MarkdownPreview } from '../components/MarkdownPreview.tsx'
import { extractFromRar, extractFromZip } from '../services/archiveService.ts'
import { useEditorContext } from '../state/useEditorContext.ts'

type MarkdownEntry = {
  path: string
  content: string
}

const getFileNameWithoutExtension = (path: string) => {
  const normalized = path.replace(/\\/g, '/')
  const fileName = normalized.split('/').pop() ?? normalized
  const dotIndex = fileName.lastIndexOf('.')
  return dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName
}

export function UploadPage() {
  const navigate = useNavigate()
  const { markdown, setMarkdown, imageMap, setImageMap, currentDocPath, setCurrentDocPath, setDocumentTitle } = useEditorContext()
  const [availableEntries, setAvailableEntries] = useState<MarkdownEntry[]>([])
  const [selectedPath, setSelectedPath] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const hasPreview = useMemo(() => markdown.trim().length > 0, [markdown])

  const applyEntries = (entries: MarkdownEntry[], nextImageMap: Record<string, string>) => {
    setAvailableEntries(entries)
    setImageMap(nextImageMap)

    if (entries.length > 0) {
      setSelectedPath(entries[0].path)
      setCurrentDocPath(entries[0].path)
      setDocumentTitle(getFileNameWithoutExtension(entries[0].path) || 'novo')
      setMarkdown(entries[0].content)
      return
    }

    setSelectedPath('')
    setCurrentDocPath('')
    setDocumentTitle('novo')
    setMarkdown('')
  }

  const handlePlainMarkdown = async (file: File) => {
    const content = await file.text()
    const entry = { path: file.name, content }
    applyEntries([entry], {})
  }

  const handleArchive = async (file: File) => {
    const lowerName = file.name.toLowerCase()

    if (lowerName.endsWith('.zip')) {
      const result = await extractFromZip(file)
      applyEntries(result.markdownEntries, result.imageMap)
      return
    }

    if (lowerName.endsWith('.rar')) {
      const result = await extractFromRar(file)
      applyEntries(result.markdownEntries, result.imageMap)
      return
    }

    throw new Error('Formato não suportado. Envie .md, .zip ou .rar')
  }

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    setIsLoading(true)

    try {
      const lowerName = file.name.toLowerCase()
      if (lowerName.endsWith('.md')) {
        await handlePlainMarkdown(file)
      } else {
        await handleArchive(file)
      }
    } catch (currentError) {
      if (currentError instanceof Error) {
        setError(currentError.message)
      } else {
        setError('Ocorreu um erro ao processar o arquivo.')
      }
    } finally {
      setIsLoading(false)
      event.target.value = ''
    }
  }

  const handleEntryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextPath = event.target.value
    setSelectedPath(nextPath)

    const nextEntry = availableEntries.find((entry) => entry.path === nextPath)
    if (!nextEntry) return

    setCurrentDocPath(nextEntry.path)
    setDocumentTitle(getFileNameWithoutExtension(nextEntry.path) || 'novo')
    setMarkdown(nextEntry.content)
  }

  const handleCreateNew = () => {
    setAvailableEntries([])
    setSelectedPath('')
    setCurrentDocPath('novo.md')
    setDocumentTitle('novo')
    setImageMap({})
    setMarkdown('')
    navigate('/editor')
  }

  return (
    <section className="page">
      <h2>1) Carregar e visualizar</h2>
      <p className="page-subtitle">
        Envie um arquivo <strong>.md</strong> ou um pacote <strong>.zip / .rar</strong> com markdown e imagens.
      </p>

      <div className="card">
        <label className="upload-label" htmlFor="upload-file">
          Escolher arquivo
        </label>
        <input id="upload-file" type="file" accept=".md,.zip,.rar" onChange={onFileChange} />
        <button type="button" onClick={handleCreateNew}>
          Criar novo .md do zero
        </button>
        {isLoading ? <p>Processando arquivo...</p> : null}
        {error ? <p className="error">{error}</p> : null}
      </div>

      {availableEntries.length > 1 ? (
        <div className="card">
          <label htmlFor="markdown-select">Escolha o markdown do pacote:</label>
          <select id="markdown-select" value={selectedPath} onChange={handleEntryChange}>
            {availableEntries.map((entry) => (
              <option key={entry.path} value={entry.path}>
                {entry.path}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {hasPreview ? (
        <>
          <div className="card card-preview">
            <h3>Pré-visualização</h3>
            <MarkdownPreview markdown={markdown} imageMap={imageMap} docPath={currentDocPath} />
          </div>
          <div className="page-actions">
            <button type="button" onClick={() => navigate('/editor')}>
              Ir para editor
            </button>
          </div>
        </>
      ) : null}
    </section>
  )
}