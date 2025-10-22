import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Employee } from "@lib/data";
import { modalStyles } from "./styles";

@customElement("project-modal")
export class ProjectModal extends LitElement {
  static styles = [modalStyles];

  @property({ type: Boolean })
  visible = false;

  @property({ type: Object })
  employee: Employee | null = null;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this._handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  render() {
    if (!this.visible || !this.employee) return html``;

    return html`
      <div class="modal-backdrop" @click="${this._handleBackdropClick}">
        <div class="modal-content" @click="${(e: Event) => e.stopPropagation()}">
          <div class="modal-header">
            <h3>${this.employee.name}'s Projects</h3>
            <button class="close-btn" @click="${this._handleClose}">&times;</button>
          </div>
          <div class="modal-body">
            ${this.employee.projects.length > 0
              ? html`${this.employee.projects.map(
                  (project) => html`
                    <div class="project">
                      <h4>${project.projectName}</h4>
                      <p>Start Date: ${project.startDate}</p>
                      <div class="tasks">
                        <h5>Tasks:</h5>
                        ${project.tasks.map(
                          (task) => html`
                            <div class="task">
                              <p>${task.title}</p>
                              <p>Status: ${task.status}</p>
                              <p>
                                Hours Spent: ${task.details.hoursSpent || "N/A"}
                              </p>
                              <p>
                                Technologies Used:
                                ${task.details.technologiesUsed.join(", ")}
                              </p>
                              <p>
                                Completion Date:
                                ${task.details.completionDate || "N/A"}
                              </p>
                              <p>
                                Expected Completion:
                                ${task.details.expectedCompletion || "N/A"}
                              </p>
                            </div>
                          `
                        )}
                      </div>
                    </div>
                  `
                )}`
              : html`<p>No projects assigned.</p>`}
          </div>
        </div>
      </div>
    `;
  }

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this.visible) {
      this._handleClose();
    }
  };

  private _handleBackdropClick = () => {
    this._handleClose();
  };

  private _handleClose = () => {
    this.dispatchEvent(
      new CustomEvent("close", {
        bubbles: true,
        composed: true,
      })
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "project-modal": ProjectModal;
  }
}