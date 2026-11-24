import { useContext, type CSSProperties } from 'react'
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
  /** V-fold: the two halves and the angle per side */
  halves: [HTMLElement, HTMLElement] | null
  fold: number
}

/**
 * One fold-up layer: a cut-out hinged on its bottom edge (the fold line), which
 * lies flat on the page and stands as the spread opens, plus its shadow on the
 * paper. Book drives both through `register`.
 */
/** Explicit position (portrait book): centre x, fold line y and width, in the parent's px. */
export interface Placement {
  x: number
  foldY: number
  w: number
  /** which page the piece stands on, as in PopUpNodes.side */
  side: number
}

export function PopUpLayer({ def, depth, load, register, soft = true, place }: { def: PopUpLayerDef; depth: number; load: boolean; register: (n: PopUpNodes | null) => void; soft?: boolean; place?: Placement }) {
  const mirrored = useContext(MirrorContext)
  const w = place ? place.w : def.w * PW
  const h = w * def.ratio
  const left = place ? place.x - w / 2 : def.x * PW - w / 2
  const foldY = place ? place.foldY : M + def.base * PH
  const cast = Math.max(h * 0.3, 60)

  const folded = !!def.fold && !mirrored

  let layer: HTMLElement | null = null
  let shadow: HTMLElement | null = null
  const halves: (HTMLElement | null)[] = [null, null]
  const sync = () =>
    register(
      layer && shadow && (!folded || (halves[0] && halves[1]))
        ? {
            layer,
            shadow,
            stand: def.stand ?? 84,
            yaw: def.yaw ?? 0,
            side: place ? place.side : def.x + def.w / 2 <= 0 ? -1 : def.x - def.w / 2 >= 0 ? 1 : 0,
            halves: folded ? [halves[0]!, halves[1]!] : null,
            fold: def.fold ?? 0,
          }
        : null,
    )

  // Static per-layer finish, rasterised once: a soft shadow onto whatever stands behind,
  // slight shade on layers further back, and (desktop) a little depth of field on the
  // two rearmost layers so the eye goes to the front of the scene.
  const blur = soft ? Math.max(0, 1 - depth * 3) * 1.6 * S : 0
  const finish = (light: number) =>
    `drop-shadow(0 ${3 * S}px ${2 * S}px rgba(12,8,2,.38)) drop-shadow(0 ${12 * S}px ${14 * S}px rgba(12,8,2,.42)) brightness(${(0.8 + 0.2 * depth) * light})${blur > 0.2 ? ` blur(${blur.toFixed(2)}px)` : ''}`
  const img = (style: CSSProperties, light = 1) => (
    <img
      src={load ? def.src : undefined}
      alt=""
      decoding="async"
      draggable={false}
      className="block h-full"
      style={{ filter: finish(light), ...style }}
    />
  )

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
        style={{
          left, top: foldY - h, width: w, height: h, transformOrigin: 'bottom center', opacity: 0,
          // a flat card clips its shadow at the fold line; a V-fold stays 3D, so its halves clip instead
          clipPath: folded ? undefined : 'inset(-200px -200px 0 -200px)',
        }}
      >
        {folded ? (
          <>
            {/* left half, hinged on the crease; lit from the upper left */}
            <div
              ref={(el) => { halves[0] = el; sync() }}
              className="absolute inset-y-0 left-0 w-1/2"
              style={{ transformOrigin: 'right center', clipPath: 'inset(-200px 0 0 -200px)' }}
            >
              {img({ position: 'absolute', left: 0, top: 0, width: '200%', maxWidth: 'none' }, 1.04)}
            </div>
            {/* right half, turned away from the light */}
            <div
              ref={(el) => { halves[1] = el; sync() }}
              className="absolute inset-y-0 right-0 w-1/2"
              style={{ transformOrigin: 'left center', clipPath: 'inset(-200px -200px 0 0)' }}
            >
              {img({ position: 'absolute', left: '-100%', top: 0, width: '200%', maxWidth: 'none' }, 0.86)}
            </div>
          </>
        ) : (
          img({ width: '100%', transform: mirrored ? 'scaleX(-1)' : undefined })
        )}
      </div>
    </>
  )
}
