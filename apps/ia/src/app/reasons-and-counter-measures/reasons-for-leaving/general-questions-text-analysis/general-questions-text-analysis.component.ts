import { Component, Input } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

import { SharedModule } from '../../../shared/shared.module';
import { LoadingDataTableComponent } from '../../../shared/tables/loading-data-table';
import { GeneralQuestionsGridData } from '../../models';
import { GeneralQuestionsRendererComponent } from './general-questions-renderer/general-questions-renderer.component';
import { GeneralQuestionsRendererModule } from './general-questions-renderer/general-questions-renderer.module';

@Component({
  selector: 'ia-general-questions-text-analysis',
  standalone: true,
  imports: [SharedModule, AgGridModule, GeneralQuestionsRendererModule],
  templateUrl: './general-questions-text-analysis.component.html',
  styles: [
    `
      ::ng-deep .general-questions-header {
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.87);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class GeneralQuestionsTextAnalysisComponent extends LoadingDataTableComponent<GeneralQuestionsGridData> {
  columnDefs: ColDef[] = [
    {
      headerName: translate(
        'reasonsAndCounterMeasures.reasonsForLeaving.generalQuestionsTextAnalysis.header'
      ),
      minWidth: 86,
      headerClass: 'bg-selected-overlay general-questions-header',
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    filter: false,
    resizable: true,
    suppressHeaderMenuButton: true,
    flex: 1,
  };

  GeneralQuestionsRendererComponent = GeneralQuestionsRendererComponent;
  components = {
    GeneralQuestionsRendererComponent,
  };

  @Input() data: GeneralQuestionsGridData[];

  isFullWidthRowRenderer(): boolean | undefined {
    return true;
  }
}
