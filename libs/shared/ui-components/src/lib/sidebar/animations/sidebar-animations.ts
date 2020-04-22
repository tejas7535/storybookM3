import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

export const sidebarAnimation = trigger('onAnimateSidebar', [
  state(
    'minify',
    style({
      width: '60px'
    })
  ),
  state(
    'open',
    style({
      width: '{{width}}'
    }),
    { params: { width: '265px' } }
  ),
  transition('minify => open', animate('250ms ease-in')),
  transition('open => minify', animate('250ms ease-in'))
]);

export const contentAnimation = trigger('onAnimateContent', [
  state(
    'minify',
    style({
      'margin-left': '60px'
    })
  ),
  state(
    'open',
    style({
      'margin-left': '{{margin_left}}'
    }),
    { params: { margin_left: '265px' } }
  ),
  transition('minify => open', animate('250ms ease-in')),
  transition('open => minify', animate('250ms ease-in'))
]);
