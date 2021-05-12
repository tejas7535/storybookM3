import { initialState } from './../reducers/banner.reducer';
import * as fromSelectors from './banner.selectors';

describe('BannerSelector', () => {
  describe('#getBannerOpen', () => {
    it('should return false when state is not defined', () => {
      const result = fromSelectors.getBannerOpen.projector(initialState);
      expect(result).toEqual(initialState.open);
      expect(typeof result).toEqual(typeof initialState.open);
    });
  });

  describe('#getBannerText', () => {
    it('should return false when state is not defined', () => {
      const result = fromSelectors.getBannerText.projector(initialState);
      expect(result).toEqual(initialState.text);
      expect(typeof result).toEqual(typeof initialState.text);
    });
  });

  describe('#getBannerButtonText', () => {
    it('should return false when state is not defined', () => {
      const result = fromSelectors.getBannerButtonText.projector(initialState);
      expect(result).toEqual(initialState.buttonText);
      expect(typeof result).toEqual(typeof initialState.buttonText);
    });
  });

  describe('#getBannerIcon', () => {
    it('should return false when state is not defined', () => {
      const result = fromSelectors.getBannerIcon.projector(initialState);
      expect(result).toEqual(initialState.icon);
      expect(typeof result).toEqual(typeof initialState.icon);
    });
  });

  describe('#getBannerTruncateSize', () => {
    it('should return false when state is not defined', () => {
      const result =
        fromSelectors.getBannerTruncateSize.projector(initialState);
      expect(result).toEqual(initialState.truncateSize);
      expect(typeof result).toEqual(typeof initialState.truncateSize);
    });
  });

  describe('#getBannerIsFullTextShown', () => {
    it('should return false when state is not defined', () => {
      const result =
        fromSelectors.getBannerIsFullTextShown.projector(initialState);
      expect(result).toEqual(initialState.showFullText);
      expect(typeof result).toEqual(typeof initialState.showFullText);
    });
  });
});
