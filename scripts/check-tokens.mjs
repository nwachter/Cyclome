import { readFileSync } from "node:fs";

const css = readFileSync("src/app/globals.css", "utf8");
const tokens = JSON.parse(readFileSync("design/cyclome.tokens.json", "utf8"));

// flattener les tokens JSON : color.flame.500 -> "#f46036"
const flat = new Map();
const walk = (node, path) => {
  if (node && typeof node === "object") {
    if ("value" in node && "type" in node) {
      flat.set(path.join("."), String(node.value).toLowerCase());
      return;
    }
    for (const [key, value] of Object.entries(node)) walk(value, [...path, key]);
  }
};
for (const [set, content] of Object.entries(tokens)) {
  if (!set.startsWith("$")) walk(content, []);
}

// Récupérer les couleurs color déclarées dans @theme
const theme = css.slice(css.indexOf("@theme"), css.indexOf("@layer base"));
const declared = [...theme.matchAll(/--color-([a-z]+)-(\d{2,3}):\s*(#[0-9a-f]{6})/gi)];

const problems = [];
for (const [, family, step, hex] of declared) {
  const key = `color.${family}.${step}`;
  const expected = flat.get(key);
  if (!expected) {
    problems.push(`${key} déclaré dans le CSS mais absent du fichier tokenss`);
  } else if (expected !== hex.toLowerCase()) {
    problems.push(`${key} : CSS ${hex.toLowerCase()} / tokens ${expected}`);
  }
}

if (problems.length) {
  console.error("Divergence entre le thème et les tokens :\n  " + problems.join("\n  "));
  process.exit(1);
}
console.log(`Tokens cohérents : ${declared.length} couleurs vérifiées.`);
