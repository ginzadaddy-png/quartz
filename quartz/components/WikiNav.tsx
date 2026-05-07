import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { pathToRoot } from "../util/path"
import { classNames } from "../util/lang"

const WikiNav: QuartzComponent = ({ fileData, allFiles, displayClass }: QuartzComponentProps) => {
  const baseDir = pathToRoot(fileData.slug!)

  // 분류별 파일 수 — sources/, entities/, concepts/, comparisons/ prefix로 카운트
  const countBy = (prefix: string) =>
    allFiles.filter((f) => {
      const s = f.slug ?? ""
      // 'all' 카탈로그 페이지는 제외
      return s.startsWith(prefix + "/") && !s.endsWith("/all")
    }).length

  const counts = {
    sources: countBy("sources"),
    entities: countBy("entities"),
    concepts: countBy("concepts"),
    comparisons: countBy("comparisons"),
  }

  // 링크 helper — pathToRoot 기준 상대 경로
  const link = (path: string) => `${baseDir}/${path}`

  return (
    <nav class={classNames(displayClass, "wiki-nav")}>
      <div class="wiki-nav-section">
        <h3 class="wiki-nav-heading">탐색</h3>
        <ul>
          <li><a href={baseDir}>메인 페이지</a></li>
          <li><a href={link("overview")}>위키 개요</a></li>
          <li><a href={link("log")}>활동 로그</a></li>
        </ul>
      </div>

      <div class="wiki-nav-section">
        <h3 class="wiki-nav-heading">분류</h3>
        <ul>
          <li>
            <a href={link("sources/all")}>
              <span class="wiki-nav-label">소스</span>
              <span class="wiki-nav-count">{counts.sources}</span>
            </a>
          </li>
          <li>
            <a href={link("entities/all")}>
              <span class="wiki-nav-label">엔티티</span>
              <span class="wiki-nav-count">{counts.entities}</span>
            </a>
          </li>
          <li>
            <a href={link("concepts/all")}>
              <span class="wiki-nav-label">개념</span>
              <span class="wiki-nav-count">{counts.concepts}</span>
            </a>
          </li>
          <li>
            <a href={link("comparisons/all")}>
              <span class="wiki-nav-label">비교 분석</span>
              <span class="wiki-nav-count">{counts.comparisons}</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

WikiNav.css = `
.wiki-nav {
  font-size: 1rem;
  margin-top: 0.8rem;
}

.wiki-nav-section {
  margin-bottom: 1.4rem;
}

.wiki-nav-heading {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--darkgray);
  text-transform: none;
  letter-spacing: 0.02em;
  margin: 0 0 0.5rem 0;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid #c8ccd0;
}

[saved-theme="dark"] .wiki-nav-heading {
  border-bottom-color: rgba(255, 255, 255, 0.18);
}

.wiki-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.wiki-nav li {
  margin: 0;
  padding: 0;
}

.wiki-nav li > a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  color: var(--secondary);
  text-decoration: none !important;
  background: transparent !important;
  transition: background 0.12s;
}

.wiki-nav li > a:hover {
  background: var(--lightgray) !important;
  text-decoration: none !important;
}

.wiki-nav-label {
  flex: 1;
}

.wiki-nav-count {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--gray);
  font-variant-numeric: tabular-nums;
}

[saved-theme="dark"] .wiki-nav li > a:hover {
  background: rgba(255, 255, 255, 0.06) !important;
}
`

export default (() => WikiNav) satisfies QuartzComponentConstructor
