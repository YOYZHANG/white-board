import type { Point } from '../types'
import { BaseModel } from './base'

interface Fragment {
  x1: number
  x2: number
  y1: number
  y2: number
  element: SVGGeometryElement
}

interface Line {
  x1: number
  x2: number
  y1: number
  y2: number
}

const PATH_FACTOR = 20

function lineIntersect(line1: Line, line2: Line): boolean {
  const x1 = line1.x1
  const x2 = line1.x2
  const x3 = line2.x1
  const x4 = line2.x2
  const y1 = line1.y1
  const y2 = line1.y2
  const y3 = line2.y1
  const y4 = line2.y2
  const pt_denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
  const pt_x_num = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)
  const pt_y_num = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)
  const btwn = (a: number, b1: number, b2: number): boolean => {
    if ((a >= b1) && (a <= b2))
      return true
    return (a >= b2) && (a <= b1)
  }
  if (pt_denom === 0) {
    return false
  }
  else {
    const pt = {
      x: pt_x_num / pt_denom,
      y: pt_y_num / pt_denom,
    }
    return btwn(pt.x, x1, x2) && btwn(pt.y, y1, y2) && btwn(pt.x, x3, x4) && btwn(pt.y, y3, y4)
  }
}
export default class EraserModel extends BaseModel<SVGAElement> {
  private fragments: Fragment[] = []
  private prev: Point | null = null
  private cur: Point | null = null

  onSelect(el: SVGElement): void {
    if (!el)
      return

    this.fragments.length = 0
    const createElFragment = (children: HTMLCollection) => {
      for (let i = 0; i < children.length; i++) {
        const childEl = children[i]

        if (childEl instanceof SVGGeometryElement) {
          const segLength = childEl.getTotalLength() / PATH_FACTOR
          let sumLen = 0

          while (sumLen <= childEl.getTotalLength()) {
            const pos1 = childEl.getPointAtLength(sumLen)
            const pos2 = childEl.getPointAtLength(sumLen + segLength)

            this.fragments.push({
              x1: pos1.x,
              y1: pos1.y,
              x2: pos2.x,
              y2: pos2.y,
              element: childEl,
            })

            sumLen = sumLen + segLength
          }

          if (childEl.children)
            createElFragment(childEl.children)
        }
      }
    }

    createElFragment(el.children)
  }

  override onStart(point: Point): null {
    this.prev = point

    return null
  }

  override onMove(point: Point): void {
    if (!this.prev)
      return

    this.cur = point

    this.checkAndEraseElement()

    this.prev = { ...this.cur }
  }

  override onEnd(point: Point) {
    this.prev = null
    this.cur = null

    return true
  }

  private checkAndEraseElement() {
    const erased: Fragment[] = []

    this.fragments.forEach((frag) => {
      const line = {
        x1: this.prev!.x,
        y1: this.prev!.y,
        x2: this.cur!.x,
        y2: this.cur!.y,
      }

      if (lineIntersect(line, frag)) {
        const el = frag.element
        erased.push(frag)
        el.remove()
      }
    })
    return erased.length
  }
}
