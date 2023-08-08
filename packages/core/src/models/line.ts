import type { Point } from '../types'
import { BaseModel } from './base'

export default class LineModel extends BaseModel<SVGLineElement> {
  override onStart(point: Point): SVGLineElement {
    const el = this.createSVGElement('line')

    el.setAttribute('x1', `${point.x}`)
    el.setAttribute('y1', `${point.y}`)
    el.setAttribute('x2', `${point.x}`)
    el.setAttribute('y2', `${point.y}`)

    console.log('onstart', point)
    return this.el = el
  }

  override onMove(point: Point) {
    if (!this.el)
      return

    this.el.setAttribute('x1', `${this.start.x}`)
    this.el.setAttribute('y1', `${this.start.y}`)
    this.el.setAttribute('x2', `${point.x}`)
    this.el.setAttribute('y2', `${point.y}`)

    console.log('onmove', point)
  }

  override onEnd(point: Point) {
    const path = this.el
    this.el = null

    if (!path)
      return false

    console.log('onend', point)
    return true
  }
}
