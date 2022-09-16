export const basicTableStyle = `
:host::ng-deep ag-grid-angular {
  .ag-status-bar {
    @apply pr-0  #{!important};
    padding-left: 0 !important;
  }
  .ag-root-wrapper {
    border: none !important;
    box-shadow: none !important;
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
  .ag-root-wrapper-body {
    border: 0;
  }
}
`;

export const statusBarStlye = `
:host::ng-deep ag-grid-angular {
    .ag-status-bar {
    border: none !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}`;

export const disableTableHorizontalScrollbar = `
:host::ng-deep ag-grid-angular {
    .ag-body-viewport {
    overflow-x: hidden;
  }
}
`;

export const statusBarSimulation = `
:host::ng-deep ag-grid-angular {
  .ag-status-bar-right {
    width: 100%;
    justify-content: end;
  }
}
`;
