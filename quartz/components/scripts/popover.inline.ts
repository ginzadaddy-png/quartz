import { computePosition, flip, inline, shift } from "@floating-ui/dom"
import { normalizeRelativeURLs } from "../../util/path"
import { fetchCanonical } from "./util"

const p = new DOMParser()
let activeAnchor: HTMLAnchorElement | null = null

async function mouseEnterHandler(
  this: HTMLAnchorElement,
  { clientX, clientY }: { clientX: number; clientY: number },
) {
  const link = (activeAnchor = this)
  if (link.dataset.noPopover === "true") {
    return
  }

  async function setPosition(popoverElement: HTMLElement) {
    const { x, y } = await computePosition(link, popoverElement, {
      strategy: "fixed",
      middleware: [inline({ x: clientX, y: clientY }), shift(), flip()],
    })
    Object.assign(popoverElement.style, {
      transform: `translate(${x.toFixed()}px, ${y.toFixed()}px)`,
    })
  }

  function showPopover(popoverElement: HTMLElement) {
    clearActivePopover()
    popoverElement.classList.add("active-popover")
    setPosition(popoverElement as HTMLElement)

    if (hash !== "") {
      const inner = popoverElement.querySelector(".popover-inner") as HTMLElement | null
      if (inner) {
        const targetAnchor = `#popover-internal-${hash.slice(1)}`
        const heading = inner.querySelector(targetAnchor) as HTMLElement | null
        if (heading) {
          // leave ~12px of buffer when scrolling to a heading
          inner.scroll({ top: heading.offsetTop - 12, behavior: "instant" })
        }
      }
    }
  }

  const targetUrl = new URL(link.href)
  const hash = decodeURIComponent(targetUrl.hash)
  targetUrl.hash = ""
  targetUrl.search = ""
  const popoverId = `popover-${link.pathname}${hash ? `-${hash.slice(1)}` : ""}`
  const prevPopoverElement = document.getElementById(popoverId)

  // dont refetch if there's already a popover
  if (!!document.getElementById(popoverId)) {
    showPopover(prevPopoverElement as HTMLElement)
    return
  }

  const response = await fetchCanonical(targetUrl).catch((err) => {
    console.error(err)
  })

  if (!response) return
  const [contentType] = response.headers.get("Content-Type")!.split(";")
  const [contentTypeCategory, typeInfo] = contentType.split("/")

  const popoverElement = document.createElement("div")
  popoverElement.id = popoverId
  popoverElement.classList.add("popover")
  const popoverInner = document.createElement("div")
  popoverInner.classList.add("popover-inner")
  popoverInner.dataset.contentType = contentType ?? undefined
  popoverElement.appendChild(popoverInner)

  switch (contentTypeCategory) {
    case "image":
      const img = document.createElement("img")
      img.src = targetUrl.toString()
      img.alt = targetUrl.pathname

      popoverInner.appendChild(img)
      break
    case "application":
      switch (typeInfo) {
        case "pdf":
          const pdf = document.createElement("iframe")
          pdf.src = targetUrl.toString()
          popoverInner.appendChild(pdf)
          break
        default:
          break
      }
      break
    default:
      const contents = await response.text()
      const html = p.parseFromString(contents, "text/html")
      normalizeRelativeURLs(html, targetUrl)
      // prepend all IDs inside popovers to prevent duplicates
      html.querySelectorAll("[id]").forEach((el) => {
        const targetID = `popover-internal-${el.id}`
        el.id = targetID
      })
      const elts = [...html.getElementsByClassName("popover-hint")]
      if (elts.length === 0) return

      elts.forEach((elt) => popoverInner.appendChild(elt))
  }

  if (!!document.getElementById(popoverId)) {
    return
  }

  document.body.appendChild(popoverElement)
  if (activeAnchor !== this) {
    return
  }

  showPopover(popoverElement)
}

function clearActivePopover() {
  activeAnchor = null
  const allPopoverElements = document.querySelectorAll(".popover")
  allPopoverElements.forEach((popoverElement) => popoverElement.classList.remove("active-popover"))
}

// link mouseleave 후 즉시 닫지 않고 짧게 유지 — 사용자가 popover 본체로
// 마우스 이동해 스크롤·읽기 할 수 있도록. popover-inner 위로 들어오거나
// 다시 link로 돌아오면 timeout 취소.
let popoverCloseTimeout: number | null = null
const POPOVER_CLOSE_DELAY_MS = 400

function cancelPopoverClose() {
  if (popoverCloseTimeout !== null) {
    clearTimeout(popoverCloseTimeout)
    popoverCloseTimeout = null
  }
}

function schedulePopoverClose() {
  cancelPopoverClose()
  popoverCloseTimeout = window.setTimeout(() => {
    clearActivePopover()
    popoverCloseTimeout = null
  }, POPOVER_CLOSE_DELAY_MS)
}

function handleDocMouseOver(e: MouseEvent) {
  const t = e.target as HTMLElement | null
  if (t && t.closest(".popover-inner")) cancelPopoverClose()
}

function handleDocMouseOut(e: MouseEvent) {
  const t = e.target as HTMLElement | null
  if (!t || !t.closest(".popover-inner")) return
  const related = (e as MouseEvent).relatedTarget as HTMLElement | null
  if (related && related.closest(".popover-inner")) return
  schedulePopoverClose()
}

document.addEventListener("nav", () => {
  const links = [...document.querySelectorAll("a.internal")] as HTMLAnchorElement[]
  for (const link of links) {
    link.addEventListener("mouseenter", mouseEnterHandler)
    link.addEventListener("mouseenter", cancelPopoverClose)
    link.addEventListener("mouseleave", schedulePopoverClose)
    window.addCleanup(() => {
      link.removeEventListener("mouseenter", mouseEnterHandler)
      link.removeEventListener("mouseenter", cancelPopoverClose)
      link.removeEventListener("mouseleave", schedulePopoverClose)
    })
  }

  // popover-inner는 첫 hover 시점에 동적 생성되는 경우가 있어
  // document 레벨에서 위임으로 mouseover/mouseout을 잡는다
  document.addEventListener("mouseover", handleDocMouseOver)
  document.addEventListener("mouseout", handleDocMouseOut)
  window.addCleanup(() => {
    document.removeEventListener("mouseover", handleDocMouseOver)
    document.removeEventListener("mouseout", handleDocMouseOut)
  })
})
