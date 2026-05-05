import { createContext, useContext } from 'react'

export type ImageMap = Record<string, string>

export type EditorContextValue = {
  markdown: string
  setMarkdown: (value: string) => void
  documentTitle: string
  setDocumentTitle: (value: string) => void
  imageMap: ImageMap
  setImageMap: (value: ImageMap) => void
  currentDocPath: string
  setCurrentDocPath: (value: string) => void
  clearDraft: () => void
}

export const EditorContext = createContext<EditorContextValue | null>(null)

export function useEditorContext() {
  const context = useContext(EditorContext)

  if (!context) {
    throw new Error('useEditorContext must be used within EditorProvider')
  }

  return context
}