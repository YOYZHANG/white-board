import type { Board } from '../board'
import type { DrawingMode } from '../types'
import type { BaseModel } from './base'
import LineModel from './line'
import RectModel from './rect'
import EllipseModel from './ellipse'
import DrawModel from './draw'

export function createModels(board: Board): Record<DrawingMode, BaseModel<SVGElement>> {
  return {
    line: new LineModel(board),
    rect: new RectModel(board),
    ellipse: new EllipseModel(board),
    draw: new DrawModel(board),
  }
}
