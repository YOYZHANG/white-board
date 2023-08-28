import 'uno.css'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { createBoard } from '@fycosmos/board'
import type { Brush, DrawingMode } from '../../packages/core/src/types'

const board = createBoard({
  el: 'svg',
})
window.addEventListener('keydown', (e) => {
  // todo
})

document.getElementById('undo')?.addEventListener('click', () => {
  board.undo()
})
document.getElementById('redo')?.addEventListener('click', () => {
  board.redo()
})
document.getElementById('clear')?.addEventListener('click', () => {
  board.clear()
})

document.getElementById('downloads')?.addEventListener('click', () => {
  board.el!.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  const data = board.el?.outerHTML || ''
  const blob = new Blob([data], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'custom.svg'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
})

interface ModelResult {
  el: HTMLElement
  brush: Brush
}
function getModel(id: string, mode: DrawingMode, arrowEnd = false): ModelResult {
  return {
    el: document.getElementById(id)!,
    brush: {
      mode,
      arrowEnd,
    },
  }
}
const models = [
  getModel('draw', 'draw'),
  getModel('line', 'line'),
  getModel('select', 'select'),
  getModel('rect', 'rect'),
  getModel('ellipse', 'ellipse'),
  getModel('eraser', 'eraser'),
]

models.forEach(({ el, brush }) => {
  console.log(el, 'el')
  el.addEventListener('click', () => {
    el.classList.add('active')
    board.mode = brush.mode
  })
})
