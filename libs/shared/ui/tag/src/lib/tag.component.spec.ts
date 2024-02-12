import { CommonModule } from '@angular/common';

import {
  byText,
  createComponentFactory,
  Spectator,
} from '@ngneat/spectator/jest';

import { TagComponent } from './tag.component';

describe('TagComponent', () => {
  let component: TagComponent;
  let spectator: Spectator<TagComponent>;
  const createComponent = createComponentFactory({
    component: TagComponent,
    imports: [CommonModule],
    providers: [],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.setInput('value', 'FancyTagName');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the value', () => {
    expect(spectator.query(byText('FancyTagName'))).toHaveText('FancyTagName');
  });

  describe('withDot', () => {
    it('should have a dot by default', () => {
      expect(spectator.query('.tag-dot')).toBeTruthy();
    });

    it('should not have a dot', () => {
      spectator.setInput('withDot', false);
      expect(spectator.query('.tag-dot')).toBeFalsy();
    });
  });

  describe('size', () => {
    it('should have a default size', () => {
      expect(spectator.query('.text-\\[12px\\]')).toBeTruthy();
    });

    it('should have a small size', () => {
      spectator.setInput('size', 'small');
      expect(spectator.query('.text-\\[8px\\]')).toBeTruthy();
    });
  });

  describe('styleClass', () => {
    it('should have a style class', () => {
      spectator.setInput('styleClass', 'bg-red-500');
      expect(spectator.query('.bg-red-500')).toBeTruthy();
    });
  });

  describe('type', () => {
    it('should be of warning type', () => {
      spectator.setInput('type', 'warning');
      expect(spectator.query('.tag-warning')).toBeTruthy();
    });
  });

  it('should not have border by default', () => {
    expect(spectator.query('.tag-border')).toBeFalsy();
  });

  describe('withBorder', () => {
    it('should have a border', () => {
      spectator.setInput('withBorder', true);
      expect(spectator.query('.tag-border')).toBeTruthy();
    });
  });

  describe('without border', () => {
    it('should not have a border', () => {
      spectator.setInput('withBorder', false);
      expect(spectator.query('.tag-border')).toBeFalsy();
    });
  });
});
