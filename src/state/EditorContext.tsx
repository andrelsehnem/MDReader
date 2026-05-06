import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type PropsWithChildren,
} from 'react'
import { EditorContext, type ImageMap } from './useEditorContext.ts'

const STORAGE_KEY = 'mdreader-editor-draft'
const MARKDOWN_HISTORY_LIMIT = 5000

type PersistedDraft = {
  markdown: string
  documentTitle: string
  currentDocPath: string
}

type MarkdownHistoryState = {
  markdown: string
  undoStack: string[]
  redoStack: string[]
}

type MarkdownHistoryAction =
  | { type: 'set-markdown'; payload: string }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'reset'; payload: string }

const pushWithLimit = (values: string[], nextValue: string) => {
  if (values.length >= MARKDOWN_HISTORY_LIMIT) {
    return [...values.slice(1), nextValue]
  }

  return [...values, nextValue]
}

const prependWithLimit = (values: string[], nextValue: string) => {
  return [nextValue, ...values].slice(0, MARKDOWN_HISTORY_LIMIT)
}

const markdownHistoryReducer = (
  state: MarkdownHistoryState,
  action: MarkdownHistoryAction,
): MarkdownHistoryState => {
  switch (action.type) {
    case 'set-markdown': {
      if (action.payload === state.markdown) {
        return state
      }

      return {
        markdown: action.payload,
        undoStack: pushWithLimit(state.undoStack, state.markdown),
        redoStack: [],
      }
    }
    case 'undo': {
      if (state.undoStack.length === 0) {
        return state
      }

      const nextMarkdown = state.undoStack[state.undoStack.length - 1]
      const nextUndoStack = state.undoStack.slice(0, -1)

      return {
        markdown: nextMarkdown,
        undoStack: nextUndoStack,
        redoStack: prependWithLimit(state.redoStack, state.markdown),
      }
    }
    case 'redo': {
      if (state.redoStack.length === 0) {
        return state
      }

      const nextMarkdown = state.redoStack[0]
      const nextRedoStack = state.redoStack.slice(1)

      return {
        markdown: nextMarkdown,
        undoStack: pushWithLimit(state.undoStack, state.markdown),
        redoStack: nextRedoStack,
      }
    }
    case 'reset': {
      return {
        markdown: action.payload,
        undoStack: [],
        redoStack: [],
      }
    }
    default:
      return state
  }
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
  const [markdownState, dispatchMarkdownAction] = useReducer(markdownHistoryReducer, {
    markdown: initialDraft.markdown,
    undoStack: [],
    redoStack: [],
  })
  const [documentTitle, setDocumentTitle] = useState(initialDraft.documentTitle)
  const [imageMap, setImageMapState] = useState<ImageMap>({})
  const [currentDocPath, setCurrentDocPath] = useState(initialDraft.currentDocPath)

  const setMarkdown = useCallback((nextValue: string) => {
    dispatchMarkdownAction({ type: 'set-markdown', payload: nextValue })
  }, [])

  const undo = useCallback(() => {
    dispatchMarkdownAction({ type: 'undo' })
  }, [])

  const redo = useCallback(() => {
    dispatchMarkdownAction({ type: 'redo' })
  }, [])

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
    dispatchMarkdownAction({ type: 'reset', payload: '' })
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
      markdown: markdownState.markdown,
      documentTitle,
      currentDocPath,
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draftToPersist))
  }, [markdownState.markdown, documentTitle, currentDocPath])

  const value = useMemo(
    () => ({
      markdown: markdownState.markdown,
      setMarkdown,
      undo,
      redo,
      canUndo: markdownState.undoStack.length > 0,
      canRedo: markdownState.redoStack.length > 0,
      documentTitle,
      setDocumentTitle,
      imageMap,
      setImageMap,
      currentDocPath,
      setCurrentDocPath,
      clearDraft,
    }),
    [markdownState, setMarkdown, undo, redo, documentTitle, imageMap, currentDocPath, setImageMap, clearDraft],
  )

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}
