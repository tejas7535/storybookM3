import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { BannerTextModule } from './banner-text/banner-text.module';
import { BannerComponent } from './banner.component';
import { closeBanner, toggleFullText } from './store/actions/banner.actions';
import { initialState } from './store/reducers/banner.reducer';

describe('BannerComponent', () => {
  let spectator: Spectator<BannerComponent>;
  let component: BannerComponent;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: BannerComponent,
    imports: [BannerTextModule, ReactiveComponentModule],
    providers: [
      provideMockStore({
        initialState: { banner: initialState },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    store = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
    expect(store).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to store', () => {
      expect(component.showBanner$).toBeDefined();
      expect(component.bannerText$).toBeDefined();
      expect(component.bannerButtonText$).toBeDefined();
      expect(component.truncateSize$).toBeDefined();
      expect(component.showFullText$).toBeDefined();
    });

    it('selectors should return correct values', () => {
      store.setState({
        banner: {
          text: 'banner text',
          buttonText: 'OK',
          icon: 'info',
          truncateSize: 120,
          showFullText: false,
          open: true,
        },
      });
      store.refreshState();

      component.showBanner$.subscribe((showBanner) =>
        expect(showBanner).toEqual(true)
      );

      component.bannerText$.subscribe((bannerText) =>
        expect(bannerText).toEqual('banner text')
      );

      component.bannerButtonText$.subscribe((bannerButtonText) =>
        expect(bannerButtonText).toEqual('OK')
      );

      component.truncateSize$.subscribe((truncateSize) =>
        expect(truncateSize).toEqual(120)
      );

      component.showFullText$.subscribe((showFullText) =>
        expect(showFullText).toEqual(false)
      );
    });

    describe('closeBanner', () => {
      it('should dispatch action closeBanner', () => {
        spyOn(store, 'dispatch');

        component.closeBanner();

        expect(store.dispatch).toHaveBeenCalledWith(closeBanner());
      });
    });

    describe('toggleFullText', () => {
      it('should dispatch action toggleFullText', () => {
        spyOn(store, 'dispatch');

        component.toggleFullText();

        expect(store.dispatch).toHaveBeenCalledWith(toggleFullText());
      });
    });
  });
});
