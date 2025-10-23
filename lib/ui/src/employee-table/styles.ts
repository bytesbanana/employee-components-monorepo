import { css } from "lit";

export const tableStyles = css`
  :host {
    display: block;
  }

  .header {
    margin: 10px 0;
  }

  table {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  tr {
    display: flex;
    width: 100%;
  }
  th,
  td {
    flex: auto;
    position: relative;
    border: 1px solid #ddd;
    padding: 8px;
    height: 2rem;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .scroll-container {
    max-height: var(--employee-table-max-height, 400px);
    overflow: scroll;
  }

  .resize-handle {
    position: absolute;
    right: 0%;
    top: 0%;
    width: 8px;
    height: 100%;
    background-color: #8e8e8e;
  }
  .resize-handle:hover {
    cursor: col-resize;
  }

  thead {
    position: sticky;
    top: 0;
    z-index: 1;
    background: #f2f2f2;
  }

  mark {
    background: yellow;
  }
`;

export const menuButtonStyles = css`
  .menu-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: scale 200ms ease-in-out;
  }

  .menu-btn:hover {
    background: #f0f0f0;
  }

  .menu-btn:active {
    scale: 95%;
  }
`;

export const contextMenuStyles = css`
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
    list-style-type: none;
    padding: 0;
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

  .menu-item:hover,
  .menu-item:focus,
  .menu-item.active {
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

export const modalStyles = css`
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
