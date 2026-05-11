// @ts-ignore
import clipboardScript from "./scripts/clipboard.inline"
// @ts-ignore
import pillGridScript from "./scripts/pill-grid.inline"
import clipboardStyle from "./styles/clipboard.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Body: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return <div id="quartz-body">{children}</div>
}

// 두 inline 스크립트를 IIFE로 격리해서 minified 변수 충돌 방지
Body.afterDOMLoaded = `;(function(){${clipboardScript}})();(function(){${pillGridScript}})();`
Body.css = clipboardStyle

export default (() => Body) satisfies QuartzComponentConstructor
