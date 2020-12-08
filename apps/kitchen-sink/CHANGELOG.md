 Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
**Note:** Dependency updates, refactored code & style/test/performance changes are not shown within this changelog. Thus, releases without any entries may occur.

### [2.1.1](///compare/kitchen-sink-v2.1.1...kitchen-sink-v2.1.0) (2020-12-08)

## [2.1.0](///compare/kitchen-sink-v2.1.0...kitchen-sink-v2.0.0) (2020-12-03)


### 🎸 Features

* **footer:** use optional input parameter for footer version (UFTABI-3269) ([c5354e0](///commit/c5354e0f3ccdd4ed10ec0613b685f07b254b1997))

## 2.0.0 (2020-11-19)


### ⚠ BREAKING CHANGES

* **speed-dial-fab:** package changed from `@schaeffler/shared/ui-components` to `@schaeffler/speed-dial-fab`
* **banner:** Banner is now published in its own library, the import path is now `@schaeffler/banner`
* **header:** Header, Responsive and Transloco are moved to new publishable libraries (@schaeffler/shared/ui-components --> `@schaeffler/header`; @schaeffler/shared/responsive --> `@schaeffler/responsive`; @schaeffler/shared/transloco--> `@schaeffler/transloco`)
* **sidebar:** SidebarComponent is splitted into two components, Input `mode` and Output `toggle` are removed

### ✏️ Documentation

* **workspace:** update contribution guide and readme ([d0afb58](///commit/d0afb5853e6def67d8975b84462b250d7beba95d))


### 🏭 Automation

* **workspace:** add quality stage reports on Jenkins ([bb39c20](///commit/bb39c200d5340c0b7aa37cf72f0126ef9955b67c))
* **workspace:** support multiple build configurations (FRON-80) ([9b8a944](///commit/9b8a944400c0bc012cff1fa07b42d51778a162a8))
* enable e2e tests with cypress in ci-pipeline ([9c94cf1](///commit/9c94cf19962706a35eca7941bf4f8900dc4969de))


### 📈 Improvements

* **empty-states:** handle empty state translation inside the library (FRON-131) ([7a4eb3b](///commit/7a4eb3b4e2d4420ca0590a160e8ee15db1e9ce77))
* **ui-components:** improve banner styling (UFTABI-1887) ([07de06f](///commit/07de06f7aefc3d98b6a8814f8c77d9066bbc3459))
* **ui-components:** improve snackbar styling (FRON-141) ([5bd6c4d](///commit/5bd6c4d1e4ae9db253fad5fd27242a2126a0569b))
* **ui-components:** remove BrowserAnimationsModule ([14c5ad2](///commit/14c5ad2014529b3d6f4e1280572b179e6a6e212a))
* **workspace:** remove hammerjs (UFTABI-2167) ([d26c97d](///commit/d26c97d61141d55d330e34ace1f4de667cb300f1))
* apply transloco best practises (FRON-203) ([25cdbf9](///commit/25cdbf9f2adfea70de9e12ecdaceaf3bba3e2f1b))
* **ui-components:** replace media matcher ([05c1cdb](///commit/05c1cdb9ea377f417178c84cf57c22458f3f1a02))


### 🐛 Bug Fixes

* **icons:** add icon module imports (UFTABI-2329) ([dea9fb8](///commit/dea9fb8c1b3ad22b1850a23caff0e1cfaf54eb75))
* **workspace:** use gesture config from angular material ([edd56c2](///commit/edd56c2d6a87e7af84003ffb8e295a191d66e45e))


### 🎸 Features

* **assets:** add shared assets lib (FRON-122) ([0fe660a](///commit/0fe660a0d5b316c40b28b91706d29deb519b9268))
* **banner:** split banner into seperate publishable lib (UFTABI-2313) ([1cf9ecc](///commit/1cf9ecce8a2af98526795201b7e4c68adb04cf90))
* **ci:** enable manual releases (UFTABI-2968) ([a7daa45](///commit/a7daa45700b798bae3340e87400c92288d4dd84b))
* **ci:** use local dependencies (FRON-250) ([090d75d](///commit/090d75db02f490f6c8c5cf05ae341c947b0a87e3))
* **empty-states:** add library empty states (FRON-98) ([e6fbfd9](///commit/e6fbfd9b87954d1925ea5267e7e6e80fbd375b5f))
* **empty-states:** migrate lib to publishable lib (UFTABI-2635) ([977435f](///commit/977435f2481c68dcb842cbe3f3aaa93302e0175d))
* **footer:** bottom sticky footer (UFTABI-2263) ([4eec24e](///commit/4eec24e73bc931bac85a311293420745048ad82a))
* **footer:** extract footer to its own lib (DSCDA-2311) ([3a3e8fb](///commit/3a3e8fb00f23a065dfe021de09205ec6d408b0b8))
* **header:** split header into seperate publishable lib (UFTABI-2309) ([721ead8](///commit/721ead8681c9ce017e6ff939911dc31d449831f7))
* **ltp:** migration of LTP (FRON-235) ([c1a73b1](///commit/c1a73b18354f19b4e5036e7e7e241b0a5858703c))
* **schaeffler-icon:** refactor the use of material icons (UFTABI-2279) ([9f19828](///commit/9f198288f7a07abd222a252adc12b38fd8b46335))
* **scroll-to-top:** split scroll-to-top into seperate publishable lib (UFTABI-2314) ([9370cf7](///commit/9370cf7813a82599ec90837bc6171b557520728c))
* **settings-sidebar:** split settings-sidebar into seperate publishable lib (UFTABI-2315) ([51e96a4](///commit/51e96a4bc78f1efff19aa1c6bee26e7d8150745b))
* **sidebar:** handle sidebar state management internally (UFTABI-1889) ([f318bad](///commit/f318bad6889dcd2ae9876111877dc8f3b12093a8))
* **sidebar:** split sidebar into separate publishable lib (UFTABI-2310) ([94f2ba5](///commit/94f2ba5421d4d12af18cb0efe25fe52fbd6893c0))
* **snackbar:** split snackbar into separate publishable lib (UFTABI-2316) ([1d60a3e](///commit/1d60a3e1e7d14c162360e745b48b5c90983fae5f))
* **speed-dial-fab:** split speed-dial-fab into sepereate publishable library (UFTABI-2317) ([eb8fba1](///commit/eb8fba1cd4856dc3e6319368c694b2d3ac33cd26))
* **speed-dial-fab:** use view engine and prevent barrel exports (UFTABI-2739) ([95cf204](///commit/95cf204f4d7420cd366f7453da41a3c98946df59))
* **sta:** implement sidebar trigger (UFTABI-1540) ([1003285](///commit/1003285acd92cd777949b93d699da4ce07fa562b))
* **sta:** implement store for tagging (UFTABI-2162) ([90acaf8](///commit/90acaf8271f182dce86bdb829655d0b289246842))
* **sta:** make sidebar expandable with autosize (UFTABI-1388) ([178552a](///commit/178552a1cadc614aed8840dd05fb367e60b5b47e))
* **styles:** add shared-styles library (FRON-90) ([a3808aa](///commit/a3808aac7ab67bb9a0ab4037198016f572493cc7))
* **styles:** make styles lib publishable (UFTABI-2916) ([245e355](///commit/245e355c6de4dafff18bdf03301074adb41669c3))
* **ui-components:** add footer (FRON-96) ([57de4cf](///commit/57de4cf022d39c038c4ba3d0237f44ad8b5e1533))
* **ui-components:** add header (FRON-94) ([d60b38e](///commit/d60b38ebc1b28bfc4170b010ac104731e05e18bc))
* **ui-components:** add ng-content to header (UFTABI-1977) ([2110440](///commit/211044004d305245433d53faff9b0f791f13eafe))
* **ui-components:** add scroll to top button (FRON-92) ([5dceec8](///commit/5dceec83ced121fe8c678352d3a74092400cfce4))
* **ui-components:** add sidebar (FRON-95) ([02a9f40](///commit/02a9f400718985946a3970153c28defd028393fa))
* **ui-components:** add snackbar (FRON-99) ([6ca66a3](///commit/6ca66a32324928f44a32743cb1f6c55f98f77f4f))
* **ui-components:** added speed dial fab (FRON-144) ([e9c4bd9](///commit/e9c4bd908d6fe0d6b39d58b21de0672524237f19))
* **ui-components:** migrate banner component (FRON-93) ([f40843a](///commit/f40843a25fa471298b775beaaf133fafb4b4106f))
* **ui-components:** scaffold new library for ui-components (FRON-108) ([ed753f1](///commit/ed753f1d2a667080c30bdd5f4d6276c57e03281a))
* **ui-components:** support custom user menu and other entries in header (FRON-149) ([6bb7299](///commit/6bb7299d185440d544d60cb68d86cf0feb5f5e50))
* **workspace:** create new-app schematic to automate project setup ([5fdedda](///commit/5fdeddabe3927d89263aaa96e51d766edd44ede7))
* **workspace:** enable custom changelogs for each project ([5e07b00](///commit/5e07b0064e287f9c8f5187b96617c9f685089052))
* **workspace:** update ngrx to v9 ([d50a3d6](///commit/d50a3d6d684cde154a0c0057d55c8a34b1404ee1))
* **workspace:** update to angular 11 ([2701a47](///commit/2701a47e42d4740cb0efd5671a1e3e5694d2f347))
* create sample kitchen sink app ([5cbad88](///commit/5cbad88b311a1326b69cd3c2b851f5271173396f))
* release v1 (UFTABI-2483) ([79c1ba7](///commit/79c1ba7c6c1af8ccd909083d91fffbe0ae017ebb))

### [1.7.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.7.0...v1.7.1) (2020-10-12)

### [1.6.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.6.0...v1.6.1) (2020-09-28)

### [1.5.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.5.0...v1.5.1) (2020-09-11)

## [1.5.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.4.0...v1.5.0) (2020-08-27)


### 🎸 Features

* **speed-dial-fab:** use view engine and prevent barrel exports (UFTABI-2739) ([95cf204](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/95cf204f4d7420cd366f7453da41a3c98946df59))
* **styles:** make styles lib publishable (UFTABI-2916) ([245e355](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/245e355c6de4dafff18bdf03301074adb41669c3))

### [1.3.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.3.0...v1.3.1) (2020-08-12)

## [1.3.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.2.0...v1.3.0) (2020-08-07)


### 🎸 Features

* **empty-states:** migrate lib to publishable lib (UFTABI-2635) ([977435f](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/977435f2481c68dcb842cbe3f3aaa93302e0175d))

### [1.1.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.1.0...v1.1.1) (2020-07-21)

### [0.5.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v0.5.0...v0.5.1) (2020-07-01)


### 🎸 Features

* release v1 (UFTABI-2483) ([79c1ba7](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/79c1ba7c6c1af8ccd909083d91fffbe0ae017ebb))

## [1.0.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v0.5.0...v1.0.0) (2020-06-02)

**⚠ First official release that contains all previous releases ⚠**

## [0.4.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v0.3.0...v0.4.0) (2020-05-13)


### ⚠ BREAKING CHANGES

* **header:** Header, Responsive and Transloco are moved to new publishable libraries (@schaeffler/shared/ui-components --> `@schaeffler/header`; @schaeffler/shared/responsive --> `@schaeffler/responsive`; @schaeffler/shared/transloco--> `@schaeffler/transloco`)

### 🎸 Features

* **footer:** bottom sticky footer (UFTABI-2263) ([4eec24e](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/4eec24e73bc931bac85a311293420745048ad82a))
* **footer:** extract footer to its own lib (DSCDA-2311) ([3a3e8fb](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/3a3e8fb00f23a065dfe021de09205ec6d408b0b8))
* **header:** split header into seperate publishable lib (UFTABI-2309) ([721ead8](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/721ead8681c9ce017e6ff939911dc31d449831f7))
* **sidebar:** split sidebar into separate publishable lib (UFTABI-2310) ([94f2ba5](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/94f2ba5421d4d12af18cb0efe25fe52fbd6893c0))
* **workspace:** enable custom changelogs for each project ([5e07b00](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/5e07b0064e287f9c8f5187b96617c9f685089052))
