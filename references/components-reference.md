# Components Reference

## Scope And Sources

Use this reference with the installed Components plugin, not as a replacement for local verification.

- Official documentation index: [Components](https://my.feishu.cn/wiki/GczJwNXb1iNbookQkbscMXOhnO4)
- Official release repository: [obsidian-components-release](https://github.com/obsidian-components/obsidian-components-release)
- Official sample vaults: [PARA](https://github.com/obsidian-components/para-sample-vault) and [blog](https://github.com/obsidian-components/blog-sample-vault)

The official documentation describes Components as a visual editor. It does not publish a complete stable JSON schema. The local plugin version and existing `.components` files are the source of truth for exact fields.

The following local sample vaults were inspected on August 1, 2026:

- `/Users/caiyi/Documents/para-sample-vault`: Components `3.0.251111`, with `Home.components` as `homepage.path`.
- `/Users/caiyi/Documents/vPara`: Components `3.0.0`.
- `/Users/caiyi/Documents/Rainbow-Components`: Components `1.4.0`.
- `/Users/caiyi/Documents/不一样的 PARA`: component files without a local Components manifest.

Use samples as compatibility references, not version guarantees.

## Version Compatibility

Components persists its UI state as JSON, and the schema changes between releases.

- Treat the 3.x PARA and vPara examples as the primary shape reference for a 3.x target plugin.
- Treat the 1.4 Rainbow examples as visual and workflow references only. Recreate their widgets in the target plugin instead of directly copying JSON.
- Treat unversioned component files as untrusted shape references until their fields render in the target plugin.
- Preserve fields already present in a target component. Do not remove an unfamiliar field merely because it does not occur in another template.

## Official Workflow

1. Create a component file from the command palette or the vault file-tree context menu.
2. Each new component file begins with a combination component.
3. Add child components and choose a layout in the visual editor.
4. Embed a component file in a note with `![[name.components]]`.
5. Use Obsidian properties as the basis for filters, statistics, charts, and data views.

The official documentation states that combination components support five layouts. Official sample files directly verify these values:

- `column`
- `grid`
- `list`
- `tab`

Do not assume the remaining layout values. Confirm them in the installed plugin before writing them.

## File Shape

Every observed `.components` file is JSON with:

```json
{
  "components": [
    {
      "id": "uuid",
      "type": "multi",
      "titleAlign": "center",
      "tabTitle": "",
      "maxWidthRatio": -1,
      "showBorder": true,
      "showShadow": false,
      "createAt": "ISO-8601 timestamp",
      "updateAt": "ISO-8601 timestamp",
      "components": [],
      "layoutType": "column"
    }
  ],
  "rootComponentId": "uuid"
}
```

Nested entries in a `multi` component use a component reference:

```json
{
  "componentId": "child-component-uuid"
}
```

Grid layouts may add a responsive `layout` object to each reference. Preserve the existing mobile and laptop values when editing an established dashboard rather than recalculating all coordinates.

## Verified Widget Starting Points

The official sample vaults and installed plugin expose these widget types:

- `multi`: root or nested composition and layout.
- `card`: navigation, commands, actions, or static shortcuts.
- `dynamicDataView`: table, gallery, kanban, list, and task-oriented note views.
- `dailyCheck`: daily recurring check-in items.
- `taskList`: task collection nested in a data view.
- `chart`: property-backed charts with filters.
- `quote`: filtered content review.
- `markdown`: render Markdown content in a component.
- `timeLine`: chronological display.
- `custom` and `reference`: advanced component composition; use only after confirming the source file or registered custom component.

The plugin has additional widgets. Create them in the UI or copy their configuration from a verified local component file before changing fields.

## Data Rules

- Filters operate on Obsidian properties and file metadata.
- Build on actual property names, values, file paths, and tags discovered in the vault.
- Use a narrowly scoped filter before adding a count, chart, or dynamic view.
- Avoid circular references between component files. The plugin documentation warns that they can cause load failures and delay.
- Keep references to generated assets and commands valid after moving a component file.

## Verified PARA Template Patterns

The inspected PARA sample vault separates:

- `Home.components`: the startup dashboard.
- `area/`: one direct subfolder per area, with project notes below it.
- `area/<name>.md`: the area note; projects refer to it through an `area` wikilink property.
- `resource/components/area/`: a dashboard for each area.
- `resource/components/views/`: reusable view components.
- `resource/components/scripts/`: scripts referenced by component actions.
- `resource/template/`: templates used by component-driven file creation.

Observed templates use these properties:

- `tags`: distinguishes `area`, `project`, and `journal`.
- `area`: a wikilink to the owning area note.
- `status`: workflow state such as `TODO` or `DOING`.
- `createTime` and `doneTime`: lifecycle dates.

Do not impose this model on another vault. Map Components filters to the vault's actual structure first.

## Verified Component Vocabulary

The PARA sample contains these root-level component types:

- `multi`, `card`, `count`, `countdown`, `dailyCheck`, `dynamicDataView`
- `chart`, `markdown`, `quote`, `time`, `timeLine`, `timing`

Observed `dynamicDataView.viewType` values:

- `table`
- `kanban`
- `calendar`
- `list`
- `gallary` (this spelling is used by the plugin sample; do not change it to `gallery`)

Observed `chart.chartType` values: `bar`, `heatmap`, `pie`.

Observed `count.countType` values: `number`, `percent`.

Additional 3.x sample vocabulary:

- `button`: supports `clickActions`, `checkActions`, and `uncheckActions`.
- `dateProgress`: period or date-range progress display.
- `dataview`: an embedded Dataview query with a query type and dynamic parameters.
- `attachments`: attachment/file management display.
- `custom`: a code-backed component using `viewCode`, `settingsCode`, and `cssCode`.

The vPara 3.0 sample also verifies `timeline` as a `dynamicDataView.viewType`, `stackBar` as a chart type, and `ratio` as a count type. Only use these after confirming them in the target plugin.

## Verified Filters

Filters use nested group and condition nodes:

```json
{
  "id": "uuid",
  "type": "group",
  "operator": "and",
  "conditions": [
    {
      "id": "uuid",
      "type": "filter",
      "operator": "equals",
      "property": "status",
      "value": "TODO",
      "conditions": []
    }
  ]
}
```

Observed operators: `and`, `or`, `contains`, `contains_any`, `equals`, `has_value`, `no_value`, `not_contains`, `not_equals`, `checked`, `unchecked`, `time_after_or_equal`, and `time_before`.

Observed file metadata properties: `${file.basename}`, `${file.extension}`, `${file.parent}`, `${file.path}`, and `${file.tags}`.

Time filters can use a relative value object, for example:

```json
{
  "type": "$startOfYear",
  "unit": "day",
  "direction": "before",
  "value": null
}
```

Create a unique ID for every new filter or group. Never duplicate a filter ID by copying a block without regenerating it.

Other verified relative values are `$now` and `$relativeTime`. Confirm their object fields from a same-version component before creating a time filter.

## Verified Actions

The PARA sample uses `None`, `OpenFile`, `CreateFile`, `CallCommand`, and `RunScript`. Other local templates also verify `OpenUrl` and `CallTemplater`.

- `OpenFile.options.filePath` references a vault-relative file.
- `CreateFile.options` can use `templateFilePath`, `fileName`, `targetFolder`, and `openPageIn`.
- `CallCommand.options` uses an Obsidian `commandId`.
- `RunScript.options.expression` invokes a script from the configured script folder.
- `CallTemplater` can execute Templater automation.
- `OpenUrl` opens an external destination.

These actions can create files, invoke plugins, reload Obsidian, or run code. Validate targets and require explicit user intent before adding them.

## Design References

The samples demonstrate three reusable dashboard patterns:

- PARA dashboards: one home page plus area-level dashboards, templates, and property-driven project views.
- Modular dashboards: separate small component files for navigation, calendar, weather, files, statistics, and sidebars.
- Single-page dashboards: a dense `grid` root with responsive mobile and laptop coordinates.

For a new vault, prefer the first pattern for maintainability. Use the modular pattern only when each component will be reused in several notes. Copy responsive grid coordinates only when adapting an existing same-version component; otherwise create the grid in the Components editor and verify it visually.

## Homepage And Styling

- The plugin stores its configuration in `.obsidian/plugins/components/data.json`.
- The `homepage` object controls plugin home-page behavior. The PARA sample uses `"path": "Home.components"`. Back up the configuration before changing it, and retain all unrelated settings.
- The official full-width pattern is an `editor-full` CSS class on the note plus a CSS snippet that expands line width only for that page.
