import { Component } from '@angular/core';

@Component({
  selector: 'ltp-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss'],
})
export class UnauthorizedComponent {
  mailto = 'Matthias.Funk@schaeffler.com';
  subject = `LTP ${location.origin} Access Request`;
  body = `Dear Matthias Funk,%0DPlease provide access to LTP ${location.origin}%0DRegards`;

  href = `mailto:${this.mailto}?subject=${this.subject}&body=${this.body}`;
}
