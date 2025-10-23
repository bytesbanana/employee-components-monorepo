# Employee Management Component Library

A reusable component library for Employee Management applications, built with Lit and supporting multiple frameworks (React, Svelte, vanilla JavaScript).

## Features

- **Multi-framework Support**: Works with React, Svelte, and vanilla JavaScript
- **Employee Search Input**: Real-time search across Name, Email, and ID fields
- **Employee Table**: Display employee data with resizable columns, fixed header, context menu, and virtual scrolling for performance
- **Keyboard Navigation**: Arrow keys for row selection with automatic scrolling (Ctrl/Cmd+K focus shortcut planned)
- **Minimal UI**: Lightweight with no external UI framework dependencies
- **TypeScript Support**: Full type definitions included

## Quick Start

### Installation

```bash
npm install @lib/ui
# or
pnpm add @lib/ui
```

### Usage

```html
<employee-search-input></employee-search-input>
<employee-table></employee-table>

<script type="module">
  import '@lib/ui';
  const searchInput = document.querySelector('employee-search-input');
  const table = document.querySelector('employee-table');
  
  searchInput.addEventListener('searchResults', (e) => {
    table.data = e.detail.results;
    table.keywords = e.detail.keywords;
  });
</script>
```

## Development Environment

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Setup

```bash
# Clone repository
git clone <repository-url>
cd employee-components-monorepo

# Install dependencies
pnpm install

# Build library
pnpm build
```

### Running Examples

```bash
# Development mode
pnpm dev            # Start all packages in development mode
pnpm dev:ui         # Start UI library only
pnpm dev:data       # Start data service only

# Examples/Demos
pnpm demo:vanilla   # Vanilla JS example
pnpm demo:react     # React example
```

### Project Structure

```
/
├── lib/ui/           # Library source code (Web Components)
├── lib/data/         # Data service and types
├── app/vanilla/      # Vanilla JS example
├── app/react/        # React example
└── pnpm-workspace.yaml
```

## Components

### EmployeeSearchInput

Search input with debounced functionality (300ms). Fires `searchResults` event with filtered data, keywords, and metadata.

### EmployeeTable

Displays employee data with resizable columns, fixed header, context menu, and virtual scrolling. Accepts `data` and `keywords` properties for rendering and highlighting. Features keyboard navigation with arrow keys for row selection and automatic scrolling to keep focused rows visible.

## License

MIT