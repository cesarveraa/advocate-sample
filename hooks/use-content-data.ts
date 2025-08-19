"use client"

import { useState, useCallback } from "react"
import { updateNestedValue, addArrayItem, removeArrayItem } from "@/lib/content-utils"
import type { ContentData } from "@/types"

export function useContentData(initialData: ContentData) {
  const [contentData, setContentData] = useState<ContentData>(initialData)

  const updateValue = useCallback(
    (path: string[], value: any) => {
      updateNestedValue(contentData, setContentData, path, value)
    },
    [contentData],
  )

  const addItem = useCallback(
    (path: string[], template: any) => {
      addArrayItem(contentData, setContentData, path, template)
    },
    [contentData],
  )

  const removeItem = useCallback(
    (path: string[], index: number) => {
      removeArrayItem(contentData, setContentData, path, index)
    },
    [contentData],
  )

  return {
    contentData,
    setContentData,
    updateValue,
    addItem,
    removeItem,
  }
}
