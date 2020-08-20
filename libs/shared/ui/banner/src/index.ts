export { BannerModule } from './lib/banner.module';
export { BannerTextComponent } from './lib/banner-text/banner-text.component';
export { BannerComponent } from './lib/banner.component';
export {
  openBanner,
  closeBanner,
  toggleFullText,
} from './lib/store/actions/banner.actions';

export { getBannerOpen } from './lib/store/selectors/banner.selectors';
export type { BannerState } from './lib/store/reducers/banner.reducer';
