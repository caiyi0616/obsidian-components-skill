#!/usr/bin/env node

import { access, mkdir, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { randomUUID } from "node:crypto";

const usage = `Usage: node new_components_file.mjs <output.components> [--layout column|grid|list|tab]`;
const args = process.argv.slice(2);

if (!(args.length === 1 || (args.length === 3 && args[1] === "--layout"))) {
  console.error(usage);
  process.exit(1);
}

const output = resolve(args[0]);
const layout = args.length === 3 ? args[2] : "column";
const validLayouts = new Set(["column", "grid", "list", "tab"]);

if (extname(output) !== ".components") {
  console.error("Output file must use the .components extension.");
  process.exit(1);
}

if (!validLayouts.has(layout)) {
  console.error(`Unsupported starter layout: ${layout}`);
  console.error(usage);
  process.exit(1);
}

try {
  await access(output, constants.F_OK);
  console.error(`Refusing to overwrite existing file: ${output}`);
  process.exit(1);
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }

  // The target must not exist. Missing parent folders are created below.
}

const timestamp = new Date().toISOString();
const rootComponentId = randomUUID();
const document = {
  components: [
    {
      id: rootComponentId,
      type: "multi",
      titleAlign: "center",
      tabTitle: "",
      maxWidthRatio: -1,
      showBorder: true,
      showShadow: false,
      createAt: timestamp,
      updateAt: timestamp,
      components: [],
      layoutType: layout,
    },
  ],
  rootComponentId,
};

await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(document, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
console.log(`Created ${output}`);
