import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'schaeffler-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class PageNotFoundComponent {
  /* istanbul ignore next */
  public showEasterEgg(): boolean {
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth();

    return this.isAprilFirst(date, month);
  }

  /* istanbul ignore next */
  private isAprilFirst(date: number, month: number): boolean {
    return date === 1 && month === 4;
  }
}
