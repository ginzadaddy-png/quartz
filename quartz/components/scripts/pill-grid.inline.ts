// index.md의 모든 pill-grid 버튼을 label/detail span으로 분리한다.
// hover 시 .pill-detail layer가 a 위로 펼쳐짐 (라벨이 짧으면 시각적으로 색 변화에 가까움).
// 분기 없는 동기 처리 — document.fonts/RAF 비동기 측정 시 타이밍 불일치로
// 일부 pill만 has-* 클래스가 안 붙는 문제를 회피.
function setupPillGrid() {
  const pills = document.querySelectorAll<HTMLAnchorElement>(
    ".pill-grid > ul > li > a",
  )
  pills.forEach((a) => {
    if (a.querySelector(".pill-label")) return // 이미 처리됨
    const text = a.textContent ?? ""
    const sepIdx = text.indexOf(" — ")
    const label = sepIdx > -1 ? text.slice(0, sepIdx) : text

    a.innerHTML = ""
    const labelSpan = document.createElement("span")
    labelSpan.className = "pill-label"
    labelSpan.textContent = label
    a.appendChild(labelSpan)

    const detailSpan = document.createElement("span")
    detailSpan.className = "pill-detail"
    detailSpan.textContent = text // 라벨이 짧으면 label과 동일, 길면 전체
    a.appendChild(detailSpan)

    a.classList.add("has-detail")
  })
}

document.addEventListener("nav", setupPillGrid)
