export const basicTableStyle = `
:host::ng-deep ag-grid-angular {
  .ag-status-bar {
    padding-right: 0 !important;  
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

export const materialTableStatusBarStyle = `
:host::ng-deep ag-grid-angular {
    .ag-status-bar {
    border: none !important;   
    padding-right: 8px !important;  
    padding-left: 8px !important;
    padding-bottom: 8px !important;
  }
}
`;

export const disableTableHorizontalScrollbar = `
:host::ng-deep ag-grid-angular {
    .ag-body-viewport {
    overflow-x: hidden;
  }
  .ag-center-cols-viewport {
    overflow-x:hidden;
  }
}
`;

export const statusBarSimulation = `
:host::ng-deep ag-grid-angular {
  .ag-status-bar-left {   
    justify-content: start;    
    flex:1 !important;  
  } 
  .ag-status-bar-center {
    justify-content: center !important;    
  }  
  .ag-status-bar-right {
    justify-content: end !important;       
  }
 }
`;

export const statusBarWithBorderStyle = `
  :host::ng-deep ag-grid-angular {
    .ag-status-bar {
      border: none !important;
      border-radius: 4px !important;
      padding: 0 !important;
    }
  }
`;
