import { NgModule } from '@angular/core';

import { DefaultValuePipe } from './default-value/default-value.pipe';

@NgModule({
  declarations: [DefaultValuePipe],
  imports: [],
  exports: [DefaultValuePipe],
})
export class SharedPipesModule {}
