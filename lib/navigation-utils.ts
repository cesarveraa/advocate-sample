import type { MenuItem, EntityType } from "@/types"

export function scrollToSection(anchor: string, setMobileMenuOpen?: (open: boolean) => void): void {
  if (!anchor) return

  if (anchor.startsWith("#")) {
    const el = document.getElementById(anchor.slice(1))
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  } else if (/^https?:\/\//.test(anchor)) {
    window.location.href = anchor
  } else {
    window.location.hash = anchor
  }

  if (setMobileMenuOpen) {
    setMobileMenuOpen(false)
  }
}

export function getFilteredMenuItems(menuItems: MenuItem[], entityType: EntityType): MenuItem[] {
  return menuItems.filter((item) => {
    if (entityType === "firm") {
      return item.anchor !== "#person"
    } else {
      return item.anchor !== "#about" && item.anchor !== "#team"
    }
  })
}
