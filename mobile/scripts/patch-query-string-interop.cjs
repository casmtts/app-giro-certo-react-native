const fs = require("node:fs");
const path = require("node:path");

// Expo Router 57 expects query-string 7's named CommonJS exports. Version 9.5.1
// ships a default ESM export and includes the patched decode-uri-component 0.5.0.
const routerRoot = path.dirname(require.resolve("expo-router/package.json"));
const files = [
  "build/fork/getPathFromState.js",
  "build/fork/getPathFromState-forks.js",
  "build/react-navigation/core/getPathFromState.js",
  "build/react-navigation/core/getStateFromPath.js"
];
const original = 'const queryString = __importStar(require("query-string"));';
const replacement = [
  'const queryStringNamespace = __importStar(require("query-string"));',
  'const queryString = queryStringNamespace.default ?? queryStringNamespace;'
].join("\n");

for (const relativePath of files) {
  const filename = path.join(routerRoot, relativePath);
  const source = fs.readFileSync(filename, "utf8");
  if (source.includes(replacement)) continue;
  if (!source.includes(original)) {
    throw new Error(`Expo Router mudou a importação de query-string: ${relativePath}`);
  }
  fs.writeFileSync(filename, source.replace(original, replacement));
}

console.log("Compatibilidade do Expo Router com query-string 9.5.1 aplicada.");
