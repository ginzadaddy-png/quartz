// index.md의 pill-grid 버튼들을 라벨/디테일로 분리한다.
// 마크다운 wikilink는 `[[slug|짧은 라벨 — 부연 설명]]` 형식이고,
// 기본 표시는 짧은 라벨만, hover 시 전체 텍스트를 layer로 펼친다.
function setupPillGrid() {
  const pills = document.querySelectorAll<HTMLAnchorElement>(
    ".pill-grid > ul > li > a",
  )
  pills.forEach((a) => {
    if (a.querySelector(".pill-label")) return // 이미 처리됨
    const text = a.textContent ?? ""
    const sepIdx = text.indexOf(" — ")
    if (sepIdx === -1) return // 디테일 없음 — 그대로 둠

    const label = text.slice(0, sepIdx)

    a.innerHTML = ""
    const labelSpan = document.createElement("span")
    labelSpan.className = "pill-label"
    labelSpan.textContent = label
    a.appendChild(labelSpan)

    const detailSpan = document.createElement("span")
    detailSpan.className = "pill-detail"
    detailSpan.textContent = text // 라벨 + " — " + 디테일 전체
    a.appendChild(detailSpan)

    a.classList.add("has-detail")
  })
}

document.addEventListener("nav", setupPillGrid)
