import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Employee } from "@lib/data";
import { computePosition, offset } from "@floating-ui/dom";
import { contextMenuStyles } from "./styles";

@customElement("context-menu")
export class ContextMenu extends LitElement {
  static styles = [contextMenuStyles];

  @property({ type: Boolean })
  visible = false;

  @property({ type: Object })
  anchorElement: HTMLElement | null = null;

  @property({ type: Object })
  employee: Employee | null = null;

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
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "context-menu": ContextMenu;
  }
}
