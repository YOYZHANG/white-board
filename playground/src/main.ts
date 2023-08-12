import 'uno.css'
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
  // getModel('arrow', 'arrow'),
  getModel('rect', 'rect'),
  getModel('ellipse', 'ellipse'),
  getModel('eraser', 'eraser'),
]

models.forEach(({ el, brush }) => {
  el.addEventListener('click', () => {
    el.classList.add('active')
    board.mode = brush.mode
  })
})
