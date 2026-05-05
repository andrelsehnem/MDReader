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
  const nextValue = `${before}${template}${after}`

  return {
    nextValue,
    nextStart: selectionStart,
    nextEnd: selectionStart + template.length,
  }
}

export function EditorToolbar({ textareaRef, value, onChange }: EditorToolbarProps) {
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

  return (
    <div className="toolbar" role="toolbar" aria-label="Ações do editor markdown">
      <button type="button" onClick={() => applyBlock('# Título H1\n')}>H1</button>
      <button type="button" onClick={() => applyBlock('## Título H2\n')}>H2</button>
      <button type="button" onClick={() => applyBlock('### Título H3\n')}>H3</button>
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
      <button type="button" onClick={() => applyBlock('- item 1\n- item 2\n')}>Lista</button>
      <button type="button" onClick={() => applyBlock('- [ ] tarefa 1\n- [x] tarefa 2\n')}>Checklist</button>
      <button type="button" onClick={() => applyWrapper({ prefix: '`', suffix: '`', placeholder: 'código' })}>
        Código
      </button>
      <button type="button" onClick={() => applyBlock('```\nseu código\n```\n')}>Bloco código</button>
      <button type="button" onClick={() => applyBlock('> citação\n')}>Citação</button>
      <button type="button" onClick={() => applyBlock('\n---\n')}>Separador</button>
      <button type="button" onClick={() => applyBlock('| Coluna 1 | Coluna 2 |\n| --- | --- |\n| valor | valor |\n')}>
        Tabela
      </button>
    </div>
  )
}