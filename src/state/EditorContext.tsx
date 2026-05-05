import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { EditorContext, type ImageMap } from './useEditorContext.ts'

const STORAGE_KEY = 'mdreader-editor-draft'

type PersistedDraft = {
  markdown: string
  documentTitle: string
  currentDocPath: string
}

const getInitialDraft = (): PersistedDraft => {
  if (typeof window === 'undefined') {
    return {
      markdown: '',
      documentTitle: 'novo',
      currentDocPath: '',
    }
  }

  const rawDraft = window.localStorage.getItem(STORAGE_KEY)
  if (!rawDraft) {
    return {
      markdown: '',
      documentTitle: 'novo',
      currentDocPath: '',
    }
  }

  try {
    const parsedDraft = JSON.parse(rawDraft) as Partial<PersistedDraft>

    return {
      markdown: typeof parsedDraft.markdown === 'string' ? parsedDraft.markdown : '',
      documentTitle: typeof parsedDraft.documentTitle === 'string' && parsedDraft.documentTitle.trim()
        ? parsedDraft.documentTitle
        : 'novo',
      currentDocPath: typeof parsedDraft.currentDocPath === 'string' ? parsedDraft.currentDocPath : '',
    }
  } catch {
    return {
      markdown: '',
      documentTitle: 'novo',
      currentDocPath: '',
    }
  }
}

export function EditorProvider({ children }: PropsWithChildren) {
  const [initialDraft] = useState(getInitialDraft)
  const [markdown, setMarkdown] = useState(initialDraft.markdown)
  const [documentTitle, setDocumentTitle] = useState(initialDraft.documentTitle)
  const [imageMap, setImageMapState] = useState<ImageMap>({})
  const [currentDocPath, setCurrentDocPath] = useState(initialDraft.currentDocPath)

  const setImageMap = useCallback((nextMap: ImageMap) => {
    setImageMapState((previousMap) => {
      const oldValues = new Set(Object.values(previousMap))
      const nextValues = new Set(Object.values(nextMap))

      oldValues.forEach((oldValue) => {
        if (oldValue.startsWith('blob:') && !nextValues.has(oldValue)) {
          URL.revokeObjectURL(oldValue)
        }
      })

      return nextMap
    })
  }, [])

  const clearDraft = useCallback(() => {
    setMarkdown('')
    setDocumentTitle('novo')
    setCurrentDocPath('novo.md')
    setImageMap({})

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [setImageMap])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const draftToPersist: PersistedDraft = {
      markdown,
      documentTitle,
      currentDocPath,
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draftToPersist))
  }, [markdown, documentTitle, currentDocPath])

  const value = useMemo(
    () => ({
      markdown,
      setMarkdown,
      documentTitle,
      setDocumentTitle,
      imageMap,
      setImageMap,
      currentDocPath,
      setCurrentDocPath,
      clearDraft,
    }),
    [markdown, documentTitle, imageMap, currentDocPath, setImageMap, clearDraft],
  )

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}
