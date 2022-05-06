# responsive-breadcrumb
responsive breadcrumb that in one line

响应式地一行展示面包屑列表。如果列表过长在父容器内展示不下，则动态计算面包屑展示宽度，多余面包屑收至省略列表并鼠标悬浮展示。

### 使用效果
[breadcrumb-demo](https://itg-tezign-files.tezign.com/sop/public/432/423195804/breadcrumb-demo.png)

### 代码示例
``` typescript
import Breadcrumb from 'responsive-breadcrumb'

const breadcrumbItems = [
  { key: 'home', name: 'home' },
  { key: 'path1', name: 'path1' },
  { key: 'path2', name: 'path2' },
  { key: 'path3', name: 'path3' },
]

function handleBreadcrumbItemClick(itme: { key: string, name: string }) {
  // do something with item
}

<Breadcrumb
  className="responsive-breadcrumb"
  items={breadcrumbItems}
  separator="/"
  onClick={handleBreadcrumbItemClick}
/>
```
### 组件参数
| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| className | 自定义 className | string | - |
| items | 面包屑数据列表 | Array<{ key: string, name: string }> | - |
| separator | 面包屑之间的分隔符或图标 | string | ReactNode | '>' |
| onClick | 面包屑点击回调 | (item: { key: string, name: string }) | - |
