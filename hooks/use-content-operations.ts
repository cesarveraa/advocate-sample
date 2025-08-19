import type { ContentData } from "@/types"

export function useContentOperations(contentData: ContentData, setContentData: (data: ContentData) => void) {
  const updateNestedValue = (path: string[], value: any) => {
    setContentData((prev) => {
      const next = JSON.parse(JSON.stringify(prev))
      let cur: any = next
      for (let i = 0; i < path.length - 1; i++) {
        if (!cur[path[i]]) cur[path[i]] = {}
        cur = cur[path[i]]
      }
      cur[path[path.length - 1]] = value
      return next
    })
  }

  const addArrayItem = (path: string[], template: any) => {
    const newData = JSON.parse(JSON.stringify(contentData))
    let current = newData

    for (const key of path) {
      current = current[key]
    }

    if (Array.isArray(current)) {
      current.push(JSON.parse(JSON.stringify(template)))
    }

    setContentData(newData)
  }

  const removeArrayItem = (path: string[], index: number) => {
    const newData = JSON.parse(JSON.stringify(contentData))
    let current = newData

    for (const key of path) {
      current = current[key]
    }

    if (Array.isArray(current)) {
      current.splice(index, 1)
    }

    setContentData(newData)
  }

  return {
    updateNestedValue,
    addArrayItem,
    removeArrayItem,
  }
}
