import type { Point } from '../types'
import { BaseModel } from './base'

export default class RectModel extends BaseModel<SVGRectElement> {
  override onStart(point: Point): SVGRectElement {
    const el = this.createSVGElement('rect')

    el.setAttribute('x', `${point.x}`)
    el.setAttribute('y', `${point.y}`)

    return this.el = el
  }

  override onMove(point: Point) {
    if (!this.el || !this.start)
      return

    const numsort = (a: number, b: number) => a - b

    const [x1, x2] = [this.start.x, point.x].sort(numsort)
    const [y1, y2] = [this.start.y, point.y].sort(numsort)

    const width = x2! - x1!
    const height = y2! - y1!

    this.el.setAttribute('x', `${x1}`)
    this.el.setAttribute('y', `${y1}`)

    this.el.setAttribute('width', `${width}`)
    this.el.setAttribute('height', `${height}`)
  }

  override onEnd(point: Point) {
    const path = this.el
    this.el = null

    if (!path)
      return false

    if (!path.getTotalLength())
      return false

    return true
  }
}
