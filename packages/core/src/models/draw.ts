import type { Point } from '../types'
import { BaseModel } from './base'

// https://developer.mozilla.org/en-US/docs/Web/SVG/Element/path
function toSvgData(points: Point[]) {
  const svgData: string[] = []
  points.forEach((point, i) => {
    if (i === 0)
      svgData.push(`M ${point.x} ${point.y}`)
    else
      svgData.push(bezierCommand(point, i, points))
  })

  return svgData.join('\n')
}

// https:// developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#quadratic_b%C3%A9zier_curve
function bezierCommand(point: Point, i: number, points: Point[]): string {
  const cps = controlPoint(points[i - 1]!, points[i - 2], point)
  const cpe = controlPoint(point, points[i - 1], points[i + 1], true)

  return `C ${cps.x},${cps.y} ${cpe.x},${cpe.y} ${point.x},${point.y}`
}

// https://francoisromain.medium.com/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74
function line(a: Point, b: Point) {
  const lengthX = b.x - a.x
  const lengthY = b.y - a.y
  return {
    length: Math.sqrt(lengthX ** 2 + lengthY ** 2),
    angle: Math.atan2(lengthY, lengthX),
  }
}

function controlPoint(current: Point, previous: Point | undefined, next: Point | undefined, reverse?: boolean): Point {
  const p = previous || current
  const n = next || current

  // The smoothing ratio
  const smoothing = 0.2
  // Properties of the opposed-line
  const o = line(p, n)
  // If is end-control-point, add PI to the angle to go backward
  const angle = o.angle + (reverse ? Math.PI : 0)
  const length = o.length * smoothing
  // The control point position is relative to the current point
  const x = current.x + Math.cos(angle) * length
  const y = current.y + Math.sin(angle) * length
  return { x, y }
}

function getSqDist(p1: Point, p2: Point) {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y

  return dx * dx + dy * dy
}

function simplifyRadialDist(points: Point[], sqTolerance: number) {
  let prevPoint = points[0] as Point
  const newPoints = [prevPoint] as Point[]
  let point

  for (let i = 1, len = points.length; i < len; i++) {
    point = points[i]

    if (point && getSqDist(point, prevPoint) > sqTolerance) {
      newPoints.push(point)
      prevPoint = point
    }
  }

  if (prevPoint !== point && point)
    newPoints.push(point)

  return newPoints
}

function simplify(points: Point[]): Point[] {
  if (points.length < 2)
    return points

  points = simplifyRadialDist(points, 1)

  return points
}

export default class DrawModel extends BaseModel<SVGPathElement> {
  private points: Point[] = []
  private count = 0
  override onStart(point: Point): SVGPathElement {
    this.el = this.createSVGElement('path')

    this.points.push(point)
    console.log('onstart', point)
    return this.el
  }

  override onMove(point: Point) {
    if (!this.el || !this.start)
      return
    const prevPoint = this.points[this.points.length - 1]

    if (prevPoint && prevPoint.x !== point.x && prevPoint.y !== point.y) {
      this.points.push(point)
      this.count++
    }

    if (this.count > 5) {
      this.points = simplify(this.points)
      this.count = 0
    }

    this.el.setAttribute('d', toSvgData(this.points))
  }

  override onEnd(point: Point) {
    const path = this.el
    this.el = null
    this.points.length = 0

    if (!path)
      return false

    if (!path.getTotalLength())
      return false

    // path.setAttribute('d', toSvgData(simplify(this.points)))
    console.log('onend', point)
    return true
  }
}
