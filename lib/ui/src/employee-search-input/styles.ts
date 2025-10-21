import { css } from "lit";

export const inputStyles = css`
  host {
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
