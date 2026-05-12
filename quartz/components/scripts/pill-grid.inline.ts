// index.md의 pill-grid 버튼들을 라벨/디테일로 분리한다.
// 기본 표시: 라벨만 (CSS에서 .pill-detail 숨김)
// hover 시: detail이 inline으로 노출 + a max-width 280→520 확장
// 옆 li 밀어내지 않도록 li에 라벨 자연 너비를 width로 고정하고
// a는 absolute로 li 안을 채움. hover 확장 시 a가 li 밖으로 떠올라 침범.
function setupPillGrid() {
  const pills = document.querySelectorAll<HTMLAnchorElement>(
    ".pill-grid > ul > li > a",
  )
  pills.forEach((a) => {
    if (a.querySelector(".pill-label")) return // 이미 처리됨
    const text = a.textContent ?? ""
    const sepIdx = text.indexOf(" — ")
    if (sepIdx === -1) return

    const label = text.slice(0, sepIdx)
    const detail = text.slice(sepIdx)

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

  // 폰트 로드 후 라벨 자연 너비 측정 → li.width 고정
  // (a가 hover 시 absolute로 떠올라도 li 자리가 유지되도록)
  const fixLiWidth = () => {
    const items = document.querySelectorAll<HTMLLIElement>(
      ".pill-grid > ul > li",
    )
    items.forEach((li) => {
      if (li.dataset.widthFixed === "true") return
      const a = li.querySelector("a") as HTMLAnchorElement | null
      if (!a) return
      const w = a.offsetWidth
      if (w > 0) {
        li.style.width = w + "px"
        li.dataset.widthFixed = "true"
      }
    })
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => requestAnimationFrame(fixLiWidth))
  } else {
    requestAnimationFrame(fixLiWidth)
  }
}

document.addEventListener("nav", setupPillGrid)
