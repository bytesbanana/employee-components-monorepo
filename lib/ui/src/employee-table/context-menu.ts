import { LitElement, html, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Employee } from "@lib/data";
import { computePosition, offset } from "@floating-ui/dom";
import { contextMenuStyles } from "./styles";
import { map } from "lit/directives/map.js";
import { classMap } from "lit/directives/class-map.js";

@customElement("context-menu")
export class ContextMenu extends LitElement {
  static styles = [contextMenuStyles];

  @property({ type: Boolean })
  visible = false;

  @property({ type: Object })
  anchorElement: HTMLElement | null = null;

  @property({ type: Object })
  employee: Employee | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("keydown", this._handleKeyDown);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  @state()
  private _currentMenuIndex = -1;

  private menuItems: { label: string; handler: Function }[] = [
    {
      label: "COPY NAME",
      handler: this._handleCopyName,
    },
    {
      label: "VIEW PROJECTS",
      handler: this._handleViewProjects,
    },
  ];

  render() {
    if (!this.visible) return html``;

    return html`
      <ul class="context-menu">
        ${map(this.menuItems, (item, index) => {
          const styles = {
            "menu-item": true,
            active: this._currentMenuIndex === index,
          };
          return html` <li
            class=${classMap(styles)}
            @click=${item.handler}
            @mouseenter=${() => {
              this._currentMenuIndex = index;
            }}
            @mouseexit=${() => {
              this._currentMenuIndex = -1;
            }}
          >
            ${item.label}
          </li>`;
        })}
      </ul>
    `;
  }

  protected async willUpdate(_props: PropertyValues) {
    if (_props.has("visible") || _props.has("anchorElement")) {
      if (this.visible && this.anchorElement) {
        this._updatePosition();
      }
    }
  }

  private _updatePosition = async () => {
    if (!this.visible || !this.anchorElement) return;

    const { x, y } = await computePosition(this.anchorElement, this, {
      placement: "right-start",
      middleware: [offset(10)],
    });

    this.style.left = `${x}px`;
    this.style.top = `${y}px`;
  };

  private async _handleCopyName(e: Event) {
    e?.stopPropagation();
    if (!this.employee?.name) return;
    try {
      await navigator.clipboard.writeText(this.employee.name);
    } catch (error) {
      console.log("Failed to copy", error);
    } finally {
      this._closeContextMenu();
    }
  }

  private _handleViewProjects(e: Event) {
    e?.stopPropagation();
    if (this.employee) {
      this.dispatchEvent(
        new CustomEvent("viewProjects", {
          bubbles: true,
          composed: true,
          detail: { employee: this.employee },
        })
      );
    }
    this._closeContextMenu();
  }

  private _closeContextMenu() {
    this.dispatchEvent(
      new CustomEvent("onContextMenuClose", {
        bubbles: true,
        composed: true,
      })
    );
    this._currentMenuIndex = -1;
  }

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (this.visible) {
      e.preventDefault();
      if (e.key === "ArrowDown") {
        this._currentMenuIndex = Math.min(2, this._currentMenuIndex + 1);
      } else if (e.key === "ArrowUp") {
        this._currentMenuIndex = Math.max(0, this._currentMenuIndex - 1);
      } else if (e.key === "Enter") {
        if (this._currentMenuIndex === 0) {
          this._handleCopyName(e as Event);
        } else if (this._currentMenuIndex === 1) {
          this._handleViewProjects(e as Event);
        }
      }
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "context-menu": ContextMenu;
  }
}
