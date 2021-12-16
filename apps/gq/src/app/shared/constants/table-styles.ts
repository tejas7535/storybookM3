export const basicTableStyle = `
::ng-deep ag-grid-angular {
  .ag-root-wrapper-body {
    border: 0;
  }
  .ag-row {
    border: 0;
  }
  .ag-root-wrapper {
    border: 0;
  }
  .ag-pinned-left-header {
    border-right: 0 !important;
  }
  .ag-cell {
    border-right: 0 !important;
  }
  .ag-text-field-input {
    color: #00893D !important;
  }
}
`;

export const statusBarStlye = `  
::ng-deep ag-grid-angular {
    .ag-status-bar {
    border: none !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}`;

export const disableTableHorizontalScrollbar = `
::ng-deep ag-grid-angular {
    .ag-body-viewport {
    overflow-x: hidden;
  }
}
`;
