#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import { resolve, join, relative } from "node:path";

const [input] = process.argv.slice(2);

if (!input || process.argv.length !== 3) {
  console.error("Usage: node inspect_components_vault.mjs <vault-or-folder>");
  process.exit(1);
}

const root = resolve(input);
const ignoredDirectories = new Set([".git", ".obsidian", ".trash", "node_modules"]);
const componentFiles = [];
const parseErrors = [];

async function readJsonIfExists(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

async function collectComponents(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        await collectComponents(join(directory, entry.name));
      }
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".components")) {
      componentFiles.push(join(directory, entry.name));
    }
  }
}

function addValue(map, value) {
  if (typeof value === "string" && value.length > 0) {
    map.add(value);
  }
}

function inspectFilter(filter, summary) {
  if (!filter || typeof filter !== "object") {
    return;
  }

  addValue(summary.filterOperators, filter.operator);

  if (typeof filter.property === "string" && filter.property.startsWith("${")) {
    summary.fileMetadataProperties.add(filter.property);
  }

  if (
    filter.value &&
    typeof filter.value === "object" &&
    typeof filter.value.type === "string" &&
    filter.value.type.startsWith("$")
  ) {
    summary.relativeTimeValues.add(filter.value.type);
  }

  for (const condition of filter.conditions ?? []) {
    inspectFilter(condition, summary);
  }
}

function inspectAction(action, summary) {
  if (action && typeof action === "object") {
    addValue(summary.actionTypes, action.type);
  }
}

function inspectComponentActions(component, summary) {
  inspectAction(component.clickAction, summary);

  for (const action of component.clickActions ?? []) {
    inspectAction(action, summary);
  }

  for (const action of component.checkActions ?? []) {
    inspectAction(action, summary);
  }

  for (const action of component.uncheckActions ?? []) {
    inspectAction(action, summary);
  }
}

await collectComponents(root);

const manifest = await readJsonIfExists(join(root, ".obsidian/plugins/components/manifest.json"));
const settings = await readJsonIfExists(join(root, ".obsidian/plugins/components/data.json"));
const summary = {
  componentFiles: componentFiles.length,
  componentTypes: new Set(),
  layouts: new Set(),
  dataViewTypes: new Set(),
  chartTypes: new Set(),
  countTypes: new Set(),
  actionTypes: new Set(),
  filterOperators: new Set(),
  fileMetadataProperties: new Set(),
  relativeTimeValues: new Set(),
};

for (const file of componentFiles) {
  let document;

  try {
    document = JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    parseErrors.push({ file: relative(root, file), error: error.message });
    continue;
  }

  for (const component of document.components ?? []) {
    addValue(summary.componentTypes, component.type);
    addValue(summary.layouts, component.layoutType);
    addValue(summary.dataViewTypes, component.viewType);
    addValue(summary.chartTypes, component.chartType);
    addValue(summary.countTypes, component.countType);
    inspectComponentActions(component, summary);
    inspectFilter(component.filter, summary);
  }
}

const output = {
  plugin: manifest
    ? {
        version: manifest.version ?? null,
        author: manifest.author ?? null,
        settings: settings
          ? {
              folder: settings.folder ?? null,
              scriptFolder: settings.scriptFolder ?? null,
              formFolder: settings.formFolder ?? null,
              homepage: settings.homepage ?? null,
            }
          : null,
      }
    : null,
  componentFiles: summary.componentFiles,
  componentTypes: [...summary.componentTypes].sort(),
  layouts: [...summary.layouts].sort(),
  dataViewTypes: [...summary.dataViewTypes].sort(),
  chartTypes: [...summary.chartTypes].sort(),
  countTypes: [...summary.countTypes].sort(),
  actionTypes: [...summary.actionTypes].sort(),
  filterOperators: [...summary.filterOperators].sort(),
  fileMetadataProperties: [...summary.fileMetadataProperties].sort(),
  relativeTimeValues: [...summary.relativeTimeValues].sort(),
  parseErrors,
};

console.log(JSON.stringify(output, null, 2));
