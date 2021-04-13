import { Drawing } from '@cdba/core/store/reducers/shared/models';

export const DRAWINGS_MOCK: Drawing[] = [
  new Drawing(
    'Pivot element hydr.',
    'EDD',
    'Delivery Document',
    '00',
    'F-46400.03',
    'E00',
    'FR',
    'Released',
    new Date('2016-04-18'),
    'EDD_F-46400_03_E00_00.tif',
    'TIF',
    'http://foo.bar'
  ),
  new Drawing(
    'Pivot element hydr.',
    'EDD',
    'Delivery Document',
    '00',
    'F-46400.03',
    'D00',
    'FR',
    'Released',
    new Date('2016-04-18'),
    'EDD_F-46400_03_E00_00.tif',
    'TIF',
    'http://foo.bar'
  ),
  new Drawing(
    'Pivot element hydr.',
    'EDD',
    'Delivery Document',
    '00',
    'F-46400.03',
    'C00',
    'FR',
    'Released',
    new Date('2016-04-18'),
    'EDD_F-46400_03_E00_00.tif',
    'TIF',
    'http://foo.bar'
  ),
  new Drawing(
    'Pivot element hydr.',
    'EDD',
    'Delivery Document',
    '00',
    'F-46400.03',
    'C00',
    'FR',
    'Released',
    new Date('201-02-18'),
    'EDD_F-46400_03_E00_00.tif',
    'TIF',
    'http://foo.bar'
  ),
  new Drawing(
    'Pivot element hydr.',
    'EDD',
    'Delivery Document',
    '00',
    'F-46400.03',
    'C00',
    'FR',
    'Released',
    new Date('2096-04-18'),
    'EDD_F-46400_03_E00_00.tif',
    'TIF',
    'http://foo.bar'
  ),
];
