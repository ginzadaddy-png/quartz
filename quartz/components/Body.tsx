// @ts-ignore
import clipboardScript from "./scripts/clipboard.inline"
// @ts-ignore
import pillGridScript from "./scripts/pill-grid.inline"
import clipboardStyle from "./styles/clipboard.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Body: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return <div id="quartz-body">{children}</div>
}

Body.afterDOMLoaded = clipboardScript + pillGridScript
Body.css = clipboardStyle

export default (() => Body) satisfies QuartzComponentConstructor
