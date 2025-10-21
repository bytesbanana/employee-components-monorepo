import { LitElement, PropertyValues, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Employee, fetchEmployees, Response } from "@lib/data";
import { menuButtonStyles, tableStyles } from "./styles";
import { map } from "lit/directives/map.js";
import "./context-menu";
import { createRef, ref } from "lit/directives/ref.js";
import { ContextMenu } from "./context-menu";

@customElement("employee-table")
export class EmployeeTable extends LitElement {
  static styles = [tableStyles, menuButtonStyles];

  @property({ type: Array })
  data: Response = [];

  @property({ type: String })
  query = "";

  @property({ type: Number })
  total = 0;

  @property({
    type: Object,
    hasChanged(value, oldValue) {
      return JSON.stringify(value) !== JSON.stringify(oldValue);
    },
  })
  columnWidths: Record<string, any> = {};

  private isResizing: boolean = false;

  currentColumn: string | null = null;

  startX: number = 0;

  startWidth: number = 0;

  @state()
  private selectedEmployee: Employee | null = null;

  private selectedMenuButton: HTMLElement | null = null;

  constructor() {
    super();
    this._initializaData();
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("mousemove", this._handleResize);
    document.addEventListener("mouseup", this._stopResize);
    document.addEventListener("click", this._handleCloseMenu);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("mousemove", this._handleResize);
    document.removeEventListener("mouseup", this._stopResize);
    document.removeEventListener("click", this._handleCloseMenu);
  }

  willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has("data")) {
      this.total = this.data?.length || 0;
    }
  }

  render() {
    const columns = ["FULL NAME", "EMAIL ADDRESS", "ID", "START DATE", "MENU"];
    return html`
      <div class="header">
        Employees (found <span class="count">${this.total}</span> items)
      </div>
      <div class="scroll-container">
        <table>
          <thead>
            <tr>
              ${map(
                columns,
                (col) => html` <th style="width: ${this.columnWidths[col]}">
                  ${col}
                  <div
                    class="resize-handle"
                    @mousedown=${(e: MouseEvent) => {
                      this._startResize(e, col);
                    }}
                  ></div>
                </th>`
              )}
            </tr>
          </thead>
          <tbody>
            ${map(this.data, (item) => {
              const emp = item.employee;
              const email = emp.department.manager.contact.email;
              const startDate = emp.projects[0]?.startDate || "N/A";

              return html`
                <tr>
                  <td style="width: ${this.columnWidths[columns[0]]}">
                    ${this._highlightMatch(emp.name, this.query)}
                  </td>
                  <td style="width: ${this.columnWidths[columns[1]]}">
                    ${this._highlightMatch(email, this.query)}
                  </td>
                  <td style="width: ${this.columnWidths[columns[2]]}">
                    ${this._highlightMatch(emp.id, this.query)}
                  </td>
                  <td style="width: ${this.columnWidths[columns[3]]}">
                    ${startDate}
                  </td>
                  <td>
                    <button
                      class="menu-btn"
                      @click=${(e: Event) => this._onMenuClick(e, emp)}
                    >
                      <iconify-icon
                        icon="ph:dots-three-outline-vertical-fill"
                        width="16"
                        height="16"
                      ></iconify-icon>
                    </button>
                  </td>
                </tr>
              `;
            })}
          </tbody>
        </table>
      </div>

      <context-menu
        .visible=${this.selectedEmployee !== null}
        .anchorElement=${this.selectedMenuButton}
        .employee=${this.selectedEmployee}
        @onContextMenuClose=${this._handleCloseMenu}
      ></context-menu>
    `;
  }

  private async _initializaData() {
    this.data = await fetchEmployees();
    this.total = this.data.length;
  }

  private _highlightMatch(text: string, query: string) {
    if (!query) return text;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);
    if (index === -1) return text;

    const start = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const end = text.slice(index + query.length);

    return html`${start}<mark>${match}</mark>${end}`;
  }

  private _onMenuClick(event: Event, employee: Employee) {
    event.stopPropagation();

    this.selectedEmployee = employee;
    this.selectedMenuButton = event.target as HTMLElement;
  }

  private _handleCloseMenu = (event: MouseEvent) => {
    this.selectedEmployee = null;
    this.selectedMenuButton = null;
  };

  private _startResize(e: MouseEvent, column: string) {
    e.preventDefault();

    const th = (e.target as HTMLTableCellElement).parentElement;

    this.isResizing = true;
    this.currentColumn = column;
    this.startX = e.pageX;
    this.startWidth = th?.offsetWidth || 0;
  }

  private _handleResize = (e: MouseEvent) => {
    e.preventDefault();
    if (!this.isResizing) return;

    const diff = e.pageX - this.startX;
    const newWidth = Math.max(100, this.startWidth + diff);

    if (this.currentColumn) {
      this.columnWidths = {
        ...this.columnWidths,
        [this.currentColumn]: newWidth + "px",
      };
    }
    super.requestUpdate();
  };

  private _stopResize = () => {
    this.isResizing = false;
    this.currentColumn = null;
    this.startX = 0;
    this.startWidth = 0;
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "employee-table": EmployeeTable;
  }
}
