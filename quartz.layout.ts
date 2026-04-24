import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta({ showReadingTime: false }),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      mapFn: (node) => {
        const folderNames: Record<string, string> = {
          comparisons: "비교 분석",
          concepts: "개념",
          entities: "개체",
          sources: "소스",
        }
        if (node.isFolder && folderNames[node.displayName.toLowerCase()]) {
          node.displayName = folderNames[node.displayName.toLowerCase()]
        } else if (node.isFolder) {
          node.displayName =
            node.displayName.charAt(0).toUpperCase() + node.displayName.slice(1)
        }
      },
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta({ showReadingTime: false })],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      mapFn: (node) => {
        const folderNames: Record<string, string> = {
          comparisons: "비교 분석",
          concepts: "개념",
          entities: "개체",
          sources: "소스",
        }
        if (node.isFolder && folderNames[node.displayName.toLowerCase()]) {
          node.displayName = folderNames[node.displayName.toLowerCase()]
        } else if (node.isFolder) {
          node.displayName =
            node.displayName.charAt(0).toUpperCase() + node.displayName.slice(1)
        }
      },
    }),
  ],
  right: [],
}
