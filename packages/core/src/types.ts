export interface EventMap {
  start: () => void
  mounted: () => void
  change: () => void
  canceled: () => void
  end: () => void
  committed: () => void
}

export type DrawingMode = 'line' | 'rect' | 'ellipse' | 'draw' | 'eraser' | 'select'

export interface Brush {
  mode: DrawingMode
  color?: string
  arrowEnd?: boolean
  fill?: string
  size?: string
  stroke?: string
}

export interface Options {
  el?: string | SVGAElement
  brush?: Brush
}

export interface Point {
  x: number
  y: number
  pressure?: number
}

export interface Fragment {
  x1: number
  x2: number
  y1: number
  y2: number
  element: SVGGeometryElement
}
