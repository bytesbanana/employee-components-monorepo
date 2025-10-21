import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Data, fetchEmployees, filterEmployees } from "@lib/data";
import { debounce, DebouncedFunc } from "lodash-es";
import { createSearchResultEvent } from "./events";
import { inputStyles } from "./styles";

export interface SearchResultsDetail {
  results: Data[];
  query: string;
}

@customElement("employee-search-input")
export class EmployeeSearchInput extends LitElement {
  static styles = inputStyles;

  @property({ type: String })
  private query = "";

  @property({ type: Boolean, reflect: true })
  private loading = false;

  render() {
    return html`
      <div class="search-container">
        <input id="name="employee-search-input" name="employee-search-input"
        type="text" placeholder="Name, Email, ID"
        @input=${(e: Event) => {
          this._debouncedHandleInput((e.target as HTMLInputElement).value);
        }}
        .value=${this.query} /> ${this._renderSpinner()}
      </div>
    `;
  }

  private _debouncedHandleInput: DebouncedFunc<(text: string) => void>;

  constructor() {
    super();
    this._debouncedHandleInput = debounce(this._onInputChange, 300);
  }

  private async _onInputChange(query = "") {
    this.query = query || "";
    if (this.query.length < 2) {
      this.dispatchEvent(
        createSearchResultEvent({ query: this.query, results: [] })
      );
      return;
    }
    this.loading = true;

    try {
      const employees = await fetchEmployees();
      const filtered = filterEmployees(employees, this.query);

      this.dispatchEvent(
        createSearchResultEvent({ results: filtered, query: this.query })
      );
    } catch (error) {
      console.error("Error fetching employee data:", error);
      this.dispatchEvent(
        createSearchResultEvent({ results: [], query: this.query })
      );
    } finally {
      this.loading = false;
    }
  }

  private _renderSpinner() {
    if (this.loading) {
      return html`<div class="spinner"></div>`;
    }
    return "";
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "employee-search-input": EmployeeSearchInput;
  }
}
