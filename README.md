# Markdown Web Editor

A web-based markdown editor built with [Bun](https://bun.com) and [CodeMirror](https://codemirror.net/).

## Quick Start

### Installation

```bash
bun install
```

### Running the Server

```bash
bun index.ts
```

Or with hot reloading during development:

```bash
bun --hot index.ts
```

Then open your browser to http://localhost:3000

## Project Structure

```
markdown-web-editor/
├── index.ts                          # Server entry point (Bun.serve)
├── shell/
│   ├── index.html                    # Main HTML entry point
│   └── UI/
│       └── viewer/
│           └── viewerEntryPoint.ts   # CodeMirror editor initialization
├── core/
│   ├── markdown/
│   │   ├── parser.ts                 # Markdown parsing logic
│   │   └── tokenizer.ts              # Markdown tokenization
│   └── models/
│       └── TokenizerType.ts          # Type definitions
└── package.json
```

## How It Works

### Server Configuration (index.ts)

The server uses Bun's native `Bun.serve()` API with HTML imports:

```typescript
import index from "./shell/index.html";

Bun.serve({
  port: 3000,
  routes: {
    "/": index,  // HTML Bundle - automatically transpiles TypeScript
  },
  development: {
    hmr: true,      // Hot Module Reloading
    console: true,  // Show console output from browser
  }
})
```

**Key Features:**
- **HTML Imports**: Bun can import HTML files directly and serve them as bundles
- **Automatic TypeScript Transpilation**: TypeScript files referenced in HTML are automatically transpiled to JavaScript
- **Correct MIME Types**: Bun serves `.ts` files with JavaScript MIME types (not `video/mp2t`)
- **Hot Module Reloading**: Changes to files trigger automatic reloads
- **Asset Bundling**: CSS and JS are automatically bundled and optimized

### CodeMirror Editor (viewerEntryPoint.ts)

The editor is initialized using CodeMirror 6:

```typescript
import { markdown } from "@codemirror/lang-markdown";
import { EditorState, type EditorStateConfig } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";

export const viewer = {
  initEditorView(entryPoint: HTMLDivElement): EditorView {
    return buildViewerInitState(
      "start",
      [
        basicSetup,    // Basic editor features (line numbers, etc.)
        markdown()     // Markdown syntax highlighting
      ],
      entryPoint
    )
  }
}
```

## Dependencies

### Core Dependencies
- **codemirror** (v6.0.2): Main CodeMirror 6 package with basicSetup
- **@codemirror/lang-markdown**: Markdown language support
- **@codemirror/state**: Editor state management
- **@codemirror/view**: Editor view layer
- **@codemirror/commands**: Editor commands
- **@codemirror/language**: Language support infrastructure
- **@codemirror/theme-one-dark**: Dark theme for the editor

### Dev Dependencies
- **@types/bun**: TypeScript definitions for Bun
- **typescript** (^5): TypeScript compiler

## Troubleshooting

### Error: "Expected a JavaScript module but got MIME type video/mp2t"

**Cause:** This error occurs when TypeScript files are served without proper transpilation. The `.ts` extension is also used for MPEG-2 Transport Stream video files, causing the wrong MIME type.

**Solution:** Use `Bun.serve()` with the `routes` option to serve HTML bundles. Bun will automatically transpile TypeScript and serve it with the correct MIME type.

❌ **Incorrect** (using `fetch` handler):
```typescript
Bun.serve({
  fetch(req) {
    return index  // Returns HTMLBundle, not Response
  }
})
```

✅ **Correct** (using `routes`):
```typescript
Bun.serve({
  routes: {
    "/": index  // Properly handles HTMLBundle
  }
})
```

### Error: "Unrecognized extension value in extension set"

**Cause:** This error occurs when multiple versions of `@codemirror/state` are loaded, breaking instanceof checks. This commonly happens when using the deprecated `@codemirror/basic-setup@0.20.0` package with modern CodeMirror v6 packages.

**Solution:** Remove the old `@codemirror/basic-setup` and use the modern `codemirror` package instead.

```bash
# Remove old package
bun remove @codemirror/basic-setup

# Install modern package
bun add codemirror
```

Update imports:
```typescript
// Old (causes conflicts)
import { basicSetup } from "@codemirror/basic-setup";

// New (correct)
import { EditorView, basicSetup } from "codemirror";
```

## Recent Fixes Applied

### 1. Fixed Missing Bun.serve() Configuration
**Problem:** The `index.ts` file only imported the HTML but never started a server.

**Fix:** Added `Bun.serve()` with routes configuration to properly serve the HTML bundle and transpile TypeScript files.

### 2. Fixed CodeMirror Package Conflicts
**Problem:** Using deprecated `@codemirror/basic-setup@0.20.0` caused version conflicts with CodeMirror v6 packages, resulting in multiple instances of `@codemirror/state` being loaded.

**Fix:**
- Removed `@codemirror/basic-setup`
- Added `codemirror` package (v6.0.2)
- Updated import in `viewerEntryPoint.ts` to use the modern package

**Result:** The editor now loads without errors and all CodeMirror extensions work correctly.

## CodeMirror 6 Architecture

### Extension System
CodeMirror 6 uses an extension-based architecture where features are added via extensions:

```typescript
const extensions = [
  basicSetup,           // Basic editor features
  markdown(),           // Language support
  // Add more extensions as needed
];
```

### Common Extensions
- **basicSetup**: Line numbers, syntax highlighting, bracket matching, etc.
- **Language extensions**: `markdown()`, `javascript()`, etc.
- **Themes**: `oneDark`, custom themes
- **Key bindings**: Custom keyboard shortcuts
- **Linters**: Code validation and error highlighting

### State Management
CodeMirror separates state from view:
- **EditorState**: Immutable document state
- **EditorView**: Visual representation and user interaction

## Development Tips

### Hot Reloading
Use `bun --hot index.ts` to enable hot reloading during development. The server will automatically restart when you make changes.

### Browser Console Logging
With `development.console: true` in the server config, browser console messages appear in your terminal.

### Debugging
The Bun dev server shows:
- Bundle times
- Frontend errors with stack traces
- HMR reload notifications

## Resources

- [Bun Documentation](https://bun.sh/docs)
- [Bun.serve() API](https://bun.sh/docs/api/http)
- [CodeMirror 6 Documentation](https://codemirror.net/docs/)
- [CodeMirror 6 Examples](https://codemirror.net/examples/)
- [CodeMirror 6 Migration Guide](https://codemirror.net/docs/migration/)

## License

This project was created using `bun init` in bun v1.2.19.
