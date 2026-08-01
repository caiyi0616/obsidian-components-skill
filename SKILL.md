---
name: obsidian-components
description: Create, edit, validate, and install Obsidian Components plugin pages and dashboards. Use when the user asks to build a Components homepage, dashboard, task hub, project overview, data view, chart, component library item, or `.components` file in an Obsidian vault.
---

# Obsidian Components

Build Components pages from verified local plugin behavior and official templates. Components is UI-driven: `.components` files are persisted JSON, not a public Markdown DSL. Do not invent JSON fields or component types.

## Inspect First

1. Confirm that `.obsidian/plugins/components/manifest.json` exists.
2. Read the plugin version and only the non-sensitive settings needed for the task:

```bash
jq '{folder, scriptFolder, formFolder, homepage}' .obsidian/plugins/components/data.json
```

3. Never print, copy, commit, or modify provider credentials in `data.json`.
4. Treat component JSON as version-sensitive. Do not copy a component from a template whose Components major version differs from the target plugin without rebuilding or verifying its fields.
5. Inspect the target notes, folders, frontmatter properties, and existing `.components` files before designing data-backed widgets.
6. Inventory an existing Components template before adapting it:

```bash
node scripts/inspect_components_vault.mjs "/path/to/template-vault"
```

7. Read [references/components-reference.md](references/components-reference.md) before creating or editing component JSON.

## Build A Page

1. Translate the request into a small dashboard plan: user actions, source folders, existing properties, and required widgets.
2. Use only source data that already exists. Ask before introducing a property convention that would require changing many notes.
3. Generate a new root component file with:

```bash
node scripts/new_components_file.mjs "components/view/Home.components" --layout grid
```

4. Start with a root `multi` component. Use verified component types and fields from local files, the installed plugin, or official templates. Reuse existing `.components` structures when possible.
5. Prefer a practical homepage composition:
   - quick actions or navigation cards;
   - today's tasks or daily check;
   - active-project or recent-note data view;
   - one useful metric or chart only when its source properties are stable.
6. Create or update a Markdown wrapper only when needed:

```markdown
![[components/view/Home.components]]
```

7. Preserve existing notes. Do not overwrite an existing home page or `.components` file without an explicit request or a dated backup.

## Data And Layout Rules

- Use `multi` for nesting and layout. Verified templates demonstrate `column`, `grid`, `list`, and `tab`; confirm any other layout in the installed plugin before writing it.
- Treat `card`, `button`, `count`, `countdown`, `dateProgress`, `dynamicDataView`, `dailyCheck`, `taskList`, `chart`, `quote`, `markdown`, `time`, and `timeLine` as configuration-driven widgets. Copy a verified local or official shape before modifying it.
- Use Obsidian frontmatter properties as the data model. Build filters against real property names and values, not assumptions.
- Use `![[file.components]]` to render a component file inside a note.
- Keep complex filters and data-view settings inside the component file. Do not replace them with Dataview unless the user asks for Dataview.
- Treat `gallary` as an exact persisted value when verified by the target plugin. Do not normalize it to `gallery`.

## Full-Width Pages

When the user requests a dashboard-style page, add `editor-full` to that note's `cssclasses` and create or update a CSS snippet only if it does not already exist:

```css
.editor-full {
  --file-line-width: 95vw;
  --line-width: 95vw;
  --container-img-width: 100%;
  --table-wrapper-width: 100%;
}
```

Enable the snippet in Obsidian. Do not globally reduce the readable line width for unrelated notes.

## Validation

Run both checks after every `.components` change:

```bash
jq empty "path/to/page.components"
node scripts/validate_components_file.mjs "path/to/page.components"
```

Then re-read the changed JSON and verify:

- every component ID is unique;
- `rootComponentId` points to a root `multi` component;
- every `multi.components[].componentId` exists;
- referenced notes, folders, properties, commands, and assets exist;
- the wrapper uses an Obsidian embed, not a Markdown link.

Open the page in Obsidian for final rendering verification when the user asks for a finished dashboard. The official PARA sample demonstrates that `homepage.path` can point directly to `Home.components`. Configure it through Components settings when possible. If editing `data.json` is necessary, create a recoverable backup first and change only the `homepage` object.

## Actions, Code, And Templates

- Treat card `clickAction` and button `clickActions`, `checkActions`, and `uncheckActions` as side-effecting behavior. Add `CreateFile`, `CallCommand`, `CallTemplater`, or `RunScript` only when the user explicitly asks for that action.
- Before adding `CreateFile`, verify its target folder and template exist.
- Before adding `OpenFile`, verify the referenced file exists.
- Before adding `CallCommand`, confirm the command is available in the target vault.
- Before adding `CallTemplater`, inspect the template or script it will execute.
- Before adding `OpenUrl`, verify the destination with the user when it is not already provided.
- Before adding `RunScript`, inspect the script first and do not introduce external network calls or credential access.
- Treat `dataview` components as executable queries. Confirm the Dataview plugin is installed and enabled before creating one.
- Treat `custom` components as executable view, settings, and CSS code. Do not copy them from a template without reviewing `viewCode`, `settingsCode`, and `cssCode`; do not run untrusted code.
- Treat `attachments` as a file-management component. Confirm its source path and extension filters before creating it.
- For a PARA-style vault, keep reusable templates, scripts, shared views, and area dashboards in separate folders. See the reference for the verified structure.

## Resources

- [references/components-reference.md](references/components-reference.md): official behavior, observed file structure, supported starting points, and source links.
- `scripts/new_components_file.mjs`: create a minimal, valid root `.components` file without overwriting anything.
- `scripts/validate_components_file.mjs`: validate JSON structure and component references before opening the page.
- `scripts/inspect_components_vault.mjs`: summarize reusable component capabilities from an existing template vault without reading plugin credentials.
