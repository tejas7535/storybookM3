import { NgModule } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';

import { SharedModule } from '../../../../shared/shared.module';
import { ReasonAnalysisComponent } from '../../shared/reason-analysis/reason-analysis.component';
import { GeneralQuestionsRendererComponent } from './general-questions-renderer.component';

@NgModule({
  declarations: [GeneralQuestionsRendererComponent],
  imports: [SharedModule, NgxEchartsModule, ReasonAnalysisComponent],
  exports: [GeneralQuestionsRendererComponent],
})
export class GeneralQuestionsRendererModule {}
