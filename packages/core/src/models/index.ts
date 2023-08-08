import type { Board } from '../board'
import type { DrawingMode } from '../types'
import type { BaseModel } from './base'
import LineModel from './line'

export function createModels(board: Board): Record<DrawingMode, BaseModel<SVGElement>> {
  return {
    line: new LineModel(board),
  }
}
