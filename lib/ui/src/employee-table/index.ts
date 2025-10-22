import { LitElement, PropertyValues, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Employee, fetchEmployees, Response, Data } from "@lib/data";
import { menuButtonStyles, tableStyles } from "./styles";
import { map } from "lit/directives/map.js";
import "./context-menu";
import "./project-modal";
import { Task } from "@lit/task";
import { TaskStatus } from "@lit/task";
import { StyleInfo, styleMap } from "lit/directives/style-map.js";

@customElement("employee-table")
export class EmployeeTable extends LitElement {
  static styles = [tableStyles, menuButtonStyles];

  @property({ type: Array })
  data: Response = [];

  @property({ type: String })
  keywords = "";

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

  private currentColumn: string | null = null;

  private startX: number = 0;

  private startWidth: number = 0;

  @state()
  private selectedEmployee: Employee | null = null;

  @state()
  private selectedMenuButton: HTMLElement | null = null;

  @state()
  private modalEmployee: Employee | null = null;

  @state()
  private currentFocusRow = -1;

  @state()
  private currentCursorMode: "ROW" | "MENU" = "ROW";

  private _fetchEmployeesTask = new Task(this, {
    task: async ([data]) => {
      this.currentFocusRow = -1;
      this.currentCursorMode = "ROW";
      if (!data?.length) {
        const employees = await fetchEmployees();
        this.total = employees.length;
        return employees;
      }
      return data;
    },
    args: () => [this.data],
  });

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("mousemove", this._handleResize);
    document.addEventListener("mouseup", this._stopResize);
    document.addEventListener("click", this._handleCloseMenu);
    document.addEventListener("keydown", this._handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("mousemove", this._handleResize);
    document.removeEventListener("mouseup", this._stopResize);
    document.removeEventListener("click", this._handleCloseMenu);
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  willUpdate(props: PropertyValues) {
    if (props.has("data")) {
      if (this.data?.length) {
        this.total = this.data?.length;
      }
    }
  }

  render() {
    const columns = ["FULL NAME", "EMAIL ADDRESS", "ID", "START DATE", "MENU"];
    return html`
      <div class="header">
        ${this._fetchEmployeesTask.status === TaskStatus.COMPLETE
          ? html`Employee (found
              <span class="count">${this.total}</span> items)`
          : html`Employee`}
      </div>
      <div class="scroll-container" @scroll=${this._handleCloseMenu}>
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
            ${this._fetchEmployeesTask.render({
              pending: () => html`<tr>
                <td colspan="5">Loading employees...</td>
              </tr>`,
              complete: (employees) => {
                return html`${map(employees, (item, index) =>
                  this._renderRow({ item, index, keywords: this.keywords })
                )}`;
              },
            })}
          </tbody>
        </table>
        <context-menu
          .visible=${this.selectedEmployee !== null &&
          this.modalEmployee == null}
          .anchorElement=${this.selectedMenuButton}
          .employee=${this.selectedEmployee}
          @onContextMenuClose=${this._handleCloseMenu}
          @viewProjects=${this._handleViewProjects}
        ></context-menu>
        <project-modal
          .visible=${this.modalEmployee !== null}
          .employee=${this.modalEmployee}
          @close=${this._handleCloseModal}
        ></project-modal>
      </div>
    `;
  }

  private _highlightMatch(text: string, keywords: string) {
    if (!keywords) return text;
    const lowerText = text.toLowerCase();
    const lowerKeywords = keywords.toLowerCase();
    const index = lowerText.indexOf(lowerKeywords);
    if (index === -1) return text;

    const start = text.slice(0, index);
    const match = text.slice(index, index + keywords.length);
    const end = text.slice(index + keywords.length);

    return html`${start}<mark>${match}</mark>${end}`;
  }

  private _onMenuClick(event: Event, employee: Employee, index: number) {
    event.stopPropagation();

    this.selectedEmployee = employee;
    this.selectedMenuButton = event.target as HTMLElement;
    this.currentCursorMode = "MENU";
    this.currentFocusRow = index;
  }

  private _handleCloseMenu = () => {
    this.selectedEmployee = null;
    this.selectedMenuButton = null;
    this.currentCursorMode = "ROW";
  };

  private _handleViewProjects = (e: CustomEvent) => {
    this.modalEmployee = e.detail.employee;
  };

  private _handleCloseModal = () => {
    this.modalEmployee = null;
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

  private _renderRow({
    item,
    index,
    keywords,
  }: {
    item: Data;
    index: number;
    keywords: string;
  }) {
    const emp = item.employee;
    const email = emp.department.manager.contact.email;
    const startDate = emp.projects[0]?.startDate || "N/A";
    const columns = ["FULL NAME", "EMAIL ADDRESS", "ID", "START DATE", "MENU"];

    const isFocusing = index === this.currentFocusRow;
    let focusStyle: StyleInfo = {};
    if (isFocusing) {
      focusStyle = {
        "background-color": "#bdc4ed",
      };
    }

    return html`<tr style=${styleMap(focusStyle)}>
      <td style="width: ${this.columnWidths[columns[0]]}">
        ${this._highlightMatch(emp.name, keywords)}
      </td>
      <td style="width: ${this.columnWidths[columns[1]]}">
        ${this._highlightMatch(email, keywords)}
      </td>
      <td style="width: ${this.columnWidths[columns[2]]}">
        ${this._highlightMatch(emp.id, keywords)}
      </td>
      <td style="width: ${this.columnWidths[columns[3]]}">${startDate}</td>
      <td style="width: ${this.columnWidths[columns[4]]}">
        <button
          class="menu-btn"
          @click=${(e: Event) => this._onMenuClick(e, emp, index)}
        >
          <iconify-icon
            icon="ph:dots-three-outline-vertical-fill"
            width="16"
            height="16"
          ></iconify-icon>
        </button>
      </td>
    </tr>`;
  }

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (this.currentCursorMode === "ROW") {
        this.currentFocusRow = Math.min(
          this.currentFocusRow + 1,
          this.total - 1
        );
        this._scrollToCurrentRow();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (this.currentCursorMode === "ROW") {
        this.currentFocusRow = Math.max(0, this.currentFocusRow - 1);
        this._scrollToCurrentRow();
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      this._openContextMenuForFocusedRow();
      this.currentCursorMode = "MENU";
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (this.currentCursorMode === "MENU") {
        this._handleCloseMenu();
      }
    }
  };

  private _openContextMenuForFocusedRow() {
    if (this.currentFocusRow < 0) return;

    const employees = this._fetchEmployeesTask.value;
    if (!employees) return;

    const employeeData = employees[this.currentFocusRow] as Data;
    if (!employeeData) return;

    const tbody = this.shadowRoot?.querySelector(
      "tbody"
    ) as HTMLTableSectionElement;
    if (!tbody) return;

    const rows = tbody.querySelectorAll("tr");
    const currentRow = rows[this.currentFocusRow] as HTMLTableRowElement;
    if (!currentRow) return;

    const menuButton = currentRow.querySelector(".menu-btn") as HTMLElement;
    if (!menuButton) return;

    this.selectedEmployee = employeeData.employee;
    this.selectedMenuButton = menuButton;
  }

  private _scrollToCurrentRow() {
    if (this.currentFocusRow < 0) return;

    const scrollContainer = this.shadowRoot?.querySelector(
      ".scroll-container"
    ) as HTMLElement;
    if (!scrollContainer) return;

    const thead = this.shadowRoot?.querySelector(
      "thead"
    ) as HTMLTableSectionElement;
    if (!thead) return;

    const tbody = this.shadowRoot?.querySelector(
      "tbody"
    ) as HTMLTableSectionElement;
    if (!tbody) return;

    const rows = tbody.querySelectorAll("tr");
    const currentRow = rows[this.currentFocusRow] as HTMLTableRowElement;
    if (!currentRow) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const rowRect = currentRow.getBoundingClientRect();
    const headerHeight = thead.offsetHeight;

    // Calculate the effective visible top accounting for sticky header
    const visibleTop = containerRect.top + headerHeight;

    if (rowRect.top < visibleTop) {
      // Row is above the visible area (hidden by sticky header)
      // Scroll to align row's top with the visible area top
      const scrollOffset = rowRect.top - visibleTop;
      scrollContainer.scrollTop += scrollOffset;
    } else if (rowRect.bottom > containerRect.bottom) {
      // Row is below the visible area
      // Scroll to bring the row fully into view from bottom
      const scrollOffset = rowRect.bottom - containerRect.bottom;
      scrollContainer.scrollTop += scrollOffset;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "employee-table": EmployeeTable;
  }
}
