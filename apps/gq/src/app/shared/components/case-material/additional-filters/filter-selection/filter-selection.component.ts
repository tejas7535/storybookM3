import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-filter-selection',
  templateUrl: './filter-selection.component.html',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    SharedPipesModule,
    ReactiveFormsModule,
    SharedTranslocoModule,
  ],
})
export class FilterSelectionComponent implements OnInit, OnChanges {
  @Output() selection = new EventEmitter<string[]>();
  @Input() title: string;
  @Input() items: { value: string; selected: boolean; name?: string }[];

  @ViewChild('allSelected') private readonly allSelected: MatOption;

  private readonly fb: FormBuilder = inject(FormBuilder);
  form: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      items: new FormControl({
        value: '',
        disabled: this.items.length === 0,
      }),
    });
    this.selectList();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items && !changes.items.firstChange && this.form) {
      if (this.items.length === 0) {
        this.form.controls.items.disable();
      }

      this.selectList();
    }
  }

  selectionChange(event: MatSelectChange): void {
    const selectedList = event.value.filter(
      (val: string | number) => val !== 0
    );

    this.emitSelection(selectedList);
  }

  emitSelection(selectedList: string[]): void {
    this.selection.emit(selectedList);
  }

  toggleAllSelection(): void {
    this.emitSelection(
      this.allSelected.selected ? this.items.map((i) => i.value) : []
    );
  }

  selectList(): void {
    const selectedList: string[] = this.items
      .filter((item) => item.selected)
      .map((item) => item.value);

    if (selectedList.length === this.items.length) {
      this.form.controls.items.patchValue([...selectedList, 0]);
    } else {
      this.form.controls.items.patchValue([...selectedList]);
    }
  }
}
