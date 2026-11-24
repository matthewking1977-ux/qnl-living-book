import { S } from './geometry'
import { createContext, useContext, type CSSProperties, type ReactNode } from 'react'

/** True when the book is mirrored for RTL; faces counter-flip their content. */
export const MirrorContext = createContext(false)

/**
 * True for the portrait (phone) book: the whole book is turned 90° so the spine is at
 * the top and pages flip upwards. Face content is turned back so it reads upright.
 */
export const PortraitContext = createContext(false)

/** Un-mirrors (RTL) or un-rotates (portrait) content drawn on a face of the book. */
export function FaceContent({ children, className = '' }: { children?: ReactNode; className?: string }) {
  const mirrored = useContext(MirrorContext)
  const portrait = useContext(PortraitContext)
  if (portrait) {
    // the face is w × h; its content box is h × w, turned back by −90° about the centre
    return (
      <div
        className={`absolute ${className}`}
        style={{ left: '50%', top: '50%', width: 'var(--fh)', height: 'var(--fw)', transform: 'translate(-50%, -50%) rotate(-90deg)' }}
      >
        {children}
      </div>
    )
  }
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
        <div data-face="back" className={`b-face ${backClass}`} style={{ transform: 'rotateY(180deg)' }}>
          <div className="absolute inset-0" style={{ zoom: S, ['--fw' as string]: `${w / S}px`, ['--fh' as string]: `${h / S}px` }}>{back}</div>
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
        <div data-face="front" className={`b-face ${frontClass}`} style={{ transform: `translateZ(${t}px)` }}>
          <div className="absolute inset-0" style={{ zoom: S, ['--fw' as string]: `${w / S}px`, ['--fh' as string]: `${h / S}px` }}>{front}</div>
        </div>
      )}
    </div>
  )
}
