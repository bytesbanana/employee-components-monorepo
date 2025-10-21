import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Data, fetchEmployees, filterEmployees } from "@lib/data";
import { debounce, DebouncedFunc } from "lodash-es";
import { createSearchResultEvent } from "./lib/custom-event";

export interface SearchResultsDetail {
  results: Data[];
  query: string;
}

@customElement("employee-search-input")
export class EmployeeSearchInput extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .search-container {
      position: relative;
    }

    input {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
    }

    .spinner {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      border: 2px solid #f3f3f3;
      border-top: 2px solid #3498db;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: translateY(-50%) rotate(0deg);
      }
      100% {
        transform: translateY(-50%) rotate(360deg);
      }
    }
  `;

  @property({ type: String })
  private query = "";

  @property({ type: Boolean, reflect: true })
  private loading = false;

  private debouncedHandleInput: DebouncedFunc<(text: string) => void>;

  constructor() {
    super();
    this.debouncedHandleInput = debounce(this.onInputChange, 300);
  }

  private async onInputChange(query = "") {
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

  private renderSpinner() {
    if (this.loading) {
      return html`<div class="spinner"></div>`;
    }
    return "";
  }

  render() {
    return html`
      <div class="search-container">
        <input id="name="employee-search-input" name="employee-search-input"
        type="text" placeholder="Name, Email, ID"
        @input=${(e: Event) => {
          this.debouncedHandleInput((e.target as HTMLInputElement).value);
        }}
        .value=${this.query} /> ${this.renderSpinner()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "employee-search-input": EmployeeSearchInput;
  }
}
