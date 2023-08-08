import type { Emitter } from 'nanoevents'
import { createNanoEvents } from 'nanoevents'
import type { Brush, DrawingMode, EventMap, Options } from './types'
import { createModels } from './models'
import type { BaseModel } from './models/base'

function selectSelector(el: string | SVGAElement): SVGAElement | null {
  if (typeof el === 'string')
    return document.querySelector(el)

  return el
}

export class Board {
  public el: SVGElement | null = null
  private emitter: Emitter
  private currentNode: SVGElement | null = null
  public brush: Brush = { mode: 'line', color: 'black', size: '3' }
  private removable: (() => void)[] = []
  private models: Record<DrawingMode, BaseModel<SVGElement>>
  constructor(options: Options) {
    this.emitter = createNanoEvents()

    if (options.el)
      this.mount(options.el)

    if (options.brush)
      this.brush = options.brush

    this.models = createModels(this)
  }

  get model() {
    return this.models[this.mode]
  }

  get mode() {
    return this.brush.mode || 'line'
  }

  set mode(v: DrawingMode) {
    this.brush.mode = v
  }

  on<T extends keyof EventMap>(type: T, fn: EventMap[T]) {
    this.emitter.on(type, fn)
  }

  mount(el: string | SVGAElement) {
    if (this.el)
      throw new Error('[white-board] already mounted')

    this.el = selectSelector(el)

    if (!this.el)
      throw new Error('[white-board] element not found')

    if (this.el.tagName.toLocaleLowerCase() !== 'svg')
      throw new Error('[white-board] element must be svg')

    // 事件监听
    const start = this.eventStart.bind(this)
    const move = this.eventMove.bind(this)
    const end = this.eventEnd.bind(this)

    window.addEventListener('pointerdown', start)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)

    this.removable = [
      () => window.removeEventListener('pointerdown', start),
      () => window.removeEventListener('pointermove', move),
      () => window.removeEventListener('pointerup', end),
      () => window.removeEventListener('pointercancel', end),
    ]

    this.emitter.emit('mounted')
  }

  unmount() {
    this.removable.forEach(fn => fn())
  }

  private eventStart(e: PointerEvent) {
    // 处理如果 currentNode 已经存在的情况
    this.currentNode = this.model.eventDown(e)
    if (this.currentNode)
      this.el?.appendChild(this.currentNode)

    this.emitter.emit('change')
  }

  private eventMove(e: PointerEvent) {
    this.model.eventMove(e)
    this.emitter.emit('change')
  }

  private eventEnd(e: PointerEvent) {
    const result = this.model.eventUp(e)

    if (!result)
      this.cancel()

    else
      this.commit()

    this.emitter.emit('end')
  }

  private cancel() {
    if (this.currentNode) {
      this.el!.removeChild(this.currentNode)
      this.currentNode = null
      this.emitter.emit('canceled')
    }
  }

  private commit() {
    this.currentNode = null
    this.emitter.emit('committed')
  }
}

export function createBoard(options: Options) {
  return new Board(options)
}
