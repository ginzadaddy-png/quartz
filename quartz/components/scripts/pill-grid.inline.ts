// index.md의 pill-grid 버튼들을 라벨/디테일로 분리한다.
// 두 경우에 hover 펼침:
//  1) ` — ` 구분자가 있는 경우 → has-detail, 짧은 라벨 + 전체 detail
//  2) 라벨 자체가 max-width 넘어 ellipsis 잘림 → has-ellipsis, 전체 텍스트 펼침
// 두 케이스 모두 Quartz의 link popover(미리보기)는 그대로 활성화 — hover 시 layer + popover 함께 표시.
function setupPillGrid() {
  const pills = document.querySelectorAll<HTMLAnchorElement>(
    ".pill-grid > ul > li > a",
  )
  pills.forEach((a) => {
    if (a.querySelector(".pill-label")) return // 이미 처리됨
    const text = a.textContent ?? ""
    const sepIdx = text.indexOf(" — ")

    // 케이스 1: ` — ` 구분자 있음
    if (sepIdx > -1) {
      const label = text.slice(0, sepIdx)
      a.innerHTML = ""
      const labelSpan = document.createElement("span")
      labelSpan.className = "pill-label"
      labelSpan.textContent = label
      a.appendChild(labelSpan)
      const detailSpan = document.createElement("span")
      detailSpan.className = "pill-detail"
      detailSpan.textContent = text
      a.appendChild(detailSpan)
      a.classList.add("has-detail")
      return
    }

    // 케이스 2: 구분자 없지만 ellipsis 잘림 측정 (layout/폰트 안정 후)
    const measure = () => {
      // 작은 오차 보정 (sub-pixel)
      if (a.scrollWidth <= a.clientWidth + 1) return
      const labelSpan = document.createElement("span")
      labelSpan.className = "pill-label"
      labelSpan.textContent = text
      const detailSpan = document.createElement("span")
      detailSpan.className = "pill-detail"
      detailSpan.textContent = text
      a.innerHTML = ""
      a.appendChild(labelSpan)
      a.appendChild(detailSpan)
      a.classList.add("has-ellipsis")
    }
    // 폰트 로드 후 측정 (Noto Sans KR이 비동기 로드라 첫 측정이 부정확할 수 있음)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => requestAnimationFrame(measure))
    } else {
      requestAnimationFrame(measure)
    }
  })
}

document.addEventListener("nav", setupPillGrid)
