// index.md의 pill-grid 버튼들을 라벨/디테일로 분리한다.
// 기본 표시는 라벨만 (CSS에서 detail 숨김), hover 시 detail이 inline으로
// 노출되면서 a 자체의 max-width가 확장되어 자연 너비로 펼쳐짐.
// 별도 absolute layer를 안 써서 위치 이격이 구조적으로 발생하지 않음.
function setupPillGrid() {
  const pills = document.querySelectorAll<HTMLAnchorElement>(
    ".pill-grid > ul > li > a",
  )
  pills.forEach((a) => {
    if (a.querySelector(".pill-label")) return // 이미 처리됨
    const text = a.textContent ?? ""
    const sepIdx = text.indexOf(" — ")
    if (sepIdx === -1) return // 부연 없음 — 그대로 둠

    const label = text.slice(0, sepIdx)
    const detail = text.slice(sepIdx) // " — 부연" (구분자 포함)

    a.innerHTML = ""
    const labelSpan = document.createElement("span")
    labelSpan.className = "pill-label"
    labelSpan.textContent = label
    a.appendChild(labelSpan)

    const detailSpan = document.createElement("span")
    detailSpan.className = "pill-detail"
    detailSpan.textContent = detail
    a.appendChild(detailSpan)

    a.classList.add("has-detail")
  })
}

document.addEventListener("nav", setupPillGrid)
