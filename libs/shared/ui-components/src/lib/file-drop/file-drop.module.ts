import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { DroppableDirective } from './droppable.directive';
import { FileDropComponent } from './file-drop.component';

@NgModule({
  imports: [CommonModule, FlexLayoutModule],
  declarations: [FileDropComponent, DroppableDirective],
  exports: [FileDropComponent]
})
export class FileDropModule {}
