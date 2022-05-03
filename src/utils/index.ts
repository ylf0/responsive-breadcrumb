// 省略号按钮宽度
const ELLIPSIS_BUTTON_WIDTH = 40
// 面包屑最小展示宽度
const MIN_DISPLAY_WIDTH = 80

export interface Item {
  index: number
  width: number
  idealWidth?: number
  omit?: boolean
}

/**
 * 计算面包屑的展示宽度
 * @param {*} items 面包屑数据列表 { width: number }[]
 * @param {*} parentEleWidth 父元素宽度
 * @returns 
 */
function calcFixedItemWidth(items: Item[], parentEleWidth: number) {
  let totalWidth = items.reduce((acc, curr) => acc + curr.width, 0)

  for (const item of items) {
    if (item.width <= MIN_DISPLAY_WIDTH) continue

    const gap = totalWidth - parentEleWidth
    const reduce = item.width - MIN_DISPLAY_WIDTH

    if (gap > reduce) {
      item.idealWidth = MIN_DISPLAY_WIDTH
      totalWidth -= reduce
      if (totalWidth <= parentEleWidth) break
    } else {
      item.idealWidth = item.width - gap
      break
    }
  }

  return items
}

/**
 * 计算面包屑展示状态，如果一行展示不下，只展示第一个和最后两个面包屑
 * @param items 面包屑数据列表 { width: number }[]
 * @param parentEleWidth 父元素宽度
 * @returns 计算后的状态列表
 */
 export function calcBreadcrumb(items: Item[], parentEleWidth: number): Item[] {
  const totalWidth = items.reduce((acc, curr) => acc + curr.width, 0)

  if (totalWidth <= parentEleWidth) {
    return items
  }

  if (items.length <= 3) {
    return calcFixedItemWidth(items, parentEleWidth)
  }

  const first = items.shift()
  const lastOne = items.pop()
  const lastTwo = items.pop()
  let displayItems = [first, lastTwo, lastOne]
  const existWidth = displayItems.reduce((acc, curr) => acc + curr.width, 0)
  const remaindWidth = parentEleWidth - existWidth - ELLIPSIS_BUTTON_WIDTH

  if (remaindWidth <= 0) {
    displayItems = calcFixedItemWidth(displayItems, parentEleWidth - ELLIPSIS_BUTTON_WIDTH)
    items.forEach((item) => (item.omit = true))
    return displayItems.concat(items)
  }

  let totalRestWidth = items.reduce((acc, curr) => acc + curr.width, 0)
  for (const item of items) {
    totalRestWidth -= item.width
    item.omit = true
    if (totalRestWidth <= remaindWidth) break
  }

  return displayItems.concat(items)
}
