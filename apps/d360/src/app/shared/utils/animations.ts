import {
  animate,
  AnimationTriggerMetadata,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Animations {
  public static get flyInOut(): AnimationTriggerMetadata {
    return trigger('flyInOut', [
      state('inactive', style({ opacity: 0 })),
      transition(
        'inactive => active',
        animate(
          '300ms ease-out',
          keyframes([
            style({ transform: 'translate3d(0, 100%, 0)', opacity: 0 }),
            style({ transform: 'none', opacity: 1 }),
          ])
        )
      ),
      transition(
        'active => removed',
        animate(
          '300ms ease-out',
          keyframes([
            style({ opacity: 1 }),
            style({ transform: 'translate3d(0, 100%, 0)', opacity: 0 }),
          ])
        )
      ),
    ]);
  }
}
