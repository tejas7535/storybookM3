import { animate, style, transition, trigger } from '@angular/animations';

export const fadeInAnimation = trigger('fadeInAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-5px)' }),
    animate(
      '400ms ease-out',
      style({
        opacity: 1,
        transform: 'translateY(0px)'
      })
    )
  ])
]);
