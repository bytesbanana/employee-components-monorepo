import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Data, fetchEmployees, filterEmployees } from "@lib/data";
import { debounce, DebouncedFunc } from "lodash-es";
import { createSearchResultEvent } from "./events";
import { inputStyles } from "./styles";
import { createRef, ref } from "lit/directives/ref.js";

export interface SearchResultsDetail {
  results: Data[];
  keywords: string;
}

@customElement("employee-search-input")
export class EmployeeSearchInput extends LitElement {
  static styles = inputStyles;

  @property({ type: String })
  private keywords = "";

  @property({ type: Boolean, reflect: true })
  private loading = false;

  inputRef = createRef<HTMLInputElement>();

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this._handleFocusInput);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._handleFocusInput);
  }

  private _renderSpinner() {
    if (this.loading) {
      return html`<div class="spinner"></div>`;
    }
    return "";
  }

  render() {
    return html`
      <div class="search-container">
        <input ${ref(this.inputRef)} id="name="employee-search-input"
        name="employee-search-input" type="text" placeholder="Name, Email, ID"
        @input=${(e: Event) => {
          this._debouncedHandleInput((e.target as HTMLInputElement).value);
        }}
        .value=${this.keywords} /> ${this._renderSpinner()}
      </div>
    `;
  }

  private _debouncedHandleInput: DebouncedFunc<(text: string) => void>;

  constructor() {
    super();
    this._debouncedHandleInput = debounce(this._onInputChange, 300);
  }

  private async _onInputChange(query = "") {
    this.keywords = query || "";
    if (this.keywords.length < 2) {
      this.dispatchEvent(
        createSearchResultEvent({ keywords: this.keywords, results: [] })
      );
      return;
    }
    this.loading = true;

    try {
      const employees = await fetchEmployees();
      const filtered = filterEmployees(employees, this.keywords);

      this.dispatchEvent(
        createSearchResultEvent({ results: filtered, keywords: this.keywords })
      );
    } catch (error) {
      console.error("Error fetching employee data:", error);
      this.dispatchEvent(
        createSearchResultEvent({ results: [], keywords: this.keywords })
      );
    } finally {
      this.loading = false;
    }
  }

  private _handleFocusInput = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      this.inputRef.value?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      this.inputRef.value?.blur();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "employee-search-input": EmployeeSearchInput;
  }
}
