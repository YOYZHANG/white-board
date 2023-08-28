import { createCircleElement } from '../operators/circle'
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

    this.elMap.set(path, this)
    return true
  }

  override onSelect(el: SVGRectElement): void {
    const { x, y, width, height } = el.getBBox()
    // 需要绘制圆
    const c1 = createCircleElement({ x, y })
    const c2 = createCircleElement({ x: x + width, y })
    const c3 = createCircleElement({ x, y: y + height })
    const c4 = createCircleElement({ x: x + width, y: y + height })

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.append(c1)
    g.append(c2)
    g.append(c3)
    g.append(c4)

    el.parentNode!.insertBefore(g, el.nextSibling)
  }

  onDrag(point: Point): void {

  }
}
