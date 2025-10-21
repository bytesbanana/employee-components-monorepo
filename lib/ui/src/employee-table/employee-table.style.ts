import { css } from "lit";

export const tableStyles = css`
  :host {
    display: block;
  }

  .header {
    margin: 10px 0;
  }

  .scroll-container {
    overflow-y: scroll;
    overflow-x: hidden;
    max-height: var(--employee-table-max-height, 400px);
  }

  table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    max-width: 50vw;
    height: 2rem;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
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
