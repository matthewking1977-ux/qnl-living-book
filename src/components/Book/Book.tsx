import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import { spreads } from '../../data/spreads'
import { backOut, clamp01, lerp } from '../../lib/easing'
import { sign, useDir } from '../../lib/dir'
import { BLOCK_L, BLOCK_R, C, H, LEAF, LEAF_GAP, LEAVES, M, PH, PW, T, W, type BookPose } from './geometry'
import { Page, PaperFace, SpreadLead, SpreadTrail } from './Page'
import { PopUpLayer, type PopUpNodes } from './PopUpLayer'
import { FaceContent, MirrorContext, Slab } from './Slab'

export interface BookHandle {
  /** Draw the book in this pose. Transform and opacity writes only. */
  apply(pose: BookPose): void
}

/**
 * CSS-3D hardcover. Coordinates (LTR): x = 0 is the spine hinge, the closed
 * book lies on x 0…W, z points out of the cover. RTL mirrors the whole solid
 * with scaleX(−1) and counter-flips face content, so both directions share one
 * geometry.
 *
 * Hinge chain: back board → spine (hinged at x 0) → front board (hinged at the
 * far end of the spine). Opening lays spine and front board flat to the left,
 * and the page block slides half a spine-width so the gutter sits centred.
 */
export const Book = forwardRef<BookHandle, { pose: BookPose; loadUpTo?: number }>(function Book({ pose, loadUpTo = 0 }, ref) {
  const dir = useDir()
  const mirrored = dir === 'rtl'
  const k = sign(dir)

  const root = useRef<HTMLDivElement>(null)
  const center = useRef<HTMLDivElement>(null)
  const spine = useRef<HTMLDivElement>(null)
  const cover = useRef<HTMLDivElement>(null)
  const block = useRef<HTMLDivElement>(null)
  const sheen = useRef<HTMLDivElement>(null)
  const table = useRef<HTMLDivElement>(null)
  const floor = useRef<HTMLDivElement>(null)
  const leaves = useRef<(HTMLDivElement | null)[]>([])
  const shades = useRef<HTMLElement[][]>([])
  const leftBlock = useRef<HTMLDivElement>(null)
  const pops = useRef<PopUpNodes[][]>(spreads.map(() => []))

  const apply = (p: BookPose) => {
    const o = p.open
    root.current!.style.transform =
      `translate3d(${p.x * k}px,${p.y}px,0) scale(${p.scale}) rotateX(${p.rx}deg) rotateY(${p.ry * k}deg) rotateZ(${p.rz * k}deg)`
    // keep the visual centre of the book on the rotation origin
    center.current!.style.transform = `translate3d(${lerp(-W / 2, T / 2, o)}px,${-H / 2}px,${(-T / 2) * (1 - o)}px)`
    spine.current!.style.transform = `rotateY(${-90 - 90 * o}deg)`
    cover.current!.style.transform = `rotateY(${90 * (1 - o)}deg)`
    block.current!.style.transform = `translate3d(${(-T / 2) * o}px,0,-2px)`
    sheen.current!.style.transform = `translateX(${-30 - p.ry * 1.2}%)`
    table.current!.style.opacity = String(o)
    floor.current!.style.opacity = String(1 - o)
    floor.current!.style.transform = `translate(-50%, ${p.y + (H / 2) * p.scale + 36}px) scale(${p.scale})`

    // the left block rides on the front board and slides to meet the gutter
    leftBlock.current!.style.transform = `translate3d(${(-T / 2) * o}px,0,-2px)`

    for (let i = 0; i < LEAVES; i++) {
      const el = leaves.current[i]
      if (!el) continue
      const t = p.turns[i] ?? 0
      const zRest = BLOCK_R + LEAF_GAP * (LEAVES - 1 - i) + LEAF_GAP / 2 // on the reading-side stack
      const zTurned = BLOCK_L + LEAF_GAP * i + LEAF_GAP / 2 // on the turned stack
      el.style.transform = `translateZ(${lerp(zRest, zTurned, t)}px) rotateY(${-180 * t}deg)`
      const shade = String(Math.sin(Math.PI * t) * 0.45) // darkest at 90°
      const nodes = (shades.current[i] ??= Array.from(el.querySelectorAll<HTMLElement>('[data-shade]')))
      for (const n of nodes) n.style.opacity = shade
    }
    applyPops(p)
  }

  // pop-ups: each layer folds up about its base line, staggered by depth
  const applyPops = (p: BookPose) => {
    for (let i = 0; i < pops.current.length; i++) {
      const u = p.pops[i] ?? 0
      // page surface heights either side of the gutter for this spread
      const zLeft = BLOCK_L + LEAF_GAP * (i + 0.5) + LEAF / 2
      const zRight = i < LEAVES - 1 ? BLOCK_R + LEAF_GAP * (LEAVES - 1.5 - i) + LEAF / 2 : BLOCK_R
      const group = pops.current[i]
      for (let j = 0; j < group.length; j++) {
        const n = group[j]
        if (!n) continue
        // a layer wholly on one page stands on that page; one that bridges the gutter stands on the higher side
        const z = (n.side < 0 ? zLeft : n.side > 0 ? zRight : Math.max(zLeft, zRight)) + 0.6
        const x = clamp01(u * (1 + 0.22 * (group.length - 1)) - 0.22 * j)
        n.layer.style.transform = `translateZ(${z + j * 0.4}px) rotateZ(${n.yaw}deg) rotateX(${-n.stand * backOut(x)}deg)`
        n.layer.style.opacity = String(Math.min(1, x * 7))
        n.shadow.style.transform = `translateZ(${z}px) rotateZ(${n.yaw}deg)`
        n.shadow.style.opacity = String(x)
      }
    }
  }

  useImperativeHandle(ref, () => ({ apply }))
  useLayoutEffect(() => apply(pose), [pose, dir]) // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <MirrorContext.Provider value={mirrored}>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ perspective: 3000 }}>
        {/* floor shadow while the book hovers closed */}
        <div
          ref={floor}
          className="absolute left-1/2 top-1/2 h-16 rounded-[50%]"
          style={{ width: W * 1.25, background: 'radial-gradient(closest-side, rgba(0,0,0,.6), transparent)' }}
        />
        <div ref={root} className="b3d b3d-all absolute left-1/2 top-1/2 h-0 w-0">
          <div style={mirrored ? { transform: 'scaleX(-1)' } : undefined}>
            <div ref={center} className="absolute left-0 top-0">
              {/* shadow on the table while the book lies open */}
              <div
                ref={table}
                className="absolute"
                style={{
                  left: -(T + W), top: 0, width: 2 * W + T, height: H,
                  transform: `translateZ(${-C - 2}px)`,
                  background: 'rgba(0,0,0,.6)',
                  boxShadow: '0 26px 70px 26px rgba(0,0,0,.6)',
                }}
              />

              {/* back board: inside faces up */}
              <Slab
                w={W} h={H} t={C}
                style={{ transform: `translateZ(${-C}px)` }}
                frontClass="cloth grain board" backClass="cloth grain board"
                edgeX="cloth-edge" edgeY="cloth-edge"
                front={<div />} back={<div />}
              />

              {/* spine, hinged at x = 0 */}
              <div ref={spine} className="absolute left-0 top-0" style={{ width: T, height: H, transformOrigin: 'left center' }}>
                <Slab
                  w={T} h={H} t={C}
                  frontClass="cloth grain" backClass="cloth"
                  edgeY="cloth-edge"
                  front={
                    <div className="absolute inset-0">
                      <div className="absolute inset-x-0 top-[9%] h-px bg-white/25" />
                      <div className="absolute inset-x-0 top-[10.2%] h-px bg-white/25" />
                      <div className="absolute inset-x-0 bottom-[9%] h-px bg-white/25" />
                      <div className="absolute inset-x-0 bottom-[10.2%] h-px bg-white/25" />
                    </div>
                  }
                  back={<div />}
                />
                {/* front board, hinged on the far edge of the spine */}
                <div ref={cover} className="absolute top-0" style={{ left: T, width: W, height: H, transformOrigin: 'left center' }}>
                  <Slab
                    w={W} h={H} t={C}
                    frontClass="cloth grain board" backClass="cloth board"
                    edgeX="cloth-edge" edgeY="cloth-edge"
                    front={
                      <>
                        <FaceContent>
                          <div className="absolute bottom-7 left-12 right-7 top-7 border border-white/25" style={{ boxShadow: 'inset 0 0 0 3px #0e0e0e, inset 0 0 0 4px rgba(255,255,255,.12)' }} />
                          <img
                            src="/img/qnl-logo-white.webp" alt="" width={480} height={250}
                            className="absolute left-[53%] top-[36%] w-[48%] -translate-x-1/2 -translate-y-1/2"
                          />
                        </FaceContent>
                        {/* hinge groove */}
                        <div className="absolute inset-y-0 left-4 w-3" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,.1), rgba(0,0,0,.75) 45%, rgba(0,0,0,.5) 60%, rgba(255,255,255,.09))' }} />
                        {/* specular sheen, slides with tilt */}
                        <div
                          ref={sheen}
                          className="absolute inset-y-0 -left-1/2 w-[200%]"
                          style={{ background: 'linear-gradient(100deg, transparent 38%, rgba(255,255,255,.13) 50%, transparent 62%)' }}
                        />
                      </>
                    }
                    back={<div />}
                  />
                  {/* left page block: rides on the inside of the front board, endpaper on top */}
                  <div ref={leftBlock} className="absolute left-0" style={{ top: M, width: PW, height: PH }}>
                    <Slab
                      w={PW} h={PH} t={BLOCK_L}
                      style={{ transform: 'rotateY(180deg)' }}
                      edgeX="pages-x" edgeY="pages-y" noFarEdge
                      front={
                        <PaperFace gutter="right">
                          <img
                            src="/img/qnl-logo-black.webp" alt="" width={480} height={250}
                            className="absolute left-1/2 top-1/2 w-[44%] -translate-x-1/2 -translate-y-1/2 opacity-[0.09]"
                          />
                        </PaperFace>
                      }
                    />
                  </div>
                </div>
              </div>

              {/* page block + turning pages; slides to centre the gutter */}
              <div ref={block} className="absolute left-0 top-0">
                <Slab
                  w={PW} h={PH} t={BLOCK_R}
                  style={{ top: M }}
                  edgeX="pages-x" edgeY="pages-y" noHingeEdge
                  front={
                    <PaperFace gutter="left" bg={spreads[LEAVES - 1].bgPaper}>
                      <SpreadTrail spread={spreads[LEAVES - 1]} />
                    </PaperFace>
                  }
                />
                {/* DOM order = paint order for coplanar cases: last page first */}
                {Array.from({ length: LEAVES }, (_, n) => LEAVES - 1 - n).map((i) => (
                  <Page
                    key={i}
                    ref={(el) => { leaves.current[i] = el }}
                    front={
                      i === 0 ? (
                        <PaperFace gutter="left">
                          <div className="flex h-full items-end justify-center pb-12">
                            <p className="label text-g1" lang="en">Qatar National Library</p>
                          </div>
                        </PaperFace>
                      ) : (
                        <PaperFace gutter="left" bg={spreads[i - 1].bgPaper}>
                          <SpreadTrail spread={spreads[i - 1]} />
                        </PaperFace>
                      )
                    }
                    back={
                      <PaperFace gutter="right" bg={spreads[i].bgPaper}>
                        <SpreadLead spread={spreads[i]} />
                      </PaperFace>
                    }
                  />
                ))}
                {/* pop-up layers, anchored on the gutter */}
                {spreads.map((sp, i) =>
                  sp.layers.map((def, j) => (
                    <PopUpLayer
                      key={def.src}
                      def={def}
                      load={i <= loadUpTo}
                      register={(n) => { pops.current[i][j] = n! }}
                    />
                  )),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MirrorContext.Provider>
  )
})
