# 脚本、API 与安全边界

本页依据 `高阶教程/组件脚本使用教程/`、`自定义组件（3.0）.md`、`AI 集成/`、`快速实践/免费集成 AI 到数据视图中，实现内容总结.md`、安装/下载/常见问题文档整理。

## 脚本入口

脚本必须是 `.js`，放在 Components 设置指定的“组件脚本加载目录”。先定义函数，再用 `exports.default` 暴露名称、说明和入口：

```javascript
function helloComponents(args) {
  console.log("hello components! " + args);
}

exports.default = {
  name: "helloComponents",
  description: "## Components 脚本演示",
  entry: helloComponents
};
```

`name` 用于界面显示，`description` 支持 Markdown，`entry` 是执行函数。脚本可接收参数；按钮配置会选择脚本并生成调用文本。脚本可集成的组件类型数量在原文嵌入表格中未导出，只把数据视图按钮场景当作已确认。

## 脚本上下文

- `this.currentFile`：当前关联的 `TFile`；数据视图通常是当前行文件，按钮通常是按钮所在文件；可能为空。
- `app`：Obsidian `App`，可访问 `vault`、`workspace`、插件、命令和 `metadataCache`。示例使用 `app.metadataCache.getFileCache` 与 `app.fileManager.processFrontMatter`。
- `obsidian`：Obsidian API 对象，出现过 `requestUrl`、`moment`、`stringifyYaml`、`parseYaml`、`Platform`、`Notice`。
- `new Notice("...")`：显示提示。
- `Platform`：判断桌面/移动、iOS/Android、手机/平板、平台和 Safari 等。

上下文对象都依赖执行位置。文件操作前必须检查 `this.currentFile`，并校验路径和目标；不能默认当前文件一定是用户想修改的文件。

## 文件、Markdown、任务和日记 API

文档列出这些可复用接口；准确异步/同步行为和版本仍应以当前插件声明为准：

```text
Files.createFileFromTemplate(app, filePath, templateFilePath?)
Files.createFile(app, filePath, content?)
Files.moveFile(app, sourceFilePath, targetFolderPath, autoResolveNameConflict?)
Markdowns.readFileContent
Markdowns.readContentUnderHeading
Markdowns.appendContentUnderHeading
Markdowns.prependContentUnderHeading
Markdowns.replaceContentUnderHeading
Markdowns.appendContent
Markdowns.prependContent
Tasks.getTasks()
Tasks.modifyTask(app, filePath, taskPos, markdownTask)
Tasks.setTaskStatus(app, filePath, taskPos, status)
Tasks.deleteTask(...)
Tasks.revealTaskInFile(...)
DailyNotes.getDailyNoteOptions()
DailyNotes.getAllDailyNotes()
DailyNotes.getDailyNote(isoDate)
DailyNotes.createDailyNote(isoDate)
```

`createFileFromTemplate` 会创建目录/文件；文件已存在时返回已有文件且不改动；支持 `{{date}}`、`{{time}}`、`{{title}}` 和 Moment 格式，模板不存在会抛错。`moveFile` 可自动处理名称冲突，移动会影响双链。Markdown 标题读写要明确 `includeSubHeadings` 和换行行为。任务 `status` 通过字符表达，`Tasks.getTasks` 的文档对 Promise/同步数组存在不一致，按当前运行时验证。

## 副作用审查

以下操作会持久化或破坏数据，生成/执行前需确认目标：

- `moveFile`、删除文件、`processFrontMatter`。
- `replaceContentUnderHeading`、任务删除/状态修改。
- 数据视图按钮的“移动文件”“删除文件”“修改属性”“应用模板”“运行脚本”。
- 看板跨组拖拽、日历/Gantt 拖拽时间，因为会更新属性或文件。
- `requestUrl`/AI：可能向外部服务上传笔记内容。

数据视图删除按钮没有二次确认。脚本需要处理写入失败、目标文件变化、重复点击、并发覆盖和空上下文；必要时先预览将要写入的路径/属性。

## AI

内置 `Components AI` 在文档中标为 3.1.0+，定位是辅助管理 Obsidian。3.0 资料还描述了用提示词生成自定义组件代码，但没有完整 UI、提示词格式或 API 契约。旧教程使用智谱清言 API + 脚本按钮，让用户点击后上传当前笔记内容并写回 frontmatter；它没有给出 endpoint、请求体、响应格式和密钥保存方案。

因此：

- 先确认版本和当前是否已有内置 AI。
- 不要把 API Key 硬编码进组件、脚本、日志或 Markdown。
- 明确只有点击按钮才上传的旧方案也不能替代当前隐私说明。
- 仅凭 `AI 集成/index.md` 不能生成可运行 AI 配置。

## 安装、激活和更新

`【文档已确认】`BRAT 安装地址是 `https://github.com/obsidian-components/obsidian-components-release`；手动安装时把 `main.js`、`manifest.json`、`styles.css` 放到库内 `.obsidian/plugins/components/`，刷新插件列表后启用。移动端教程要求导入三个文件并重启 Obsidian。插件激活还需要在 Components 设置中填写购买邮箱和授权码。下载页和历史版本附件没有实际导出链接，不能假定具体版本包可用。

版本线索：组件库索引标记最低版本 `3.0.0`；AI 文档要求 `3.1.0+`；更新记录说明 3.0 引入/改进甘特、引用组件、包裹为组合、移动端标签页下拉、按钮/数据视图等。没有完整当前版本和 API 兼容矩阵，安装后应以实际 UI 为准。

## 脚本安全和故障排查

- `不能 import` 是语法约束，不是安全沙箱；自定义 JSX/脚本可访问文件、任务、工作区和网络，只运行可信源码。
- 组件白屏：先检查 `App`、JSX 标签、是否混入 TypeScript/`import`，再逐步恢复源码；文档示例部分标签已损坏。
- 属性不刷新：确认写的是 Markdown frontmatter/正文，检查目标 `TFile` 和 Components 刷新行为，不用未知的 `requestRender` 等 API。
- 存储报错：核对 `useDataStorage` 的 `setData`/`saveData` 命名，检查默认值和版本迁移。
- 文件找不到：确认组件默认目录为相对库路径；嵌入搜索不到 `.components` 时启用 Obsidian“检测所有类型文件”。
- 移动端异常：实测分栏是否转列表、标签页是否下拉；网格/垂直标签页断点没有文档保证。
