# Employee Management Component Library

A reusable component library for Employee Management applications, built with Lit and supporting multiple frameworks (React, Svelte, vanilla JavaScript).

## Features

- **Multi-framework Support**: Works with React, Svelte, and vanilla JavaScript
- **Employee Search Input**: Real-time search across Name, Email, and ID fields
- **Employee Table**: Display employee data with resizable columns, fixed header, and context menu
- **Keyboard Shortcuts**: Ctrl/Cmd+K to focus search, arrow keys for navigation
- **Minimal UI**: Lightweight with no external UI framework dependencies
- **TypeScript Support**: Full type definitions included

## Quick Start

### Installation

```bash
npm install employee-components
```

### Usage

```html
<employee-search-input></employee-search-input>
<employee-table></employee-table>

<script type="module">
  import 'employee-components';
  const searchInput = document.querySelector('employee-search-input');
  const table = document.querySelector('employee-table');
  
  searchInput.addEventListener('searchResults', (e) => {
    table.data = e.detail.results;
    table.query = e.detail.query;
    table.total = e.detail.total;
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
# Vanilla JS example
pnpm serve:vanilla  # http://localhost:8080

# React example
pnpm serve:react    # http://localhost:3000

# Svelte example
pnpm serve:svelte   # http://localhost:5173
```

### Project Structure

```
/
├── lib/ui/           # Library source code
├── app/vanilla/      # Vanilla JS example
├── app/react/        # React example
└── app/svelte/       # Svelte example
```

## Components

### EmployeeSearchInput

Search input with debounced functionality. Fires `searchResults` event with filtered data.

### EmployeeTable

Displays employee data with resizable columns, fixed header, and context menu. Accepts `data`, `query`, and `total` properties.

## License

MIT