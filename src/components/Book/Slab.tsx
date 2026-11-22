import { S } from './geometry'
import { createContext, useContext, type CSSProperties, type ReactNode } from 'react'

/** True when the book is mirrored for RTL; faces counter-flip their content. */
export const MirrorContext = createContext(false)

/** Un-mirrors content drawn on a face of the (mirrored) RTL book. */
export function FaceContent({ children, className = '' }: { children?: ReactNode; className?: string }) {
  const mirrored = useContext(MirrorContext)
  return (
    <div className={`absolute inset-0 ${className}`} style={mirrored ? { transform: 'scaleX(-1)' } : undefined}>
      {children}
    </div>
  )
}

interface SlabProps {
  w: number
  h: number
  t: number
  front?: ReactNode
  back?: ReactNode
  frontClass?: string
  backClass?: string
  /** class for the left/right edge strips and for the top/bottom strips */
  edgeX?: string
  edgeY?: string
  /** omit the strip on the hinge side */
  noHingeEdge?: boolean
  /** omit the strip on the far (x = w) side */
  noFarEdge?: boolean
  style?: CSSProperties
}

/**
 * A box with real thickness: front face at z = t, back face at z = 0 and four
 * edge strips between them. Covers, spine, page block and pages are all slabs.
 */
export function Slab({ w, h, t, front, back, frontClass = '', backClass = '', edgeX, edgeY, noHingeEdge, noFarEdge, style }: SlabProps) {
  return (
    <div className="b3d absolute left-0 top-0" style={{ width: w, height: h, ...style }}>
      {back !== undefined && (
        <div className={`b-face ${backClass}`} style={{ transform: 'rotateY(180deg)' }}>
          <div className="absolute inset-0" style={{ zoom: S }}>{back}</div>
        </div>
      )}
      {edgeX && (
        <>
          {!noHingeEdge && (
            <div className={`b-edge ${edgeX}`} style={{ left: 0, top: 0, width: t, height: h, transformOrigin: 'left', transform: 'rotateY(-90deg)' }} />
          )}
          {!noFarEdge && <div className={`b-edge ${edgeX}`} style={{ left: w, top: 0, width: t, height: h, transformOrigin: 'left', transform: 'rotateY(-90deg)' }} />}
        </>
      )}
      {edgeY && (
        <>
          <div className={`b-edge ${edgeY}`} style={{ left: 0, top: 0, width: w, height: t, transformOrigin: 'top', transform: 'rotateX(90deg)' }} />
          <div className={`b-edge ${edgeY}`} style={{ left: 0, top: h - t, width: w, height: t, transformOrigin: 'bottom', transform: 'rotateX(-90deg)' }} />
        </>
      )}
      {front !== undefined && (
        <div className={`b-face ${frontClass}`} style={{ transform: `translateZ(${t}px)` }}>
          <div className="absolute inset-0" style={{ zoom: S }}>{front}</div>
        </div>
      )}
    </div>
  )
}
