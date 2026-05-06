import type { RefObject } from 'react'

type EditorToolbarProps = {
  textareaRef: RefObject<HTMLTextAreaElement | null>
  value: string
  onChange: (value: string) => void
}

type WrapperAction = {
  prefix: string
  suffix?: string
  placeholder?: string
}

const wrapSelection = (
  currentValue: string,
  selectionStart: number,
  selectionEnd: number,
  action: WrapperAction,
) => {
  const selectedText = currentValue.slice(selectionStart, selectionEnd)
  const replacement = `${action.prefix}${selectedText || action.placeholder || ''}${action.suffix ?? ''}`
  const nextValue = `${currentValue.slice(0, selectionStart)}${replacement}${currentValue.slice(selectionEnd)}`

  return {
    nextValue,
    nextStart: selectionStart + action.prefix.length,
    nextEnd: selectionStart + replacement.length - (action.suffix?.length ?? 0),
  }
}

const insertLineBlock = (
  currentValue: string,
  selectionStart: number,
  selectionEnd: number,
  template: string,
) => {
  const before = currentValue.slice(0, selectionStart)
  const after = currentValue.slice(selectionEnd)
  const needsLeadingBreak = before.length > 0 && !before.endsWith('\n')
  const needsTrailingBreak = after.length > 0 && !after.startsWith('\n')
  const normalizedTemplate = `${needsLeadingBreak ? '\n' : ''}${template}${needsTrailingBreak ? '\n' : ''}`
  const nextValue = `${before}${normalizedTemplate}${after}`

  return {
    nextValue,
    nextStart: selectionStart + (needsLeadingBreak ? 1 : 0),
    nextEnd: selectionStart + (needsLeadingBreak ? 1 : 0) + template.length,
  }
}

const prefixSelectedLines = (
  currentValue: string,
  selectionStart: number,
  selectionEnd: number,
  prefix: string,
  placeholder: string,
) => {
  const selectedText = currentValue.slice(selectionStart, selectionEnd)

  if (!selectedText) {
    const replacement = `${prefix}${placeholder}`
    const nextValue = `${currentValue.slice(0, selectionStart)}${replacement}${currentValue.slice(selectionEnd)}`

    return {
      nextValue,
      nextStart: selectionStart,
      nextEnd: selectionStart + replacement.length,
    }
  }

  const replacement = selectedText
    .split('\n')
    .map((line) => (line.trim().length ? `${prefix}${line}` : line))
    .join('\n')

  const nextValue = `${currentValue.slice(0, selectionStart)}${replacement}${currentValue.slice(selectionEnd)}`

  return {
    nextValue,
    nextStart: selectionStart,
    nextEnd: selectionStart + replacement.length,
  }
}

export function EditorToolbar({ textareaRef, value, onChange }: EditorToolbarProps) {
  const keepSelectionOnToolbarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLButtonElement) {
      event.preventDefault()
    }
  }

  const applyWrapper = (action: WrapperAction) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const { nextValue, nextStart, nextEnd } = wrapSelection(
      value,
      textarea.selectionStart,
      textarea.selectionEnd,
      action,
    )

    onChange(nextValue)
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(nextStart, nextEnd)
    })
  }

  const applyBlock = (template: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const { nextValue, nextStart, nextEnd } = insertLineBlock(
      value,
      textarea.selectionStart,
      textarea.selectionEnd,
      template,
    )

    onChange(nextValue)
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(nextStart, nextEnd)
    })
  }

  const applyLinePrefix = (prefix: string, placeholder: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const { nextValue, nextStart, nextEnd } = prefixSelectedLines(
      value,
      textarea.selectionStart,
      textarea.selectionEnd,
      prefix,
      placeholder,
    )

    onChange(nextValue)
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(nextStart, nextEnd)
    })
  }

  return (
    <div
      className="toolbar"
      role="toolbar"
      aria-label="Ações do editor markdown"
      onMouseDown={keepSelectionOnToolbarClick}
    >
      <button type="button" onClick={() => applyLinePrefix('# ', 'Título H1')}>H1</button>
      <button type="button" onClick={() => applyLinePrefix('## ', 'Título H2')}>H2</button>
      <button type="button" onClick={() => applyLinePrefix('### ', 'Título H3')}>H3</button>
      <button type="button" onClick={() => applyBlock('<br>\n')}>Quebra</button>
      <button type="button" onClick={() => applyWrapper({ prefix: '**', suffix: '**', placeholder: 'texto' })}>
        Negrito
      </button>
      <button type="button" onClick={() => applyWrapper({ prefix: '*', suffix: '*', placeholder: 'texto' })}>
        Itálico
      </button>
      <button
        type="button"
        onClick={() => applyWrapper({ prefix: '[', suffix: '](https://exemplo.com)', placeholder: 'texto do link' })}
      >
        Link
      </button>
      <button
        type="button"
        onClick={() => applyWrapper({ prefix: '![', suffix: '](./imagem.png)', placeholder: 'descrição' })}
      >
        Imagem
      </button>
      <button type="button" onClick={() => applyLinePrefix('- ', 'item')}>Lista</button>
      <button type="button" onClick={() => applyLinePrefix('- [ ] ', 'tarefa')}>Checklist</button>
      <button type="button" onClick={() => applyWrapper({ prefix: '`', suffix: '`', placeholder: 'código' })}>
        Código
      </button>
      <button type="button" onClick={() => applyBlock('```\nseu código\n```\n')}>Bloco código</button>
      <button type="button" onClick={() => applyLinePrefix('> ', 'citação')}>Citação</button>
      <button type="button" onClick={() => applyBlock('\n---\n')}>Separador</button>
      <button type="button" onClick={() => applyBlock('| Coluna 1 | Coluna 2 |\n| --- | --- |\n| valor | valor |\n')}>
        Tabela
      </button>
    </div>
  )
}