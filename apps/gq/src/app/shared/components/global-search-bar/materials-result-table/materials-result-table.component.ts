import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'gq-materials-result-table',
  templateUrl: './materials-result-table.component.html',
})
export class MaterialsResultTableComponent implements OnInit {
  @Output() criteriaSelected: EventEmitter<string> = new EventEmitter<string>();

  criteriaSelectedValue = 'matNumber';

  ngOnInit(): void {
    this.criteriaSelected.emit(this.criteriaSelectedValue);
  }

  radioButtonChanged(): void {
    this.criteriaSelected.emit(this.criteriaSelectedValue);
  }
}
