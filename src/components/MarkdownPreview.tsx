import type { RefObject } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import { resolveImageSrc } from '../services/archiveService.ts'

type MarkdownPreviewProps = {
  markdown: string
  imageMap: Record<string, string>
  docPath: string
  containerRef?: RefObject<HTMLDivElement | null>
}

export function MarkdownPreview({ markdown, imageMap, docPath, containerRef }: MarkdownPreviewProps) {
  return (
    <div className="preview-body" ref={containerRef}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          img: ({ src = '', alt = '' }) => (
            <img src={resolveImageSrc(src, imageMap, docPath)} alt={alt} loading="lazy" />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}