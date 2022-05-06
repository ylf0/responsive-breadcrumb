import React, { useRef, useEffect, useState } from 'react'

import { Item, calcBreadcrumb } from '../../utils/index'
import './index.css'

interface IBreadcrumbItem {
  key: string,
  name: string
}

interface ICalcedBreadcrumbItem extends IBreadcrumbItem {
  omitList?: IBreadcrumbItem[]
}

export interface IProps {
  className?: string
  items: IBreadcrumbItem[],
  separator?: string
  onClick: (item: any) => void
}

export default function Breadcrumb(props: IProps) {
  const { className, items, separator = '>', onClick } = props
  const clsName = className ? `responsive_breadcrumb ${className}` : 'responsive_breadcrumb'

  const breadcrumbRef = useRef(null)
  const cloneListRef = useRef(null)
  const calcedItemList = useRef([])
  const [breadcrumbList, setBreadcrumbList] = useState([])

  const lastIndex = breadcrumbList.length - 1

  useEffect(() => {
    // 恢复克隆列表展示
    cloneListRef.current.style.display = 'flex'
    calcedItemList.current = []
    calcBreadcrumbList(items)
  }, [items])

  function calcBreadcrumbList(items: IBreadcrumbItem[]) {
    if (!cloneListRef.current) return

    const parent = breadcrumbRef.current.parentElement
    const children = cloneListRef.current.children

    const itemDatas = []
    // 返回新数组，防止操作数据导致 items 被同步更改
    const localItems: ICalcedBreadcrumbItem[] = items.concat()

    for (let i = 0; i < children.length; i ++) {
      itemDatas.push({ index: i, width: children[i].clientWidth })
    }

    calcedItemList.current = calcBreadcrumb(itemDatas, parent.clientWidth).sort((a, b) => a.index - b.index)

    if (calcedItemList.current.some((item: Item) => item.omit)) {
      const omitList = calcedItemList.current.filter((item: Item) => item.omit)
      const startIndex = omitList[0].index
      const lastIndex = omitList[omitList.length - 1].index
      // 将需要隐藏的面包屑合并到 省略号... 选项中
      localItems.splice(startIndex, lastIndex - startIndex + 1, {
        name: '...',
        key: 'omit-list',
        omitList: localItems.slice(startIndex, lastIndex + 1)
      })
      // 同步更新数据
      calcedItemList.current.splice(startIndex, lastIndex - startIndex + 1, {})
    }

    setBreadcrumbList(localItems)
    // 隐藏克隆列表展示
    cloneListRef.current.style.display = 'none'
  }

  return (
    <div className={clsName} ref={breadcrumbRef}>
      <div className={`${clsName} clone_list`} ref={cloneListRef}>
        {items.map((item, index) => {
          const { key, name } = item
          const itemKey = key || name || index
          const isLastItem = index === lastIndex

          return (
            <div className={isLastItem ? 'rb_item rb_last_item' : 'rb_item'} key={itemKey}>
              <span className="rb_name">{name}</span>
              {isLastItem ? null : <div className="rb_separator">{separator}</div>}
            </div>
          )
        })}
      </div>

      {breadcrumbList.map((item, index) => {
        const { key, name, omitList } = item
        const itemKey = key || name || index
        const isLastItem = index === lastIndex
        const idealWidth = calcedItemList.current[index]?.idealWidth

        if (Array.isArray(omitList)) {
          return (
            <div className="rb_item" key={itemKey}>
              <div className="rb_omit_wrapper">
                <span className="rb_name">{name}</span>
                <div className="rb_omit_list">
                  {omitList.map(omitItem => (
                    <div
                      className="rb_omit_item"
                      key={omitItem.key || omitItem.name}
                      title={omitItem.name}
                      onClick={() => onClick(omitItem)}
                    >
                      {omitItem.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rb_separator">{separator}</div>
            </div>
          )
        }

        return (
          <div
            className={isLastItem ? 'rb_item rb_last_item' : 'rb_item'}
            key={itemKey}
            title={name}
            style={idealWidth ? { width: idealWidth } : undefined}
            onClick={isLastItem ? undefined : () => onClick(item)}
          >
            <span className="rb_name">{name}</span>
            {isLastItem ? null : <div className="rb_separator">{separator}</div>}
          </div>
        )
      })}
    </div>
  )
}
