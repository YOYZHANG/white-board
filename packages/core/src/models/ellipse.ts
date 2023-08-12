import type { Point } from '../types'
import { BaseModel } from './base'

export default class EllipseModel extends BaseModel<SVGEllipseElement> {
  override onStart(point: Point): SVGEllipseElement {
    const el = this.createSVGElement('ellipse')

    el.setAttribute('cx', `${point.x}`)
    el.setAttribute('cy', `${point.y}`)

    console.log('onstart', point)
    return this.el = el
  }

  override onMove(point: Point) {
    if (!this.el || !this.start)
      return

    const numsort = (a: number, b: number) => a - b

    const [x1, x2] = [this.start.x, point.x].sort(numsort)
    const [y1, y2] = [this.start.y, point.y].sort(numsort)

    const cx = (x2! + x1!) / 2
    const cy = (y2! + y1!) / 2

    const rx = (x2! - x1!) / 2
    const ry = (y2! - y1!) / 2

    this.el.setAttribute('cx', `${cx}`)
    this.el.setAttribute('cy', `${cy}`)

    this.el.setAttribute('rx', `${rx}`)
    this.el.setAttribute('ry', `${ry}`)
  }

  override onEnd(point: Point) {
    const path = this.el
    this.el = null

    if (!path)
      return false

    if (!path.getTotalLength())
      return false

    console.log('onend', point)
    return true
  }
}
