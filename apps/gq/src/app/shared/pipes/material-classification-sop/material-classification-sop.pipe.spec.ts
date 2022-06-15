import { Keyboard } from '../../models';
import { MaterialClassificationSOP } from '../../models/quotation-detail';
import { MaterialClassificationSOPPipe } from './material-classification-sop.pipe';

describe('MaterialClassificationSopPipe', () => {
  test('create an instance', () => {
    const pipe = new MaterialClassificationSOPPipe();
    expect(pipe).toBeTruthy();
  });
  test('transform materialclassification to OP', () => {
    const pipe = new MaterialClassificationSOPPipe();

    const result = pipe.transform('0');
    expect(result).toEqual(MaterialClassificationSOP.OP);
  });
  test('transform materialclassification to AP', () => {
    const pipe = new MaterialClassificationSOPPipe();

    const result = pipe.transform('1');
    expect(result).toEqual(MaterialClassificationSOP.AP);
  });
  test('transform materialclassification to SP', () => {
    const pipe = new MaterialClassificationSOPPipe();

    const result = pipe.transform('3');
    expect(result).toEqual(MaterialClassificationSOP.SP);
  });
  test('transform materialclassification to Dash', () => {
    const pipe = new MaterialClassificationSOPPipe();

    const result = pipe.transform('');
    expect(result).toEqual(Keyboard.DASH);
  });
});
