# Obsidian Components Skill

基于 `components-docs`（Obsidian Components 插件官方教程知识库）整理的 Agent Skill，用于制作 Obsidian Components 组件面板、主页/仪表盘、数据视图和自定义组件。

## 目录结构

```
.
├── SKILL.md                  # 主入口：触发条件、事实等级、标准工作流、参考路由
├── references/
│   ├── layouts-and-components.md     # 创建、布局、嵌入、主页、基础组件
│   ├── data-views.md                 # 筛选/排序/分组、表格/画廊/看板/列表/日历/甘特、公式、JsQuery、统计、图表
│   ├── custom-jsx-and-css.md         # 自定义 JSX 三段源码、Hooks、设置面板组件、ECharts、CSS
│   ├── scripts-and-apis.md           # 脚本入口、内置对象、Files/Markdowns/Tasks/DailyNotes API、AI、安装
│   └── diagnostics-and-provenance.md # 版本线索、文档缺口、证据规则
└── evals/evals.json          # 3 个回归评估用例（主页仪表盘/书库数据视图/自定义习惯组件）
```

## 核心设计

- **事实等级**：所有结论标注为 `【文档已确认】`（源文档明确支持）、`【示意】`（逻辑示例，不可冒充配置）、`【待核验】`（版本差异/缺失表格/未说明行为，须在当前插件中确认）。
- **渐进式披露**：主 `SKILL.md` 只承载触发和工作流，复杂 API、配置字段、脚本按需读取对应 `references/`。
- **防幻觉**：明确禁止把 Dataview 查询、抽象 YAML、未验证的宿主 API（如 `host.storage`）当成 Components 真配置。
- **来源边界**：事实来自 `components-docs` 教程资料；图片仅作界面证据；内嵌多维表格未导出的字段不做臆造。

## 触发方式

用户提到 Components 插件、`.components` 文件、组件面板、主页/仪表盘、数据视图（表格/画廊/看板/列表/日历/甘特）、筛选、JsQuery、统计数字、图表、自定义 JSX、组件脚本、Components CSS 等关键词时使用。
