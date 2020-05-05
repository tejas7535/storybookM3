import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { BannerTextModule } from './banner-text/banner-text.module';
import { BannerComponent } from './banner.component';
import {
  BannerState,
  closeBanner,
  initialState,
  toggleFullText,
} from './store';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let store: MockStore<{ banner: BannerState }>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [BannerComponent],
      imports: [BannerTextModule, provideTranslocoTestingModule({})],
      providers: [
        provideMockStore({
          initialState: { banner: initialState },
        }),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.inject(Store) as MockStore<{ banner: BannerState }>;
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

    it('selectors should return correct values', async(() => {
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
    }));

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
