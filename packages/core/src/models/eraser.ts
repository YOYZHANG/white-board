import type { Fragment, Point } from '../types'
import { createElFragment, lineIntersect } from './share'
import { BaseModel } from './base'

export default class EraserModel extends BaseModel<SVGAElement> {
  private fragments: Fragment[] = []
  private prev: Point | null = null
  private cur: Point | null = null

  preCollect(el: SVGElement): void {
    if (!el)
      return

    this.fragments.length = 0

    createElFragment(el.children, this.fragments)
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
        this.elMap.delete(this.el!)
        el.remove()
      }
    })
    return erased.length
  }
}
