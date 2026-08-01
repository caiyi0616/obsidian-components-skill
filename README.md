# Obsidian Components Skill

面向 Codex 和其他 agent 的 Obsidian Components 工作流。它用于创建、编辑、校验和维护 `.components` 页面，包括首页、任务中心、项目看板、数据视图和统计图表。

## Capabilities

- 根据当前插件版本和本地组件文件构建页面，避免跨版本直接复制 JSON。
- 分析现有模板库，识别组件类型、布局、筛选器、动作和安全的插件配置。
- 创建不会覆盖已有文件的根 `.components` 脚手架。
- 校验组件 JSON、根组件、重复 ID 和子组件引用。
- 处理 Components 主页、全宽页面、PARA 看板、动态数据视图、统计和图表。

## Use

在 Codex 中直接调用：

```text
使用 $obsidian-components 为当前 Obsidian 库搭建一个首页。
先分析现有属性、目录和 Components 配置，再创建组件。
首页包含今日任务、项目进度、最近笔记和快捷入口。
完成后校验结构，并设为启动首页。
```

也可以直接提出“用 Components 搭建 Obsidian 首页”；skill 会自动匹配。

## Template Analysis

分析一个现有模板库，不读取插件凭据：

```bash
node scripts/inspect_components_vault.mjs "/path/to/template-vault"
```

输出包括插件版本、已使用的组件类型、布局、数据视图、图表、筛选器、文件元数据和动作类型。

## Validation

创建一个最小组件文件：

```bash
node scripts/new_components_file.mjs "components/view/Home.components" --layout grid
```

校验组件结构：

```bash
jq empty "components/view/Home.components"
node scripts/validate_components_file.mjs "components/view/Home.components"
```

## Compatibility

Components 的 `.components` JSON 会随版本变化。优先以目标库中已安装的插件版本和现有组件文件为准。

- 3.x 模板可以作为 3.x 插件的结构参考。
- 1.x 模板适合参考页面布局和功能设计，不应直接复制 JSON。
- `gallary` 是插件样例中实际使用的值，不要改写为 `gallery`。

## Safety

- 不读取、打印或提交 `.obsidian/plugins/components/data.json` 中的凭据。
- 不覆盖已有组件或首页，除非用户明确要求或已有可恢复备份。
- 创建文件、调用命令、运行 Templater 或脚本前，先验证目标和用户意图。
- 自定义组件和 Dataview 查询属于可执行内容，必须先审查。
