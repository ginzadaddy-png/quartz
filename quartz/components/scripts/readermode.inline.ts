let isReaderMode = false

const emitReaderModeChangeEvent = (mode: "on" | "off") => {
  const event: CustomEventMap["readermodechange"] = new CustomEvent("readermodechange", {
    detail: { mode },
  })
  document.dispatchEvent(event)
}

document.addEventListener("nav", () => {
  const switchReaderMode = () => {
    isReaderMode = !isReaderMode
    const newMode = isReaderMode ? "on" : "off"
    document.documentElement.setAttribute("reader-mode", newMode)
    emitReaderModeChangeEvent(newMode)

    // mode ON 시: 커서 위치 무관하게 사이드바 즉시 숨김
    // pointer-events: none으로 hover 차단 후 600ms 뒤 해제
    if (isReaderMode) {
      document.querySelectorAll<HTMLElement>(".sidebar").forEach((el) => {
        el.classList.add("reader-no-hover")
        setTimeout(() => el.classList.remove("reader-no-hover"), 600)
      })
    }
  }

  for (const readerModeButton of document.getElementsByClassName("readermode")) {
    readerModeButton.addEventListener("click", switchReaderMode)
    window.addCleanup(() => readerModeButton.removeEventListener("click", switchReaderMode))
  }

  // Set initial state
  document.documentElement.setAttribute("reader-mode", isReaderMode ? "on" : "off")
})
