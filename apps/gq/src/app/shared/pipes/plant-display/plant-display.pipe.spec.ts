import { PLANT_MOCK } from '../../../../testing/mocks';
import { Plant } from '../../models/quotation-detail';
import { PlantDisplayPipe } from './plant-display.pipe';

describe('PlantDisplayPipe', () => {
  test('create an instance', () => {
    const pipe = new PlantDisplayPipe();
    expect(pipe).toBeTruthy();
  });

  test('should transform data', () => {
    const pipe = new PlantDisplayPipe();
    const plant: Plant = PLANT_MOCK;
    const expected = `${plant.plantNumber} | ${plant.city}, ${plant.country}`;
    const result = pipe.transform(plant);

    expect(result).toEqual(expected);
  });
  test('should transform data', () => {
    const pipe = new PlantDisplayPipe();
    const plant = undefined as any;
    const result = pipe.transform(plant);

    expect(result).toEqual('-');
  });
});
