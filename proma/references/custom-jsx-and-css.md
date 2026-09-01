# 自定义 JSX 与 CSS

本页依据 `组件使用教程/自定义组件（3.0）.md`、`高阶教程/组件脚本使用教程/`、图表文档和样式 FAQ 整理。它只把文档明确出现的运行时契约写成规则；示例中的 TypeScript 类型声明、缺失的 JSX 标签和未定义宿主 API 不得直接复制。

## 三段源码

Components 3.0 自定义组件由三个职责部分组成：

1. 视图源码：显示、交互和样式引用。
2. 设置项源码：配置面板。
3. CSS：视图和设置项共同使用的样式。

`【文档已确认】`视图源码和设置项源码使用 JSX；运行时语法是 JavaScript，不用 TypeScript；两段都包含名为 `App` 的函数；不能使用 `import`。文档没有要求 `export default App`，不要自行添加未经验证的导出形式。

最小结构只能表达为以下 `【示意】`，具体 props 由当前 Components 编辑器确认：

```jsx
function App() {
  return <div className="my-component">内容</div>;
}
```

不要把 `interface`、`type`、泛型、`export declare` 或带类型注解的 API 片段放进运行时源码。原文中部分 JSX 标签未导出，`return (...)` 片段可能已损坏；应从语义重写并用最小组件验证，不能盲拷。

## Hooks 和上下文

文档列出可用 React Hooks：`useState`、`useEffect`、`useCallback`、`useMemo`、`useRef`、`forwardRef`；也可直接调用不带 `React.` 前缀的常用 Hooks。Components Hooks 包括：

- `useObsidianApp()`：返回 Obsidian `App`。
- `useThisFile()`：返回当前组件上下文的 `TFile`；嵌入笔记时是宿主笔记文件；无上下文可能为 `null`。
- `useActiveFile()`：返回工作区当前激活文件，监听 `active-leaf-change`；可能为 `null`。
- `useInterval(callback, milliseconds)`：周期执行。

定时器、事件监听和订阅必须在 effect 清理时解除；检查依赖，避免重复绑定、无限更新和大数据量下的 OOM。任何文件操作先检查 `TFile` 是否为空。

## 组件级存储

文档建议设置数据优先使用 `useDataStorage`，用户数据优先使用 `Files` 或 `Markdowns`，并推荐写入 Markdown 笔记而不是只存组件内部。组件存储按组件独立，不能跨组件读写，数据变更会触发更新。

存在明确命名矛盾：文字称返回 `getData`/`setData`，示例使用 `getData`/`saveData`。因此只能写为：

```text
【待核验】确认当前版本 useDataStorage 的保存函数是 setData 还是 saveData。
```

不要在未验证时给出可直接运行的确定调用，更不要用固定全局键让多个实例互相覆盖。存储数据要有默认值、版本号、类型校验和迁移策略；配置（标题、颜色、目标）与业务记录（次数、日期）分开。

## 可用模块和 API

Components 文档出现的主要模块：

- `Obsidian`：Obsidian 插件 API。
- `Obsidian.requestUrl(...)`：无 CORS 限制的 HTTP/HTTPS 请求；响应可读 `status`、`headers`、`arrayBuffer`、`json`、`text`。
- `Files`、`Markdowns`、`Tasks`、`DailyNotes`：文件、Markdown、任务和日记操作，细节见 [`scripts-and-apis.md`](scripts-and-apis.md)。
- `EchartsView`：传入 `option`，可选 `onReady(api)`；默认注册一组常见组件和图表，具体注册清单见脚本参考。

网络请求会绕过浏览器 CORS，但不代表无风险。请求笔记内容前说明数据去向；API Key 不要硬编码到公开组件、日志或 Markdown。

## 设置面板组件

文档列出以下设置 UI 组件，可按需选择：

- `Settings`、`SettingItem`、`SettingTitle`、`SettingDescription`、`SettingDivider`
- `SettingInput`：text、checkbox、number、password 等
- `SettingSwitch`
- `SettingSelect`、大量候选值用 `SettingAutocomplete`
- `FileSettingAutocomplete`、`FolderSettingAutocomplete`、`PropertySettingAutocomplete`
- `ColorPicker`
- `LucideIcon`、`LucideIconSuggestPanel`

属性选择和过滤器的确切 props 在原文中有残缺/类型不一致；把带 `Property` 类型注解的片段视为类型参考，生成的运行时代码去掉 TypeScript，并先用最小设置面板验证。

## ECharts

`EchartsView` 的形状：

```jsx
<EchartsView option={option} onReady={(api) => {
  // 仅在需要拿到 ECharts 实例时使用
}} />
```

默认注册清单包含 `TitleComponent`、`TooltipComponent`、`GridComponent`、`DatasetComponent`、`LegendComponent`、`CalendarComponent`、`VisualMapComponent`、`HeatmapChart`、`BarChart`、`LineChart`、`PieChart`、`FunnelChart`、`RadarChart`、`TreeChart`、`CanvasRenderer`、`MarkLineComponent`。配置仍需在当前插件版本确认；文档中的 Props 类型是 TypeScript 参考，不是运行时代码。

## CSS 约定

- 视图和设置项样式放独立 CSS 模块。
- 优先使用 Obsidian 变量，例如 `--background-primary`、`--background-modifier-border`、`--radius-m`，以适配浅色/深色主题。
- class 和 animation 使用组件前缀，例如 `timeline--Title`，避免污染全局。
- Obsidian 对 `button`、`select` 等有默认样式；必要时提高选择器优先级，例如 `button.timeline-ConfirmButton`。
- 外部 CSS 放库内 `.obsidian/snippets/`，然后在“设置 → 外观”刷新并启用 CSS 片段。
- 归档的 `Components-Unofficial-StyleSetting` 是第三方旧版参考，需要 Style Settings 插件，不是默认依赖。

例：

```css
.my-component {
  color: var(--text-normal);
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
}

.my-component__button {
  color: var(--text-on-accent);
}
```

对颜色、标题、进度宽度、按钮焦点、窄屏换行和高对比度主题做约束。用户自定义颜色必须校验格式，不能直接拼接任意 CSS。

## 自定义组件验证清单

- 能否在组件编辑器中加载视图和设置源码？
- `App` 是否存在，源码是否无 `import`/TypeScript？
- 设置保存后视图是否刷新，多个实例是否隔离？
- `useThisFile()`/`useActiveFile()` 为 `null` 时是否可用？
- 卸载后定时器/监听是否清理？
- 空数据、文件写入失败、网络错误和重复点击是否有状态？
- 浅色/深色主题、窄屏、键盘焦点和长文本是否不溢出？
