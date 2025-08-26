import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { TwoColumnPageLayout } from '../components/layout/two-columns-page-layout';
import { Component } from '../core';
import { PdfLayoutService } from './pdf-layout.service';

class MockComponent extends Component {}

describe('PdfLayoutService', () => {
  let spectator: SpectatorService<PdfLayoutService>;
  let service: PdfLayoutService;

  const createService = createServiceFactory({
    service: PdfLayoutService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  describe('createTwoColumnLayouts', () => {
    it('should create layout components with even distribution', () => {
      const component1 = new MockComponent();
      const component2 = new MockComponent();
      const component3 = new MockComponent();
      const components = [component1, component2, component3];

      const pairComponentsEvenlySpy = jest.spyOn(
        service as any,
        'pairComponentsEvenly'
      );
      const createLayoutSpy = jest.spyOn(service as any, 'createLayout');

      const result = service.createTwoColumnLayouts(components);

      expect(pairComponentsEvenlySpy).toHaveBeenCalledWith(components);
      expect(createLayoutSpy).toHaveBeenCalledTimes(2);
      expect(result.length).toBe(2);
      expect(result[0]).toBeInstanceOf(TwoColumnPageLayout);
      expect(result[1]).toBeInstanceOf(TwoColumnPageLayout);
    });

    it('should use custom options when provided', () => {
      const components = [new MockComponent(), new MockComponent()];
      const options = {
        columnGap: 10,
        leftColumnWidth: 0.6,
      };

      const createLayoutSpy = jest.spyOn(service as any, 'createLayout');

      service.createTwoColumnLayouts(components, options);

      expect(createLayoutSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        options.columnGap,
        options.leftColumnWidth
      );
    });
  });

  describe('createTwoColumnLayoutsWithComponents', () => {
    it('should create multiple layouts with the specified left and right components', () => {
      const leftComponents = [new MockComponent(), new MockComponent()];
      const rightComponents = [new MockComponent(), new MockComponent()];

      const createLayoutSpy = jest.spyOn(service as any, 'createLayout');

      const result = service.createTwoColumnLayoutsWithComponents(
        leftComponents,
        rightComponents
      );

      expect(createLayoutSpy).toHaveBeenCalledTimes(2);
      expect(result.length).toBe(2);
      expect(result[0]).toBeInstanceOf(TwoColumnPageLayout);
      expect(result[1]).toBeInstanceOf(TwoColumnPageLayout);
    });

    it('should use custom options when provided', () => {
      const leftComponents = [new MockComponent()];
      const rightComponents = [new MockComponent()];
      const options = {
        columnGap: 8,
        leftColumnWidth: 0.4,
      };

      const createLayoutSpy = jest.spyOn(service as any, 'createLayout');

      service.createTwoColumnLayoutsWithComponents(
        leftComponents,
        rightComponents,
        options
      );

      expect(createLayoutSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        options.columnGap,
        options.leftColumnWidth
      );
    });
  });
});
