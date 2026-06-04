import { useLayoutEffect, useRef, useImperativeHandle, forwardRef } from "preact/compat"
import gsap from "gsap"

// 主色 / 强调色 + 中性色，构成魔方贴片配色
const PALETTE = ["#00e6c3", "#ff5d73", "#f4f4f8", "#14141f", "#8a8aa0"]

const FACES = ["front", "back", "right", "left", "top", "bottom"] as const

const DEFAULT_X = -22
const DEFAULT_Y = -28

function Face({ name }: { name: string }) {
  // 每个面 9 个格子，颜色按面做稳定的伪随机分布
  const cells = Array.from({ length: 9 }, (_, i) => {
    const seed = (name.charCodeAt(0) + i * 37) % PALETTE.length
    return PALETTE[seed]
  })
  return (
    <div class={`face face-${name}`}>
      {cells.map((c, i) => (
        <div key={i} class="cell" style={{ background: c }} />
      ))}
    </div>
  )
}

export interface CubeHandle {
  /** 旋转一周展示动画 */
  spin: () => void
  /** 回到初始角度 */
  reset: () => void
}

export const Cube = forwardRef<CubeHandle>((_, ref) => {
  const stageRef = useRef<HTMLDivElement>(null)
  const cubeRef = useRef<HTMLDivElement>(null)
  const state = useRef({ x: DEFAULT_X, y: DEFAULT_Y })

  useLayoutEffect(() => {
    const el = cubeRef.current
    const stage = stageRef.current
    if (!el || !stage) return

    const scene = el.closest(".scene") as HTMLElement | null
    if (!scene) return

    let leaveTween: gsap.core.Tween | null = null
    let introTween: gsap.core.Tween | null = null
    let dragging = false
    let lastX = 0
    let lastY = 0

    const applyRotation = (x: number, y: number) => {
      state.current.x = x
      state.current.y = y
      gsap.set(el, {
        rotateX: x,
        rotateY: y,
        force3D: true,
        transformPerspective: 1100,
        overwrite: "auto",
      })
    }

    const stopLeaveTween = () => {
      leaveTween?.kill()
      leaveTween = null
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return

      introTween?.kill()
      introTween = null
      stopLeaveTween()
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      stage.classList.add("dragging")
      stage.setPointerCapture(e.pointerId)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (dragging) {
        const dx = e.clientX - lastX
        const dy = e.clientY - lastY
        lastX = e.clientX
        lastY = e.clientY
        applyRotation(state.current.x - dy * 0.55, state.current.y + dx * 0.55)
        return
      }

      const rect = scene.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width - 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5
      applyRotation(-ny * 120, nx * 120)
    }

    const onSceneMove = (e: PointerEvent) => {
      if (dragging) return
      introTween?.kill()
      introTween = null
      stopLeaveTween()
      onPointerMove(e)
    }

    const endDrag = (e: PointerEvent) => {
      if (!dragging) return

      dragging = false
      stage.classList.remove("dragging")
      if (stage.hasPointerCapture(e.pointerId)) {
        stage.releasePointerCapture(e.pointerId)
      }
    }

    const onLeave = () => {
      if (dragging) return

      stopLeaveTween()
      leaveTween = gsap.to(state.current, {
        x: DEFAULT_X,
        y: DEFAULT_Y,
        duration: 1.4,
        ease: "elastic.out(1, 0.5)",
        onUpdate: () => applyRotation(state.current.x, state.current.y),
      })
    }

    introTween = gsap.fromTo(
      el,
      { scale: 0.6, opacity: 0, rotateX: -90, rotateY: 0 },
      {
        scale: 1,
        opacity: 1,
        rotateX: DEFAULT_X,
        rotateY: DEFAULT_Y,
        duration: 1.2,
        ease: "back.out(1.6)",
        onComplete: () => {
          introTween = null
          applyRotation(DEFAULT_X, DEFAULT_Y)
        },
      },
    )

    stage.addEventListener("pointerdown", onPointerDown)
    stage.addEventListener("pointermove", onPointerMove)
    stage.addEventListener("pointerup", endDrag)
    stage.addEventListener("pointercancel", endDrag)
    scene.addEventListener("pointermove", onSceneMove)
    scene.addEventListener("pointerleave", onLeave)

    return () => {
      introTween?.kill()
      stopLeaveTween()
      stage.removeEventListener("pointerdown", onPointerDown)
      stage.removeEventListener("pointermove", onPointerMove)
      stage.removeEventListener("pointerup", endDrag)
      stage.removeEventListener("pointercancel", endDrag)
      scene.removeEventListener("pointermove", onSceneMove)
      scene.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  useImperativeHandle(ref, () => ({
    spin: () => {
      const el = cubeRef.current
      if (!el || gsap.isTweening(el)) return
      gsap.killTweensOf(el)
      gsap.to(el, {
        rotateY: "+=360",
        rotateX: "+=180",
        duration: 1.4,
        ease: "power2.inOut",
        onComplete: () => {
          state.current.x = gsap.getProperty(el, "rotateX") as number
          state.current.y = gsap.getProperty(el, "rotateY") as number
        },
      })
    },
    reset: () => {
      const el = cubeRef.current
      if (!el || gsap.isTweening(el)) return
      gsap.killTweensOf(el)
      state.current.x = DEFAULT_X
      state.current.y = DEFAULT_Y
      gsap.to(el, {
        rotateX: DEFAULT_X,
        rotateY: DEFAULT_Y,
        duration: 1,
        ease: "elastic.out(1, 0.55)",
      })
    },
  }))

  return (
    <div class="stage" ref={stageRef}>
      <div class="cube" ref={cubeRef}>
        {FACES.map((f) => (
          <Face key={f} name={f} />
        ))}
      </div>
      <div class="reflection" />
    </div>
  )
})
