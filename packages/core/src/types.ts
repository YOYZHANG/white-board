export interface EventMap {
  start: () => void
  mounted: () => void
  change: () => void
  canceled: () => void
  end: () => void
  committed: () => void
}

export type DrawingMode = 'line' | 'rect' | 'ellipse' | 'draw'
// 'draw' | 'pen' | 'line' | 'ellipse' | 'rect' | 'eraser' | 'arrow'

export interface Brush {
  mode?: DrawingMode
  color?: string
  arrowEnd?: boolean
  fill?: string
  size?: string
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
