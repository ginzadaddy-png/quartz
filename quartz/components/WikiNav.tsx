import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const WikiNav: QuartzComponent = ({ fileData, allFiles, displayClass }: QuartzComponentProps) => {
  // 분류별 파일 수 — sources/, entities/, concepts/, comparisons/, reports/, decisions/ prefix로 카운트
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
    reports: countBy("reports"),
    decisions: countBy("decisions"),
  }

  // 링크 helper — root-relative 절대 경로 (trailing slash 페이지에서 ../ resolve 실패 회피)
  // pathToRoot이 file URL과 folder URL의 trailing slash 차이로 한 단계 부족하게 계산되는
  // 버그가 있어 baseUrl `quartz/`에 명시적으로 의존하는 절대 경로 사용
  const baseDir = "/quartz"
  const link = (path: string) => `${baseDir}/${path}`

  // 챗봇 delist (2026-09-03): 사이트에서 내림 (테스트 개발, 실사용 계획 없음). 복구 시 이 const + 아래 "AI 챗봇" nav 블록 주석 해제
  // const chatUrl = "https://huggingface.co/spaces/ginzadaddy/ginza-wiki-chat"

  return (
    <nav class={classNames(displayClass, "wiki-nav")}>
      {/* 챗봇 delist (2026-09-03): 복구 시 이 블록 + 위 chatUrl const 주석 해제
      <div class="wiki-nav-section">
        <h3 class="wiki-nav-heading">AI 챗봇</h3>
        <ul>
          <li>
            <a class="wiki-nav-chat" href={chatUrl} target="_blank" rel="noopener">
              💬 위키에 질문하기 ↗
            </a>
          </li>
        </ul>
      </div>
      */}

      <div class="wiki-nav-section">
        <h3 class="wiki-nav-heading">탐색</h3>
        <ul>
          <li><a href={`${baseDir}/`}>메인 페이지</a></li>
          <li><a href={link("overview")}>위키 소개</a></li>
          <li><a href={link("changelog")}>업데이트 소식</a></li>
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
          <li>
            <a href={link("reports/all")}>
              <span class="wiki-nav-label">보고서</span>
              <span class="wiki-nav-count">{counts.reports}</span>
            </a>
          </li>
          <li>
            <a href={link("decisions/all")}>
              <span class="wiki-nav-label">결정·가설</span>
              <span class="wiki-nav-count">{counts.decisions}</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

WikiNav.css = `
.wiki-nav {
  font-size: 0.9rem;
  margin-top: 0.8rem;
}

.wiki-nav-section {
  margin-bottom: 1.4rem;
}

.wiki-nav-heading {
  font-size: 0.86rem;
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
  font-size: 0.9rem;
  font-weight: 500;
  color: #1f4ba8;
  text-decoration: none !important;
  background: transparent !important;
  transition: background 0.12s;
}

[saved-theme="dark"] .wiki-nav li > a {
  color: #88b3e8;
}

.wiki-nav li > a:hover {
  background: var(--lightgray) !important;
  text-decoration: none !important;
}

.wiki-nav-chat {
  font-weight: 600 !important;
  background: rgba(31, 75, 168, 0.07) !important;
}

.wiki-nav-chat:hover {
  background: rgba(31, 75, 168, 0.14) !important;
}

[saved-theme="dark"] .wiki-nav-chat {
  background: rgba(136, 179, 232, 0.10) !important;
}

.wiki-nav-label {
  flex: 1;
}

.wiki-nav-count {
  font-size: 0.77rem;
  font-weight: 500;
  color: var(--gray);
  font-variant-numeric: tabular-nums;
}

[saved-theme="dark"] .wiki-nav li > a:hover {
  background: rgba(255, 255, 255, 0.06) !important;
}
`

export default (() => WikiNav) satisfies QuartzComponentConstructor
