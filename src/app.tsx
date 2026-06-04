import { useRef } from "preact/hooks"
import { Cube, type CubeHandle } from "./components/cube"

export function App() {
  const cubeRef = useRef<CubeHandle>(null)

  return (
    <main class="scene">
      <header class="heading">
        <span class="eyebrow">Preact · CSS 3D · GSAP</span>
        <h1>纯 CSS 打造的可交互 3D 魔方</h1>
        <p>按住魔方拖动，或移动鼠标实时跟随旋转；离开场景时带弹性回弹。</p>
      </header>

      <Cube ref={cubeRef} />

      <footer class="footer">
        <div class="hint">
          <span class="dot" />
          拖动或移动鼠标旋转，悬停按钮触发动画
        </div>
        <div class="controls">
          <button
            class="btn primary"
            onClick={() => cubeRef.current?.spin()}
            onMouseEnter={() => cubeRef.current?.spin()}
          >
            旋转一周
          </button>
          <button
            class="btn"
            onClick={() => cubeRef.current?.reset()}
            onMouseEnter={() => cubeRef.current?.reset()}
          >
            复位
          </button>
        </div>
      </footer>
    </main>
  )
}
