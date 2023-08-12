import type { Point } from '../types'
import { BaseModel } from './base'

export default class LineModel extends BaseModel<SVGLineElement> {
  override onStart(point: Point): SVGLineElement {
    const el = this.createSVGElement('line')

    el.setAttribute('x1', `${point.x}`)
    el.setAttribute('y1', `${point.y}`)
    el.setAttribute('x2', `${point.x}`)
    el.setAttribute('y2', `${point.y}`)

    return this.el = el
  }

  override onMove(point: Point) {
    if (!this.el || !this.start)
      return

    this.el.setAttribute('x1', `${this.start.x}`)
    this.el.setAttribute('y1', `${this.start.y}`)
    this.el.setAttribute('x2', `${point.x}`)
    this.el.setAttribute('y2', `${point.y}`)
  }

  override onEnd(point: Point) {
    const path = this.el
    this.el = null

    if (!path)
      return false

    if (path.getTotalLength() < 5)
      return false

    return true
  }
}
