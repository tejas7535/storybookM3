import { Stub } from '../../test/stub.class';
import { DataHintComponent } from './data-hint.component';

describe('DataHintComponent', () => {
  let component: DataHintComponent;

  beforeEach(() => {
    component = Stub.getForEffect<DataHintComponent>({
      component: DataHintComponent,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an empty text input by default', () => {
    expect(component.text()).toBe('');
  });

  it('should allow setting text input', () => {
    const testText = 'Test hint text';
    Stub.setInput('text', testText);
    Stub.detectChanges();
    expect(component.text()).toBe(testText);
  });
});
