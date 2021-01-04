 Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
**Note:** Dependency updates, refactored code & style/test/performance changes are not shown within this changelog. Thus, releases without any entries may occur.

## 2.0.0 (2021-01-04)


### ⚠ BREAKING CHANGES

* **banner:** Banner is now published in its own library, the import path is now `@schaeffler/banner`
* **header:** Header, Responsive and Transloco are moved to new publishable libraries (@schaeffler/shared/ui-components --> `@schaeffler/header`; @schaeffler/shared/responsive --> `@schaeffler/responsive`; @schaeffler/shared/transloco--> `@schaeffler/transloco`)

### 📈 Improvements

* **empty-states:** handle empty state translation inside the library (FRON-131) ([7a4eb3b](///commit/7a4eb3b4e2d4420ca0590a160e8ee15db1e9ce77))
* **sta:** Adjust HTML & platform title (UFTABI-1539) ([82a47e7](///commit/82a47e7942c1d565985f179a9b188a1a1f19f634))
* **ui-components:** improve banner styling (UFTABI-1887) ([07de06f](///commit/07de06f7aefc3d98b6a8814f8c77d9066bbc3459))
* **ui-components:** remove BrowserAnimationsModule ([14c5ad2](///commit/14c5ad2014529b3d6f4e1280572b179e6a6e212a))
* **workspace:** remove hammerjs (UFTABI-2167) ([d26c97d](///commit/d26c97d61141d55d330e34ace1f4de667cb300f1))
* apply transloco best practises (FRON-203) ([25cdbf9](///commit/25cdbf9f2adfea70de9e12ecdaceaf3bba3e2f1b))


### 🐛 Bug Fixes

* **ltp:** adjust chart and legend colors, chart bugfix (ADAPLD-6714) ([b6f16d7](///commit/b6f16d7a0d7228bc94ab1da1b0f0a17ba8c92594))
* **ltp:** fix dev environment (ADAPLD-6469) ([824e6a7](///commit/824e6a792ee6fa69f4cb895c3046343a64c3500b))
* **ltp:** fix env import ([3f323b7](///commit/3f323b77d0feb2469d6d0359b658b17a6933751f))
* **ltp:** fix load settings to be reflected in api request (ADAPLD-6690) ([5a369c0](///commit/5a369c049487b021061d1163e124ca6500e57f01))
* **ltp:** fixed linter issues ([7f95589](///commit/7f95589bfff7cf4dc9fec2ebfda206cf93759abf))
* **ltp:** fixed linter issues ([2d8cf8a](///commit/2d8cf8ae5cc40eb32fd0817739f2bf3afe772a3a))
* use -1 as value for survivor (ADAPLD-6274) ([4a85b8e](///commit/4a85b8ec6d03845eb0d5131f75654f14ddf35b69))


### 🎸 Features

* **auth:** enable code flow (UFTABI-2237) ([d9b4ffa](///commit/d9b4ffa0452b69f4547db98f0698f8f9d8eabd91))
* **banner:** split banner into seperate publishable lib (UFTABI-2313) ([1cf9ecc](///commit/1cf9ecce8a2af98526795201b7e4c68adb04cf90))
* **ci:** enable manual releases (UFTABI-2968) ([a7daa45](///commit/a7daa45700b798bae3340e87400c92288d4dd84b))
* **deps:** update to angular v10.1 and typescript 4.0.2 ([edc0bb1](///commit/edc0bb1d32af1b0b585de3f79bc96eaf393c240e))
* **deps:** update to nx 11 and fix jest setup ([4df2df3](///commit/4df2df38f8a3fa29abae9b9f736e7d237344541b))
* **empty-states:** migrate lib to publishable lib (UFTABI-2635) ([977435f](///commit/977435f2481c68dcb842cbe3f3aaa93302e0175d))
* **header:** split header into seperate publishable lib (UFTABI-2309) ([721ead8](///commit/721ead8681c9ce017e6ff939911dc31d449831f7))
* **ltp:** 🎸 change loadcase and ml-prediction request (UFTABI-2847) ([1f90746](///commit/1f907466d1c3e087cf7d1f0d8248df0a94245a14))
* **ltp:** add dummy loads file (ADAPLD-5961) ([fa7c97b](///commit/fa7c97bd235d781a31da18cee95629b367730da1))
* **ltp:** add loads modal (ADAPLD-6276) ([9becf2b](///commit/9becf2b640ac8af507e4b86dfeac8652baeb600a))
* **ltp:** added app skeleton for LTP (FRON-234) ([aef09cc](///commit/aef09cc1843e3b4f94de09638f86209ae78019fa))
* **ltp:** display hardness diversification in chart (ADAPLD-5838) ([593e9e2](///commit/593e9e29964098586d00bb0c4ee8dfc98f9b56ce))
* **ltp:** enable strict compiler options (ADAPLD-6344) ([95fba74](///commit/95fba74bcd7f05e39334818e90ddc635561e36a3))
* **ltp:** fix wrong legend entry ([01c6322](///commit/01c6322313e709aa8799db2c9233fdea9273221e))
* **ltp:** integrate non linear regression model (ADAPLD-6763) ([c0d5900](///commit/c0d5900ea3be0db3dc13ea79e1e7c27f7b87b306))
* **ltp:** migrate from ngxtranslate to transloco (FRON-237) ([09b38b6](///commit/09b38b602c47061da5eb3b20252f65388dfb25e7))
* **ltp:** migration of LTP (FRON-235) ([c1a73b1](///commit/c1a73b18354f19b4e5036e7e7e241b0a5858703c))
* **ltp:** oauth2 authentication via Azure AD (ADAPLD-6461) ([01a2a11](///commit/01a2a1188de31901458c939c582cf9d724c540d0))
* **ltp:** reactivate tests (UFTABI-3387) ([9ba5684](///commit/9ba56848f51117152d993c0e87d1dd7b5afcbebb))
* **ltp:** replace charts with new framework (UFTABI-3421) ([dc3f61a](///commit/dc3f61a2517d629917cfe552df42f1407731bde3))
* **ltp:** send loads collective as file ([a446b03](///commit/a446b03cbd5846112a4732387a116d773ead7763))
* **ltp:** use multipart/form-data for load case api request (UFTABI-3387) ([7a5f76d](///commit/7a5f76d89ddef1ba3e33ea70a5dd0a7bce6add67))
* **schaeffler-icon:** refactor the use of material icons (UFTABI-2279) ([9f19828](///commit/9f198288f7a07abd222a252adc12b38fd8b46335))
* **settings-sidebar:** split settings-sidebar into seperate publishable lib (UFTABI-2315) ([51e96a4](///commit/51e96a4bc78f1efff19aa1c6bee26e7d8150745b))
* **sidebar:** split sidebar into separate publishable lib (UFTABI-2310) ([94f2ba5](///commit/94f2ba5421d4d12af18cb0efe25fe52fbd6893c0))
* **sta:** error handling (UFTABI-1673) ([09d90a6](///commit/09d90a6e2b4333369f5ca2e4fc9abb872c25c7aa))
* **sta:** implement sidebar trigger (UFTABI-1540) ([1003285](///commit/1003285acd92cd777949b93d699da4ce07fa562b))
* **sta:** make sidebar expandable with autosize (UFTABI-1388) ([178552a](///commit/178552a1cadc614aed8840dd05fb367e60b5b47e))
* **styles:** make styles lib publishable (UFTABI-2916) ([245e355](///commit/245e355c6de4dafff18bdf03301074adb41669c3))
* **ui-components:** add ng-content to header (UFTABI-1977) ([2110440](///commit/211044004d305245433d53faff9b0f791f13eafe))
* **workspace:** create new-app schematic to automate project setup ([5fdedda](///commit/5fdeddabe3927d89263aaa96e51d766edd44ede7))
* **workspace:** enable custom changelogs for each project ([5e07b00](///commit/5e07b0064e287f9c8f5187b96617c9f685089052))
* **workspace:** fix remaining checkstyle issues (UFTABI-2475) ([85e60c6](///commit/85e60c64358058127774aec52f72082721e984d8))
* **workspace:** update to angular 11 ([2701a47](///commit/2701a47e42d4740cb0efd5671a1e3e5694d2f347))
* release v1 (UFTABI-2483) ([79c1ba7](///commit/79c1ba7c6c1af8ccd909083d91fffbe0ae017ebb))
* **workspace:** update ngrx to v9 ([d50a3d6](///commit/d50a3d6d684cde154a0c0057d55c8a34b1404ee1))

### [1.7.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.7.0...v1.7.1) (2020-10-12)

## [1.7.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.6.0...v1.7.0) (2020-09-28)


### 🎸 Features

* **ltp:** fix wrong legend entry ([01c6322](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/01c6322313e709aa8799db2c9233fdea9273221e))
* **ltp:** integrate non linear regression model (ADAPLD-6763) ([c0d5900](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/c0d5900ea3be0db3dc13ea79e1e7c27f7b87b306))

## [1.6.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.5.0...v1.6.0) (2020-09-11)


### 🎸 Features

* **deps:** update to angular v10.1 and typescript 4.0.2 ([edc0bb1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/edc0bb1d32af1b0b585de3f79bc96eaf393c240e))

## [1.5.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.4.0...v1.5.0) (2020-08-27)


### 🎸 Features

* **styles:** make styles lib publishable (UFTABI-2916) ([245e355](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/245e355c6de4dafff18bdf03301074adb41669c3))

### [1.3.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.3.0...v1.3.1) (2020-08-12)

## [1.3.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.2.0...v1.3.0) (2020-08-07)


### 🎸 Features

* **empty-states:** migrate lib to publishable lib (UFTABI-2635) ([977435f](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/977435f2481c68dcb842cbe3f3aaa93302e0175d))
* **ltp:** display hardness diversification in chart (ADAPLD-5838) ([593e9e2](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/593e9e29964098586d00bb0c4ee8dfc98f9b56ce))

## [1.2.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.1.0...v1.2.0) (2020-07-21)


### 🎸 Features

* **auth:** enable code flow (UFTABI-2237) ([d9b4ffa](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/d9b4ffa0452b69f4547db98f0698f8f9d8eabd91))

### [0.5.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v0.5.0...v0.5.1) (2020-07-01)


### 🐛 Bug Fixes

* **ltp:** adjust chart and legend colors, chart bugfix (ADAPLD-6714) ([b6f16d7](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/b6f16d7a0d7228bc94ab1da1b0f0a17ba8c92594))


### 🎸 Features

* **workspace:** fix remaining checkstyle issues (UFTABI-2475) ([85e60c6](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/85e60c64358058127774aec52f72082721e984d8))
* release v1 (UFTABI-2483) ([79c1ba7](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/79c1ba7c6c1af8ccd909083d91fffbe0ae017ebb))

## [1.0.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v0.5.0...v1.0.0) (2020-06-02)

**⚠ First official release that contains all previous releases ⚠**

## [0.4.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v0.3.0...v0.4.0) (2020-05-13)


### ⚠ BREAKING CHANGES

* **header:** Header, Responsive and Transloco are moved to new publishable libraries (@schaeffler/shared/ui-components --> `@schaeffler/header`; @schaeffler/shared/responsive --> `@schaeffler/responsive`; @schaeffler/shared/transloco--> `@schaeffler/transloco`)

### 🎸 Features

* **header:** split header into seperate publishable lib (UFTABI-2309) ([721ead8](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/721ead8681c9ce017e6ff939911dc31d449831f7))
* **sidebar:** split sidebar into separate publishable lib (UFTABI-2310) ([94f2ba5](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/94f2ba5421d4d12af18cb0efe25fe52fbd6893c0))
* **workspace:** enable custom changelogs for each project ([5e07b00](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/5e07b0064e287f9c8f5187b96617c9f685089052))
