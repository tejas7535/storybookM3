import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'gq-filter-selection',
  templateUrl: './filter-selection.component.html',
})
export class FilterSelectionComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() items: { value: string; selected: boolean }[];
  form: FormGroup;

  @Output() selection = new EventEmitter<string[]>();
  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  @ViewChild('allSelected') private allSelected: MatOption;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      items: new FormControl({
        value: '',
        disabled: this.items.length === 0,
      }),
    });
    this.selectList();
  }
  ngOnChanges(): void {
    if (this.form) {
      if (this.items.length === 0) this.form.controls.items.disable();

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
    const selectedList = this.allSelected.selected
      ? this.items.map((i) => i.value)
      : [];
    this.emitSelection(selectedList);
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
