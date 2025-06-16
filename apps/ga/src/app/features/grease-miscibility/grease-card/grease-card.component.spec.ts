import { MatCardModule } from '@angular/material/card';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { TagComponent } from '@schaeffler/tag';

import { GreaseReportShopButtonsComponent } from '@ga/features/grease-calculation/calculation-result/components/grease-report-shop-buttons/grease-report-shop-buttons.component';
import { SUITABILITY_LABEL } from '@ga/features/grease-calculation/calculation-result/models';

import { GreaseCardComponent } from './grease-card.component';

describe('GreaseCardComponent', () => {
  let spectator: Spectator<GreaseCardComponent>;
  const createComponent = createComponentFactory({
    component: GreaseCardComponent,
    imports: [
      MatCardModule,
      MatIconTestingModule,
      MockComponent(TagComponent),
      MockComponent(GreaseReportShopButtonsComponent),
    ],
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        title: 'Test Title',
        description: 'Test Description',
        tagLabel: 'Test Tag',
        imgSrc: 'test.png',
        currentLanguage: 'en',
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should expose title, description, tagLabel, imgSrc as signals', () => {
    expect(spectator.component.title()).toBe('Test Title');
    expect(spectator.component.description()).toBe('Test Description');
    expect(spectator.component.tagLabel()).toBe('Test Tag');
    expect(spectator.component.imgSrc()).toBe('test.png');
  });

  it('should have required currentLanguage input', () => {
    expect(spectator.component.currentLanguage()).toBe('en');
  });

  it('should render title, description and tag in the template', () => {
    const titleEl = spectator.query('.text-title-medium');
    const descriptionEl = spectator.query('.text-label-small');
    const tag = spectator.query(TagComponent);

    expect(titleEl).toHaveText('Test Title');
    expect(descriptionEl).toHaveText('Test Description');
    expect(tag).toBeTruthy();
    expect(tag.value).toBe('Test Tag');
  });

  it('should render image with correct source', () => {
    const imgEl = spectator.query('img');
    expect(imgEl).toHaveAttribute('src', 'test.png');
    expect(imgEl).toHaveAttribute('alt', 'Arcanol LZ 2');
  });

  it('should compute greaseResult based on title', () => {
    expect(spectator.component.greaseResult()).toEqual({
      mainTitle: 'Test Title',
      subTitle: 'anything not used in view',
      isSufficient: true,
      dataSource: [],
    });
  });

  it('should have default settings', () => {
    expect(spectator.component.settings).toEqual({
      label: SUITABILITY_LABEL.SUITED,
      hint: '',
      c1_60: 0,
      c1_125: 0,
    });
  });

  describe('getLocalizedDescription computed property', () => {
    it('should return empty string for falsy description', () => {
      spectator.setInput('description', '');
      expect(spectator.component.getLocalizedDescription()).toBe('');

      spectator.setInput('description', undefined);
      expect(spectator.component.getLocalizedDescription()).toBe('');
    });

    it('should return string description directly', () => {
      spectator.setInput('description', 'Simple string description');
      expect(spectator.component.getLocalizedDescription()).toBe(
        'Simple string description'
      );
    });

    it('should return localized description based on currentLanguage', () => {
      const localizedDesc = {
        en: 'English description',
        de: 'Deutsche Beschreibung',
      };
      spectator.setInput('description', localizedDesc);
      spectator.setInput('currentLanguage', 'de');
      expect(spectator.component.getLocalizedDescription()).toBe(
        'Deutsche Beschreibung'
      );
    });

    it('should fallback to English when current language is not available', () => {
      const localizedDesc = {
        en: 'English description',
        de: 'Deutsche Beschreibung',
      };
      spectator.setInput('description', localizedDesc);
      spectator.setInput('currentLanguage', 'fr');
      expect(spectator.component.getLocalizedDescription()).toBe(
        'English description'
      );
    });

    it('should return empty string when no matching language or English fallback is available', () => {
      const localizedDesc = {
        de: 'Deutsche Beschreibung',
        fr: 'Description française',
      };
      spectator.setInput('description', localizedDesc);
      spectator.setInput('currentLanguage', 'es');
      expect(spectator.component.getLocalizedDescription()).toBe('');
    });
  });

  it('should pass greaseResult and settings to shop buttons component', () => {
    const shopButtons = spectator.query(GreaseReportShopButtonsComponent);
    expect(shopButtons).toBeTruthy();
    expect(shopButtons.greaseResult).toEqual(
      spectator.component.greaseResult()
    );
    expect(shopButtons.settings).toEqual(spectator.component.settings);
  });
});
