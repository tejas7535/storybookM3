import { Stub } from '../../test/stub.class';
import { StyledSectionComponent } from './styled-section.component';

describe('StyledSectionComponent', () => {
  let component: StyledSectionComponent;

  beforeEach(() => {
    component = Stub.getForEffect({
      component: StyledSectionComponent,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set last property', () => {
    const newValue = true;
    Stub.setInput('last', newValue);
    expect(component.last()).toEqual(newValue);
  });

  it('should set grow property', () => {
    const newValue = false;
    Stub.setInput('grow', newValue);
    expect(component.grow()).toEqual(newValue);
  });

  it('should set fullHeight property', () => {
    const newValue = true;
    Stub.setInput('fullHeight', newValue);
    expect(component.fullHeight()).toEqual(newValue);
  });

  it('should set suppressPadding property', () => {
    const newValue = true;
    Stub.setInput('suppressPadding', newValue);
    expect(component.suppressPadding()).toEqual(newValue);
  });
});
