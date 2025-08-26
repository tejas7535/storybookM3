import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { SectionHeading } from '../../components';
import { PdfCardComponent } from '../../components/pdf-card/pdf-card';
import {
  ListStyle,
  StringListComponent,
} from '../../components/string-list/string-list';
import { Component } from '../../core';
import { PdfComponentFactory } from './pdf-component-factory.service';

class TestComponent extends Component {}

describe('PdfComponentFactory', () => {
  let spectator: SpectatorService<PdfComponentFactory>;
  let service: PdfComponentFactory;

  const createService = createServiceFactory({
    service: PdfComponentFactory,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createCard', () => {
    test('should create a card component with content', () => {
      const mockComponents = [new TestComponent(), new TestComponent()];

      const card = service.createCard(mockComponents);

      expect(card).toBeInstanceOf(PdfCardComponent);
    });

    test('should create a card with custom options', () => {
      const mockComponents = [new TestComponent()];
      const options = {
        borderRadius: 10,
        backgroundColor: '#ffffff',
        padding: 15,
        margin: 5,
        borderColor: '#000000',
        borderWidth: 2,
        keepTogether: true,
      };

      const card = service.createCard(mockComponents, options);

      expect(card).toBeInstanceOf(PdfCardComponent);
    });
  });

  describe('createStringList', () => {
    test('should create a string list component', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];

      const stringList = service.createStringList(items, ListStyle.BULLET);

      expect(stringList).toBeInstanceOf(StringListComponent);
    });

    test('should filter out empty items', () => {
      const items = ['Item 1', '', 'Item 3', undefined as unknown as string];

      const stringList = service.createStringList(items, ListStyle.NUMBERED);

      expect(stringList).toBeInstanceOf(StringListComponent);
    });

    test('should create a string list with custom options', () => {
      const items = ['Item 1', 'Item 2'];
      const options = {
        backgroundColor: '#f5f5f5',
        fontOptions: {
          fontFamily: 'Noto',
          fontSize: 12,
        },
      };

      const stringList = service.createStringList(
        items,
        ListStyle.NONE,
        options
      );

      expect(stringList).toBeInstanceOf(StringListComponent);
    });
  });

  describe('createSectionHeading', () => {
    test('should create a section heading component', () => {
      const text = 'Section Title';

      const heading = service.createSectionHeading(text);

      expect(heading).toBeInstanceOf(SectionHeading);
    });
  });
});
