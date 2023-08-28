import type { Board } from '../board'
import type { DrawingMode } from '../types'
import type { BaseModel } from './base'
import LineModel from './arrow'
import RectModel from './rect'
import EllipseModel from './ellipse'
import DrawModel from './draw'
import EraserModel from './eraser'
import SelectModel from './select'

export function createModels(board: Board): Record<DrawingMode, BaseModel<SVGElement>> {
  return {
    line: new LineModel(board),
    rect: new RectModel(board),
    ellipse: new EllipseModel(board),
    draw: new DrawModel(board),
    eraser: new EraserModel(board),
    select: new SelectModel(board),
  }
}
