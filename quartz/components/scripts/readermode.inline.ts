let isReaderMode = false

const emitReaderModeChangeEvent = (mode: "on" | "off") => {
  const event: CustomEventMap["readermodechange"] = new CustomEvent("readermodechange", {
    detail: { mode },
  })
  document.dispatchEvent(event)
}

const isMobile = () => window.innerWidth <= 800

document.addEventListener("nav", () => {
  const leftSidebar = document.querySelector<HTMLElement>(".sidebar.left")

  // 모바일 전용: 상단 탭으로 좌측 사이드바(컨트롤 영역) 토글
  let mobileBarVisible = false
  let mobileHideTimer: ReturnType<typeof setTimeout> | null = null

  const showMobileBar = () => {
    if (!leftSidebar) return
    mobileBarVisible = true
    leftSidebar.classList.add("reader-mobile-visible")
    // 3초 후 자동 숨김
    if (mobileHideTimer) clearTimeout(mobileHideTimer)
    mobileHideTimer = setTimeout(() => {
      leftSidebar.classList.remove("reader-mobile-visible")
      mobileBarVisible = false
    }, 3000)
  }

  const handleMobileTap = (e: TouchEvent) => {
    if (!isReaderMode || !isMobile()) return
    // 사이드바 내부 탭(버튼 클릭 등)은 토글 로직 건너뜀
    if (leftSidebar && leftSidebar.contains(e.target as Node)) return
    const y = e.touches[0].clientY
    // 화면 상단 80px 탭 시 컨트롤 바 토글
    if (y < 80) {
      if (mobileBarVisible) {
        if (leftSidebar) leftSidebar.classList.remove("reader-mobile-visible")
        mobileBarVisible = false
        if (mobileHideTimer) clearTimeout(mobileHideTimer)
      } else {
        showMobileBar()
      }
    }
  }

  document.addEventListener("touchstart", handleMobileTap)
  window.addCleanup(() => document.removeEventListener("touchstart", handleMobileTap))

  const switchReaderMode = () => {
    isReaderMode = !isReaderMode
    const newMode = isReaderMode ? "on" : "off"
    document.documentElement.setAttribute("reader-mode", newMode)
    emitReaderModeChangeEvent(newMode)

    if (isReaderMode) {
      // mode ON: 커서 위치 무관하게 사이드바 즉시 숨김 (600ms hover 차단)
      document.querySelectorAll<HTMLElement>(".sidebar").forEach((el) => {
        el.classList.add("reader-no-hover")
        setTimeout(() => el.classList.remove("reader-no-hover"), 600)
      })
      // 모바일: 전환 직후 컨트롤 바 잠깐 보여줘 존재 알림
      if (isMobile()) {
        setTimeout(() => showMobileBar(), 650)
      }
    } else {
      // mode OFF: 모바일 상태 초기화
      if (leftSidebar) leftSidebar.classList.remove("reader-mobile-visible")
      mobileBarVisible = false
      if (mobileHideTimer) clearTimeout(mobileHideTimer)
    }
  }

  for (const readerModeButton of document.getElementsByClassName("readermode")) {
    readerModeButton.addEventListener("click", switchReaderMode)
    window.addCleanup(() => readerModeButton.removeEventListener("click", switchReaderMode))
  }

  // Set initial state
  document.documentElement.setAttribute("reader-mode", isReaderMode ? "on" : "off")
})
