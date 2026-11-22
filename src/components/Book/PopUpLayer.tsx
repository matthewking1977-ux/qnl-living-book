import { useContext } from 'react'
import type { PopUpLayerDef } from '../../data/spreads'
import { M, PH, PW, S } from './geometry'
import { MirrorContext } from './Slab'

export interface PopUpNodes {
  layer: HTMLElement
  shadow: HTMLElement
  stand: number
  yaw: number
  /** −1 wholly on the left page, +1 wholly on the right, 0 bridges the gutter */
  side: number
}

/**
 * One fold-up layer: a cut-out hinged on its bottom edge (the fold line), which
 * lies flat on the page and stands as the spread opens, plus its shadow on the
 * paper. Book drives both through `register`.
 */
export function PopUpLayer({ def, depth, load, register }: { def: PopUpLayerDef; depth: number; load: boolean; register: (n: PopUpNodes | null) => void }) {
  const mirrored = useContext(MirrorContext)
  const w = def.w * PW
  const h = w * def.ratio
  const left = def.x * PW - w / 2
  const foldY = M + def.base * PH
  const cast = Math.max(h * 0.3, 60)

  let layer: HTMLElement | null = null
  let shadow: HTMLElement | null = null
  const sync = () => register(layer && shadow ? { layer, shadow, stand: def.stand ?? 84, yaw: def.yaw ?? 0, side: def.x + def.w / 2 <= 0 ? -1 : def.x - def.w / 2 >= 0 ? 1 : 0 } : null)

  return (
    <>
      {/* contact shadow at the fold, fading away behind the layer */}
      <div
        ref={(el) => { shadow = el; sync() }}
        className="absolute"
        style={{
          left: left - w * 0.04, top: foldY - cast, width: w * 1.08, height: cast + 10,
          opacity: 0,
          transformOrigin: `50% ${cast}px`,
          background:
            'radial-gradient(ellipse 48% 22% at 50% 92%, rgba(20,14,4,.34), transparent 100%), radial-gradient(ellipse 50% 100% at 50% 100%, rgba(20,14,4,.2), transparent 70%)',
        }}
      />
      <div
        ref={(el) => { layer = el; sync() }}
        className="absolute"
        style={{ left, top: foldY - h, width: w, height: h, transformOrigin: 'bottom center', opacity: 0, clipPath: 'inset(-200px -200px 0 -200px)' }}
      >
        <img
          src={load ? def.src : undefined}
          alt=""
          decoding="async"
          draggable={false}
          className="block h-full w-full"
          style={{
            transform: mirrored ? 'scaleX(-1)' : undefined,
            // Depth between layers: each cut-out throws a soft shadow onto whatever stands
            // behind it, and layers further back sit slightly in shade. Static, so it is
            // rasterised once and costs nothing during the scrub.
            filter: `drop-shadow(0 ${3 * S}px ${2 * S}px rgba(12,8,2,.38)) drop-shadow(0 ${12 * S}px ${14 * S}px rgba(12,8,2,.42)) brightness(${0.8 + 0.2 * depth})`,
          }}
        />
      </div>
    </>
  )
}
