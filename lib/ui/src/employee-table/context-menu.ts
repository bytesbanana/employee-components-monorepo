import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Employee } from "@lib/data";
import { computePosition, flip, offset, shift } from "@floating-ui/dom";
import { classMap } from "lit/directives/class-map.js";

@customElement("context-menu")
export class ContextMenu extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      z-index: 1000;
    }

    .context-menu {
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      min-width: 150px;
      display: block;
    }

    .context-menu.hidden {
      display: none;
    }

    .menu-item {
      padding: 8px 12px;
      cursor: pointer;
      font-size: 14px;
      border-bottom: 1px solid #eee;
    }

    .menu-item:last-child {
      border-bottom: none;
    }

    .menu-item:hover {
      background: #f5f5f5;
    }

    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      width: 90%;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #eee;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 18px;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      background: #f0f0f0;
      border-radius: 4px;
    }

    .modal-body {
      padding: 16px;
    }

    .project {
      margin-bottom: 24px;
      border-bottom: 1px solid #eee;
      padding-bottom: 16px;
    }

    .project:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .project h4 {
      margin: 0 0 8px 0;
      font-size: 16px;
      color: #333;
    }

    .project p {
      margin: 4px 0;
      font-size: 14px;
      color: #666;
    }

    .tasks {
      margin-top: 12px;
    }

    .tasks h5 {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #333;
    }

    .task {
      background: #f9f9f9;
      border-radius: 4px;
      padding: 12px;
      margin-bottom: 8px;
    }

    .task:last-child {
      margin-bottom: 0;
    }

    .task p {
      margin: 4px 0;
      font-size: 13px;
    }

    .task p:first-child {
      font-weight: bold;
      color: #333;
    }
  `;

  @property({ type: Boolean })
  visible = false;

  @property({ type: Object })
  anchorElement: HTMLElement | null = null;

  @property({ type: Object })
  employee: Employee | null = null;

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    if (!this.visible) return html``;
    return html`
      <div class="context-menu">
        <div class="menu-item" @click="${this._handleCopyName}">COPY NAME</div>
        <div class="menu-item" @click="${this._handleViewProjects}">
          VIEW PROJECTS
        </div>
      </div>
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
    console.log("updatePosition");

    const { x, y } = await computePosition(this.anchorElement, this, {
      placement: "right-start",
      middleware: [offset(10)],
    });

    this.style.left = `${x}px`;
    this.style.top = `${y}px`;
  };

  private async _handleCopyName(e: Event) {
    e.stopPropagation();
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
    e.stopPropagation();
    // TODO: Implement view projects functionality
    console.log("View projects clicked");
    this._closeContextMenu();
  }

  private _closeContextMenu() {
    this.dispatchEvent(
      new CustomEvent("onContextMenuClose", {
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "context-menu": ContextMenu;
  }
}
