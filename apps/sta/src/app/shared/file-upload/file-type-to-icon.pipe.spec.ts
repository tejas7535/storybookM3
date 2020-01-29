import { FileTypeToIconPipe } from './file-type-to-icon.pipe';

describe('FileTypeToIconPipe', () => {
  let pipe: FileTypeToIconPipe;
  beforeEach(() => {
    pipe = new FileTypeToIconPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('#transform', () => {
    test('should return default icon when not PDF', () => {
      const transformedValue = pipe.transform('document.txt');
      expect(transformedValue).toEqual('icon-document');
    });

    test('should return PDF icon on pdf filetype', () => {
      const transformedValue = pipe.transform('document.pdf');
      expect(transformedValue).toEqual('icon-pdf');
    });

    test('should return Word icon on docx filetype', () => {
      const transformedValue = pipe.transform('document.docx');
      expect(transformedValue).toEqual('icon-word');
    });
  });
});
