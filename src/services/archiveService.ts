import JSZip from 'jszip'

type ZipExtractionResult = {
  markdownEntries: Array<{ path: string; content: string }>
  imageMap: Record<string, string>
}

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp']

const normalizePath = (path: string) => path.replace(/\\/g, '/').replace(/^\.\//, '')

const isImage = (path: string) => {
  const lowerPath = path.toLowerCase()
  return IMAGE_EXTENSIONS.some((extension) => lowerPath.endsWith(extension))
}

const getBaseFolder = (filePath: string) => {
  const normalized = normalizePath(filePath)
  const index = normalized.lastIndexOf('/')
  return index >= 0 ? normalized.slice(0, index + 1) : ''
}

const resolveRelativePath = (docPath: string, sourcePath: string) => {
  const cleanSource = normalizePath(sourcePath)
  if (!cleanSource || cleanSource.startsWith('http://') || cleanSource.startsWith('https://') || cleanSource.startsWith('data:')) {
    return cleanSource
  }

  const baseFolder = getBaseFolder(docPath)
  const joined = `${baseFolder}${cleanSource}`
  const segments = joined.split('/').filter(Boolean)
  const stack: string[] = []

  segments.forEach((segment) => {
    if (segment === '.') {
      return
    }

    if (segment === '..') {
      stack.pop()
      return
    }

    stack.push(segment)
  })

  return stack.join('/')
}

export function resolveImageSrc(src: string, imageMap: Record<string, string>, docPath: string) {
  const normalizedSrc = normalizePath(src)
  const byDirectPath = imageMap[normalizedSrc]

  if (byDirectPath) {
    return byDirectPath
  }

  const resolvedPath = resolveRelativePath(docPath, normalizedSrc)
  return imageMap[resolvedPath] ?? src
}

export async function extractFromZip(file: File): Promise<ZipExtractionResult> {
  const zip = await JSZip.loadAsync(file)
  const markdownEntries: Array<{ path: string; content: string }> = []
  const imageMap: Record<string, string> = {}

  const fileEntries = Object.values(zip.files).filter((entry) => !entry.dir)

  for (const entry of fileEntries) {
    const normalizedPath = normalizePath(entry.name)
    const lowerPath = normalizedPath.toLowerCase()

    if (lowerPath.endsWith('.md')) {
      const content = await entry.async('string')
      markdownEntries.push({ path: normalizedPath, content })
      continue
    }

    if (isImage(lowerPath)) {
      const blob = await entry.async('blob')
      imageMap[normalizedPath] = URL.createObjectURL(blob)
    }
  }

  return {
    markdownEntries,
    imageMap,
  }
}

export async function extractFromRar(file: File): Promise<ZipExtractionResult> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/extract-rar', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Não foi possível extrair o arquivo .rar. Verifique se o backend está disponível.')
  }

  const payload = (await response.json()) as {
    markdownEntries: Array<{ path: string; content: string }>
    imageMap: Record<string, string>
  }

  return {
    markdownEntries: payload.markdownEntries ?? [],
    imageMap: payload.imageMap ?? {},
  }
}