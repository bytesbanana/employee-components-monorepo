import { useEffect, useRef } from "react";
import "@lib/ui";

function App() {
  const searchRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const searchEl = searchRef.current;
    const tableEl = tableRef.current;

    if (searchEl && tableEl) {
      const handleSearchResults = (e) => {
        tableEl.data = e.detail.results;
        tableEl.query = e.detail.query;
      };

      searchEl.addEventListener("searchResults", handleSearchResults);

      return () => {
        searchEl.removeEventListener("searchResults", handleSearchResults);
      };
    }
  }, []);

  return (
    <div>
      <h1>Employee Management Demo - React</h1>

      <div className="instructions">
        <h3>Instructions:</h3>
        <ul>
          <li>
            Type at least 2 characters in the search box to search employees
          </li>
          <li>Search works across Name, Email, and ID fields</li>
          <li>
            Click the menu icon (
            <iconify-icon
              icon="ph:dots-three-outline-vertical-fill"
              width="16"
              height="16"
            ></iconify-icon>
            ) in each row to copy name or view projects
          </li>
          <li>
            Use keyboard shortcuts: Ctrl+K (Windows/Linux) or Cmd+K (Mac) to
            focus search
          </li>
          <li>Use arrow keys to navigate table rows, Enter to open menu</li>
          <li>Columns are resizable - drag the column borders</li>
        </ul>
      </div>

      <div>
        <employee-search-input ref={searchRef}></employee-search-input>
      </div>

      <div>
        <employee-table ref={tableRef}></employee-table>
      </div>
    </div>
  );
}

export default App;
