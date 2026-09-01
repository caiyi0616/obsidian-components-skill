---
name: obsidian-components
description: Use when a user asks about the Obsidian Components plugin or components files, including component panels, homepages, dashboards, data views, table/gallery/kanban/list/calendar/Gantt views, filters, JsQuery, statistics, charts, custom JSX components, component scripts, or Components CSS; also use for daily dashboards, book libraries, habit panels, and knowledge-management pages that must be implemented with Components. Do not use for generic Dataview-only tasks without Components.
version: "1.0.0"
---

# Obsidian Components

把本 Skill 当作 Components 的实施手册，而不是通用 Dataview 或 React 教程。依据本工作区的 `components-docs` 整理配置和代码；遇到文档未导出的表格、缺失步骤或版本差异时，明确停在“待核验”，不要补造插件字段。

## 事实等级

在回答、生成步骤或代码时使用以下标记：

- `【文档已确认】`：源文档明确写出的 UI、行为、字段或 API。
- `【示意】`：用于表达数据模型或逻辑，不能冒充可粘贴的 Components 配置。
- `【待核验】`：受版本、缺失表格、损坏示例或运行环境影响，必须在当前 Obsidian 中确认。

源资料和图片只读。不要修改 `components-docs`，也不要把截图中的未知字段猜写回配置。

## 何时先问

能从用户上下文推断的内容不要反复询问；但在会改变方案或造成写入风险时，先确认：

- Obsidian 桌面或移动端、Components 版本（至少区分 1.x、2.x、3.x；AI 功能还要确认 3.1.0+）。
- 目标组件文件/笔记/目录，以及日记、书库或项目文件的实际路径。
- 已有属性名、属性类型、日期格式、状态候选值和任务保存位置。
- 只需要配置说明，还是要生成 JSX、脚本、CSS 或修改真实库文件。
- 是否允许移动、删除、修改属性、运行脚本或向外部 AI 发送笔记内容。

缺少目标路径时可以给出可替换占位符，但要标注 `【示意】`，不能声称已创建或已验证。

## 标准工作流

1. **分类请求**：安装/激活、创建/布局、嵌入/主页、数据视图、统计/图表、基础组件、自定义 JSX、脚本/API 或故障排查。
2. **建立数据契约**：先确认文件目录、Markdown 范围、frontmatter 属性、字段类型、日期/状态格式，再选择视图。属性清单和 Components 内置属性的完整表格在原文中未导出，不能自行扩展为官方清单。
3. **先做最小组件**：创建组件文件，添加一个能显示数据的子组件，确认渲染后再叠加筛选、布局、样式、按钮和脚本。
4. **选择布局**：仪表盘优先网格；分类切换使用标签页/垂直标签页；横向并列使用分栏；简单纵向排列使用列表。避免网格嵌套网格。调整完成后锁定网格。
5. **配置数据视图**：按“目录/文件范围 → 筛选 → 排序 → 分组 → 视图属性 → 视图类型”的顺序配置；每步检查结果是否符合预期。
6. **添加交互前审查副作用**：按钮可能移动或删除文件、改写属性、应用模板或执行脚本；删除按钮没有二次确认。脚本和 AI 可能写文件或上传内容，必须先得到用户明确意图并校验目标。
7. **验证桌面与移动端**：检查空数据、缺失属性、非法日期、长文件名、移动端布局和主题；不要把只在截图中出现的行为当成已验证的响应式规则。
8. **交付可复现结果**：说明实际 UI 操作、已确认字段、替换占位符、版本前提和剩余缺口。没有运行 Components 的条件时，交付“待核验清单”，不要伪造成功。

## 最小可复现骨架

【文档已确认】创建组件文件可以：在笔记/文件夹上右键选择“创建组件”；或打开命令面板（Mac `command+p`，Windows `ctrl+p`），搜索 `components`，执行“创建组件”。输入名称并点击“创建文件”。组件文件本质上是一个组合组件/画布，空白时点击“+点击此处添加组件”。默认目录和新建文件路径在插件“通用/基本设置”的“新建文件默认存放路径”中配置，填写相对库目录的路径。

创建后先只添加一个基础组件验证。常用组件、布局、主页组装和嵌入步骤见 [`references/layouts-and-components.md`](references/layouts-and-components.md)。

## 常见方案入口

- **每日主页/仪表盘**：外层网格放时间、日期进度、任务清单、最近日记、统计数字和摘录；数据区用数据视图和筛选，不要直接套用 Dataview 查询。习惯热力图若无现成 Components 组件或已验证脚本，标为 `【待核验】`。
- **书库**：按书库目录筛选 Markdown，先用表格维护属性，再复制配置切换画廊和看板；用统计数字和图表汇总评分/分类；阅读按钮的目标字段必须真实存在，不能凭路径推导外部网页 URL。详见 [`references/data-views.md`](references/data-views.md)。
- **自定义组件**：先确认 Components 3.0 自定义组件的三段源码约定，再分别设计视图、设置项和 CSS。运行时是 JavaScript/JSX，不写 TypeScript 或 `import`。详见 [`references/custom-jsx-and-css.md`](references/custom-jsx-and-css.md)。
- **文件/任务自动化**：优先使用数据视图按钮、任务清单属性和已记录的内置对象；涉及持久化、删除或网络请求时读取 [`references/scripts-and-apis.md`](references/scripts-and-apis.md)。

## 按需读取

| 请求 | 读取 |
|---|---|
| 创建、组合、网格、标签页、主页、嵌入、时钟/卡片/摘录 | `references/layouts-and-components.md` |
| 筛选、排序、分组、表格/画廊/看板/列表/日历/Gantt、统计、公式、JsQuery | `references/data-views.md` |
| 自定义 JSX、设置面板、Hooks、ECharts、CSS | `references/custom-jsx-and-css.md` |
| 脚本、Tasks/Markdown/Files API、AI、安装、版本和文档缺口 | `references/scripts-and-apis.md`、`references/diagnostics-and-provenance.md` |

不要为了普通配置一次性加载全部参考文件；只读与当前请求相关的部分。

## 交付前检查

- 是否说明了组件文件、目标目录和插件版本，而不是把抽象 YAML 当成真实配置？
- 数据视图是否先限定文件范围，且日期属性使用可识别的日期格式？
- 是否区分笔记属性、文件属性、视图属性和按钮属性？
- 公式是否考虑空值、类型转换和除零；`fixed()` 返回文本时是否需要 `parseFloat()`？
- 是否说明看板/日历/Gantt 的拖拽会写回属性或文件？
- 是否为删除文件、执行脚本、修改 Markdown 和发送 AI 内容标注副作用？
- 是否检查移动端、无数据、缺失封面/属性和版本差异？
- 是否把未导出的多维表格、损坏的 JSX、`useDataStorage` 命名冲突和主页操作缺口列为待核验？

## 来源范围

本 Skill 的事实来自 `/Users/caiyi/.proma/agent-workspaces/default/workspace-files/components-docs`，覆盖入门教程、组件使用教程、数据视图、JsQuery、脚本、自定义组件、图表、快速实践、安装激活、常见问题、样式和更新记录。详细来源和限制见 [`references/diagnostics-and-provenance.md`](references/diagnostics-and-provenance.md)。
