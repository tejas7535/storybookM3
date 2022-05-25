 Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
**Note:** Dependency updates, refactored code & style/test/performance changes are not shown within this changelog. Thus, releases without any entries may occur.

### [3.2.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/hellworld-azure-v3.2.0...hellworld-azure-v3.2.1) (2022-05-25)


### 🐛 Bug Fixes

* **storybook:** ensure existence of grid utility classes ([ea8a9b4](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ea8a9b45832e3c6f31f9cf7d328fb7c25a9383ef))

## [3.2.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/hellworld-azure-v3.1.0...hellworld-azure-v3.2.0) (2022-03-31)


### 🎸 Features

* **helloworld:** extend root tailwind config ([e373951](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/e373951946094063ffa09909519f354261f7bb0c))


### 🐛 Bug Fixes

* **storybook:** widen tailwind content configuration to not break storybook ([05da849](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/05da849bd9fcc3fa10efb6946fdeb7d849500ad4))

## [3.1.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/hellworld-azure-v3.0.0...hellworld-azure-v3.1.0) (2022-02-09)


### 📈 Improvements

* **helloworld:** replace GitLab with GitHub link ([#3445](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3445)) ([0ce8f9a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/0ce8f9a846fc950fe5735a33623b20b790c16b5f))


### 🐛 Bug Fixes

* **hello-world:** fix html format issues ([5cd28e3](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/5cd28e3d182952ce6439f617900bcdc624d5773c))
* **workspace:** fix eslint configuration for local and ci execution ([#3598](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3598)) ([4a7dc1f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4a7dc1fe79d94b6d8ddfa7cf2644e3bbc11a3e80))


### 🎸 Features

* **app-shell:** extend app shell ([#3003](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3003)) ([781c13d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/781c13d61fac9aea94800e5e008cbfbd320de411))
* **helloworld-azure:** add proxy config for local development against multiple backends ([#2880](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2880)) ([d3b996c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/d3b996cc3e827547fcb81394dfb0e2759a3b8e3d))
* **helloworld-azure:** get rid of flex-layout dep ([#3590](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3590)) ([f33b184](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/f33b184b19ff34a5dec7d1b5258c8c4548ccfad7))
* load material icons from npm module ([0ba3a13](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/0ba3a138b9f07f56f2a4309a7b6954c45d7ead77))
* reduce css bundle sizes ([#3348](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3348)) ([#3377](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3377)) ([1978d74](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/1978d745d959d521f060f51e98ab85a2390612bf))
* **style:** add new color variables ([#3391](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3391)) ([072e93c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/072e93cc90858f751717e10e383f87ab2d4c61f6))
* **workspace:** individual project configurations instead of one global ([#3248](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3248)) ([ba451ef](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ba451ef87c9c9cff99440b9739c9ebf4069a16dc))
* **workspace:** update core dependencies ([#3381](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3381)) ([#3383](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3383)) ([3c7b0a3](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/3c7b0a37be3104fc216c3ee6506d5f8ce2cadb21))
* **workspace:** use eslint for sorting of imports ([#3424](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3424)) ([546e884](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/546e8845a9250580ccdc982e3f5c1d818f8678bd))

## [3.0.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/hellworld-azure-v3.0.0...hellworld-azure-v2.2.2) (2021-08-31)


### ⚠ BREAKING CHANGES

* **footer:** This lib now depends on tailwind. See `Readme` for more details.

* refactor(footer): move footer-tailwind implementation to footer

* refactor: use footer instead of footer tailwind

* refactor: remove footer tailwind entirely

* fix(footer): add missing logo

* chore: dont pass lint in case of errors

* test(footer): fix unit tests of footer

Co-authored-by: Fabian Kaupp <kauppfbi@schaeffler.com>

### 🎸 Features

* **footer:** reimplement footer based on tailwind (UFTABI-4632) ([#2700](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2700)) ([e54c88d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/e54c88d08e472f2915bc0ce1770eac5b4e9cca07))
* **helloworld:** integrate app-shell lib in helloworld ([dc1b06e](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/dc1b06e41576429c7278625d79eac3b8dc6e6134))

### [2.2.2](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/hellworld-azure-v2.2.2...hellworld-azure-v2.2.1) (2021-08-02)

### [2.2.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/hellworld-azure-v2.2.1...hellworld-azure-v2.2.0) (2021-08-02)


### 🏭 Automation

* **workspace:** adjust lint rules (UFTABI-4456) ([bcd52ff](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/bcd52ffddcf2011986085d510bc54488903a90dc))

## [2.2.0](///compare/hellworld-azure-v2.2.0...hellworld-azure-v2.1.0) (2021-04-22)


### 🎸 Features

* **helloworld:** add dotnet api to hello world greetings ([9b9dd55](///commit/9b9dd55afb2635db7fd3dcf65fe5cdd52180e3a5))
* **helloworld-azure:** add azure function greeting ([d60b428](///commit/d60b42836bcc940de1d9955338bc6e468c205c35))
* **helloworld-azure:** migrate to eslint ([d0d394a](///commit/d0d394a429cf10eafd34d5052d043000465f7fd9))
* **helloworld-azure:** migrate to tailwind (UFTABI-4019) ([50378ff](///commit/50378ff1d349d4526d4d39480ce8b1e4e35d56d9))
* **mac:** use azure-auth package (UFTABI-3958) ([b143e75](///commit/b143e755bd3693c96199ff9aafbd702d85f6c6b5))

## [2.1.0](///compare/hellworld-azure-v2.1.0...hellworld-azure-v2.0.1) (2021-03-10)


### 🐛 Bug Fixes

* **mm:** fix empty state styles ([de912f6](///commit/de912f6b2a70e7863c94c868fd9191e4fc958d7f))


### 🎸 Features

* **deps:** update to nx 11 and fix jest setup ([4df2df3](///commit/4df2df38f8a3fa29abae9b9f736e7d237344541b))
* **helloworld-azure:** use new azure auth (UFTABI-4029) ([846deb3](///commit/846deb3eb15078fb3eaa9aba74dcee23af157244))

### [2.0.1](///compare/hellworld-azure-v2.0.1...hellworld-azure-v2.0.0) (2020-11-30)

## 2.0.0 (2020-11-19)


### ⚠ BREAKING CHANGES

* **header:** Header, Responsive and Transloco are moved to new publishable libraries (@schaeffler/shared/ui-components --> `@schaeffler/header`; @schaeffler/shared/responsive --> `@schaeffler/responsive`; @schaeffler/shared/transloco--> `@schaeffler/transloco`)
* **sidebar:** SidebarComponent is splitted into two components, Input `mode` and Output `toggle` are removed

### 📈 Improvements

* **ui-components:** remove BrowserAnimationsModule ([14c5ad2](///commit/14c5ad2014529b3d6f4e1280572b179e6a6e212a))


### 🐛 Bug Fixes

* **helloworld-azure:** fix basePaths in environments ([cc5735b](///commit/cc5735bb1a7d40224d7179c67c8a44bae3cbf4df))
* **hw-azure:** add missing EffectsModule.forRoot ([d3ca951](///commit/d3ca951037e7676875cd018999a2a65d1daee3ad))


### 🎸 Features

* **auth:** enable code flow (UFTABI-2237) ([d9b4ffa](///commit/d9b4ffa0452b69f4547db98f0698f8f9d8eabd91))
* **auth:** make auth library publishable (UFTABI-2636) ([26833ff](///commit/26833ffdccd5dc448e99130de7fd240462721e02))
* **ci:** enable manual releases (UFTABI-2968) ([a7daa45](///commit/a7daa45700b798bae3340e87400c92288d4dd84b))
* **deps:** update to angular v10.1 and typescript 4.0.2 ([edc0bb1](///commit/edc0bb1d32af1b0b585de3f79bc96eaf393c240e))
* **empty-states:** migrate lib to publishable lib (UFTABI-2635) ([977435f](///commit/977435f2481c68dcb842cbe3f3aaa93302e0175d))
* **footer:** bottom sticky footer (UFTABI-2263) ([4eec24e](///commit/4eec24e73bc931bac85a311293420745048ad82a))
* **footer:** extract footer to its own lib (DSCDA-2311) ([3a3e8fb](///commit/3a3e8fb00f23a065dfe021de09205ec6d408b0b8))
* **header:** split header into seperate publishable lib (UFTABI-2309) ([721ead8](///commit/721ead8681c9ce017e6ff939911dc31d449831f7))
* **helloworld-adp:** integrate AAD oAuth2 (ADP-647) ([a6c8c33](///commit/a6c8c33b148124b5f09d0463bfd50f2ad5067f49))
* **helloworld-azure:** add ADP helloworld app (FRON-321) ([e642fba](///commit/e642fbabbf468a3547b8d9da90688eac88666dc6))
* **helloworld-azure:** support multiple REST endpoints ([0c61b41](///commit/0c61b41896141be9984e82593313618a4b328bfc))
* **sidebar:** handle sidebar state management internally (UFTABI-1889) ([f318bad](///commit/f318bad6889dcd2ae9876111877dc8f3b12093a8))
* **styles:** make styles lib publishable (UFTABI-2916) ([245e355](///commit/245e355c6de4dafff18bdf03301074adb41669c3))
* **ui-components:** add ng-content to header (UFTABI-1977) ([2110440](///commit/211044004d305245433d53faff9b0f791f13eafe))
* **workspace:** create new-app schematic to automate project setup ([5fdedda](///commit/5fdeddabe3927d89263aaa96e51d766edd44ede7))
* **workspace:** update to angular 11 ([2701a47](///commit/2701a47e42d4740cb0efd5671a1e3e5694d2f347))
* release v1 (UFTABI-2483) ([79c1ba7](///commit/79c1ba7c6c1af8ccd909083d91fffbe0ae017ebb))
* **workspace:** enable custom changelogs for each project ([5e07b00](///commit/5e07b0064e287f9c8f5187b96617c9f685089052))

### [1.7.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.7.0...v1.7.1) (2020-10-12)

### [1.6.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.6.0...v1.6.1) (2020-09-28)

## [1.6.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.5.0...v1.6.0) (2020-09-11)


### 🎸 Features

* **deps:** update to angular v10.1 and typescript 4.0.2 ([edc0bb1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/edc0bb1d32af1b0b585de3f79bc96eaf393c240e))

## [1.5.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.4.0...v1.5.0) (2020-08-27)


### 🎸 Features

* **styles:** make styles lib publishable (UFTABI-2916) ([245e355](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/245e355c6de4dafff18bdf03301074adb41669c3))

### [1.3.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.3.0...v1.3.1) (2020-08-12)

## [1.3.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.2.0...v1.3.0) (2020-08-07)


### 🐛 Bug Fixes

* **hw-azure:** add missing EffectsModule.forRoot ([d3ca951](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/d3ca951037e7676875cd018999a2a65d1daee3ad))


### 🎸 Features

* **auth:** make auth library publishable (UFTABI-2636) ([26833ff](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/26833ffdccd5dc448e99130de7fd240462721e02))
* **empty-states:** migrate lib to publishable lib (UFTABI-2635) ([977435f](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/977435f2481c68dcb842cbe3f3aaa93302e0175d))

## [1.2.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.1.0...v1.2.0) (2020-07-21)


### 🎸 Features

* **auth:** enable code flow (UFTABI-2237) ([d9b4ffa](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/d9b4ffa0452b69f4547db98f0698f8f9d8eabd91))

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
* **workspace:** enable custom changelogs for each project ([5e07b00](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/5e07b0064e287f9c8f5187b96617c9f685089052))
