#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const [input] = process.argv.slice(2);

if (!input || process.argv.length !== 3) {
  console.error("Usage: node validate_components_file.mjs <page.components>");
  process.exit(1);
}

const path = resolve(input);
let document;

try {
  document = JSON.parse(await readFile(path, "utf8"));
} catch (error) {
  console.error(`Invalid JSON in ${path}: ${error.message}`);
  process.exit(1);
}

const errors = [];

if (!Array.isArray(document.components) || document.components.length === 0) {
  errors.push("components must be a non-empty array.");
}

if (typeof document.rootComponentId !== "string" || document.rootComponentId.length === 0) {
  errors.push("rootComponentId must be a non-empty string.");
}

const componentsById = new Map();

for (const component of document.components ?? []) {
  if (!component || typeof component !== "object") {
    errors.push("components entries must be objects.");
    continue;
  }

  if (typeof component.id !== "string" || component.id.length === 0) {
    errors.push("every component must have a non-empty id.");
    continue;
  }

  if (componentsById.has(component.id)) {
    errors.push(`duplicate component id: ${component.id}`);
    continue;
  }

  componentsById.set(component.id, component);
}

const root = componentsById.get(document.rootComponentId);

if (!root) {
  errors.push("rootComponentId does not reference a component.");
} else if (root.type !== "multi") {
  errors.push("the root component must use type multi.");
}

for (const component of componentsById.values()) {
  if (component.type !== "multi") {
    continue;
  }

  if (!Array.isArray(component.components)) {
    errors.push(`multi component ${component.id} must have a components array.`);
    continue;
  }

  for (const reference of component.components) {
    if (!reference || typeof reference.componentId !== "string") {
      errors.push(`multi component ${component.id} has an invalid child reference.`);
      continue;
    }

    if (!componentsById.has(reference.componentId)) {
      errors.push(
        `multi component ${component.id} references missing component ${reference.componentId}.`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error(`Invalid Components file: ${path}`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Valid Components file: ${path} (${componentsById.size} components)`);
