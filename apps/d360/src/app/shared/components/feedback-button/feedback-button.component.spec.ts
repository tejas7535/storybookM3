import { Stub } from '../../test/stub.class';
import { FeedbackButtonComponent } from './feedback-button.component';

describe('FeedbackButtonComponent', () => {
  let component: FeedbackButtonComponent;

  beforeEach(() => {
    component = Stub.get<FeedbackButtonComponent>({
      component: FeedbackButtonComponent,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
