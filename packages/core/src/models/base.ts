import type { Board } from '../board'
import type { Brush, Point } from '../types'

export abstract class BaseModel<T extends SVGElement> {
  protected el: T | null = null

  private containerEl: SVGElement
  private brush: Brush
  protected start!: Point
  constructor(board: Board) {
    this.containerEl = board.el!
    this.brush = board.brush
  }

  onStart(point: Point): T | null {
    return null
  }

  onMove(point: Point) {}
  onEnd(point: Point): boolean {
    return true
  }

  eventDown(e: PointerEvent) {
    const point = this.getMousePosition(e)
    this.start = point
    return this.onStart(point)
  }

  eventMove(e: PointerEvent) {
    const point = this.getMousePosition(e)
    this.onMove(point)
  }

  eventUp(e: PointerEvent) {
    const point = this.getMousePosition(e)
    return this.onEnd(point)
  }

  private getMousePosition(event: PointerEvent) {
    const rect = this.containerEl.getBoundingClientRect()
    return {
      x: event.pageX - rect.left,
      y: event.pageY - rect.top,
      pressure: event.pressure,
    }
  }

  protected createSVGElement<T extends keyof SVGElementTagNameMap>(name: T, override?: Partial<Brush>) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', name)

    const brush = override
      ? {
          ...this.brush,
          ...override,
        }
      : this.brush

    el.setAttribute('fill', brush.fill ?? 'transport')
    el.setAttribute('stroke.width', brush.size!)
    el.setAttribute('stroke', brush.color!)
    el.setAttribute('stroke-linecap', 'round')

    console.log('createSVGElement', el)
    return el
  }
}
