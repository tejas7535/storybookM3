import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Observable } from 'rxjs';

import { BreakpointService } from '../breakpoint-service/breakpoint.service';

@Component({
  selector: 'schaeffler-settings-sidebar',
  templateUrl: './settings-sidebar.component.html',
  styleUrls: ['./settings-sidebar.component.scss']
})
export class SettingsSidebarComponent implements OnInit {
  public isLessThanMedium$: Observable<boolean>;

  @Input() public open = true;
  @Input() public toggleEnabled = false;

  @Output() private readonly openedChange: EventEmitter<
    boolean
  > = new EventEmitter();

  constructor(private readonly breakpointService: BreakpointService) {}

  public ngOnInit(): void {
    this.isLessThanMedium$ = this.breakpointService.isLessThanMedium();
  }

  public onChangeState(open: boolean): void {
    this.openedChange.emit(open);
  }
}
