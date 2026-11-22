/**
 * Book design size. Geometry is built S times larger than the design unit and
 * face content is zoomed by S, so text is rasterised large and the stage only
 * ever scales the book down. That keeps type crisp under 3D transforms.
 */
export const S = 1.5
export const W = 400 * S // cover width
export const H = 540 * S // cover height
export const T = 26 * S // spine width = closed thickness between the boards
export const C = 7 * S // cover board thickness (hardback greyboard)
export const M = 13 * S // the 'squares': how far the boards overhang the pages
export const PW = W - M // page width
export const PH = H - 2 * M // page height
export const LEAF = 2 * S // visible thickness of a turning page
export const LEAF_GAP = 2.5 * S // stacking distance between turning pages
export const LEAVES = 4 // turning pages (one per spread)
export const BLOCK = T - LEAVES * LEAF_GAP // the page block under the turning pages
/** The block relaxes as the book opens, so both sides of a spread sit at a similar height for the pop-ups. */
export const BLOCK_OPEN = 3 * S

/**
 * Everything that can change about the book. The scroll timeline produces one
 * of these per frame; `Book` turns it into transforms. A WebGL book would
 * consume the same object.
 */
export interface BookPose {
  /** screen offset of the book centre from the stage centre, px */
  x: number
  y: number
  scale: number
  /** degrees. ry / rz are given for LTR and mirrored automatically in RTL */
  rx: number
  ry: number
  rz: number
  /** 0 closed … 1 cover fully open */
  open: number
  /** one value per turning page, 0 on the reading side … 1 turned */
  turns: number[]
  /** one value per spread, 0 pop-up folded flat … 1 standing */
  pops: number[]
}

export const POSE_CLOSED: Omit<BookPose, 'scale' | 'x' | 'y' | 'pops'> = {
  rx: 16,
  ry: -34,
  rz: 2,
  open: 0,
  turns: [0, 0, 0, 0],
}
export const POSE_OPEN: Omit<BookPose, 'scale' | 'x' | 'y' | 'pops'> = {
  rx: 36,
  ry: 0,
  rz: 0,
  open: 1,
  turns: [0, 0, 0, 0],
}
