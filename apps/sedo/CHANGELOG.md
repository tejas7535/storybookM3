 Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
**Note:** Dependency updates, refactored code & style/test/performance changes are not shown within this changelog. Thus, releases without any entries may occur.

## [1.15.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/sedo-v1.14.0...sedo-v1.15.0) (2022-11-14)


### 🎸 Features

* load material icons from npm module ([0ba3a13](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/0ba3a138b9f07f56f2a4309a7b6954c45d7ead77))
* **sedo:** extend root tailwind config ([4198c2d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4198c2d6fb787f586da732d7d78b0849e75ca63b))
* **sedo:** remove deprecated styles ([#4480](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4480)) ([c1796ca](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/c1796ca804809ab1cbb2ff6a611d95eeeb03a774))
* **sedo:** remove flex-layout and legacy snackbar ([7b454ee](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/7b454ee08c22ab473e84212900b8fcc00a2cafa1))
* **shared-ui:** remove deprecated libs in favour of npm packages ([#3520](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3520)) ([a2bf36b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/a2bf36bf950ba4d8bd1d27ed9754565f9e364b90))
* **style:** add new color variables ([#3391](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3391)) ([072e93c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/072e93cc90858f751717e10e383f87ab2d4c61f6))
* **styles:** add tailwind to styles lib ([#3573](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3573)) ([#4104](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4104)) ([d32b170](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/d32b170c13de73f90b3a792d9f50f29cede37898)), closes [#3753](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3753)
* **workspace:** update core dependencies ([#3381](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3381)) ([#3383](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3383)) ([3c7b0a3](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/3c7b0a37be3104fc216c3ee6506d5f8ce2cadb21))
* **workspace:** upgrade to ag-grid v28 ([#4427](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4427)) ([2c7c976](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/2c7c97600c0646e238ce646f5e2adcc9d668b41c))
* **workspace:** use eslint for sorting of imports ([#3424](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3424)) ([546e884](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/546e8845a9250580ccdc982e3f5c1d818f8678bd))


### 🐛 Bug Fixes

* **azure-auth:** wait for login to complete before getting roles ([#3855](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3855)) ([d9e5470](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/d9e5470eb2f9e0638fd0f28abc0bfcfc4ed41c98))
* **sedo:** fix html format issues ([37c58d6](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/37c58d64fd9fa9d5a74fd84450304eb0038a3d41))
* **sedo:** fix unit tests ([9be66d1](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/9be66d191e0091b772b323a2853257854e3e3947))
* **sedo:** properly configure tailwind content configuration ([4d60748](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4d607480deadf3e6d7d26334f9431a52f4d6bb02))
* **sedo:** update SharedTranslocoModule import to fix issues with language persisting ([a52a0af](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/a52a0af625b5087d9131dbb9abc7a17c64136757))
* **workspace:** fix eslint configuration for local and ci execution ([#3598](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3598)) ([4a7dc1f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4a7dc1fe79d94b6d8ddfa7cf2644e3bbc11a3e80))
* **workspace:** fix fake timers in tests after version bump ([2a33b62](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/2a33b629a73bf6f7a9ab2b78391d0edf39af516e))
* **workspace:** fix prettier formatting ([#4746](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4746)) ([6d09958](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/6d099587562a9db04e311acb309235bc60e89ee4))

## [1.14.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/sedo-v1.13.0...sedo-v1.14.0) (2021-12-06)


### 🎸 Features

* reduce css bundle sizes ([#3348](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3348)) ([#3377](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3377)) ([1978d74](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/1978d745d959d521f060f51e98ab85a2390612bf))
* **sedo:** migrate to app shell ([#3138](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3138)) ([6f25d3d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/6f25d3de42484ab5d4fefe9ef26ab4f62264306d))
* **sedo:** store layout in localstorage ([#3267](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3267)) ([8ffdaa5](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8ffdaa5701567d19ddc00181a54459ed6512ce60))
* **workspace:** individual project configurations instead of one global ([#3248](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3248)) ([ba451ef](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ba451ef87c9c9cff99440b9739c9ebf4069a16dc))

## [1.13.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/sedo-v1.13.0...sedo-v1.12.0) (2021-09-08)


### 🎸 Features

* **header:** reimplement header with tailwindr ([#2712](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2712)) ([8b9b0bb](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8b9b0bb36137d5d2518754a74292afe269f12cc7))
* **sedo:** add ignore flag input (UFTABI-4980) ([#2834](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2834)) ([2804a45](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/2804a451098612a9235207ed4f693c78c2b39781))
* **sedo:** disallow edo before eop ([#2806](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2806)) ([24ff20f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/24ff20f3ca60935c687e5bd7b8fa67b6d2279cb9))
* **sedo:** fix lint rules (UFTABI-4830) ([d9b45af](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/d9b45afe976277d45e718ca2e13a39282bcadcf1))


### 🐛 Bug Fixes

* **sedo:** fix date column filter ([#2861](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2861)) ([cf19cf1](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/cf19cf1149b0863be30a3d34a25515dd8cc50bbd))
* **workspace:** disable caching for index.html and configure outputHashing (GQUOTE-685) (DSCDA-2362) ([#2727](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2727)) ([5400d16](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/5400d16ed0f1cab1caf7c3760724148ff996922f))

## [1.12.0](///compare/sedo-v1.12.0...sedo-v1.11.1) (2021-07-12)


### 🎸 Features

* **sedo:** activate strictTemplates ([3ec4710](///commit/3ec471045013ab373bbc634e88f5e68ab6c78673))
* **sedo:** improve user input feedback ([b4dbaae](///commit/b4dbaae92d6d19842eb296f4344d651b3ea7f110))

### [1.11.1](///compare/sedo-v1.11.1...sedo-v1.11.0) (2021-06-02)


### 🐛 Bug Fixes

* **sedo:** adjust prod appId ([3c1f8a7](///commit/3c1f8a72a6ea816531c0639e345a585394d691bb))

## [1.11.0](///compare/sedo-v1.11.0...sedo-v1.10.0) (2021-06-01)


### 🏭 Automation

* **workspace:** adjust lint rules (UFTABI-4456) ([bcd52ff](///commit/bcd52ffddcf2011986085d510bc54488903a90dc))


### 🎸 Features

* **sedo:** adapt column filters (UFTABI-4278) ([55ddb2d](///commit/55ddb2d4e5e761ede2b4b410e26a779fe8f37d60))
* **sedo:** add application insight (UFTABI-4598) ([1c89f87](///commit/1c89f872365678955ba290879ece3b89439d4a8e))
* **sedo:** add info icon ([1a0594d](///commit/1a0594d6fd37532bf4d9435213796d2c8c11f2b9))
* **sedo:** add net sales category column (UFTABI-4429) ([00d0182](///commit/00d018264d5d69f2622b8096d706222f2d920d0d))
* **sedo:** display plant names and keys (UFTABI-4428) ([4d33150](///commit/4d3315075e2028f5938f3606a3be11a661ae03f4))
* **sedo:** remove hash routing ([058585a](///commit/058585a8132a1649eee6e2f23d1c6874964b7c75))
* **sedo:** show timout warning icon (UFTABI-3033) ([087b6fc](///commit/087b6fc5d1629ed8432f7dd276bd7824bf76b30d))

## [1.10.0](///compare/sedo-v1.10.0...sedo-v1.9.0) (2020-12-14)


### 📈 Improvements

* **workspace:** show border for tool panel in ag grid ([ce08056](///commit/ce08056cdd9b26519d4b90e4f10568d4a5385b87))


### 🎸 Features

* **deps:** update to nx 11 and fix jest setup ([4df2df3](///commit/4df2df38f8a3fa29abae9b9f736e7d237344541b))
* **sedo:** format dates in sales table ([00a08eb](///commit/00a08ebac645f878544b84038f1085a62003720d))

## 1.9.0 (2020-11-23)


### 🎸 Features

* **auth:** make auth library publishable (UFTABI-2636) ([26833ff](///commit/26833ffdccd5dc448e99130de7fd240462721e02))
* **ci:** enable manual releases (UFTABI-2968) ([a7daa45](///commit/a7daa45700b798bae3340e87400c92288d4dd84b))
* **empty-states:** migrate lib to publishable lib (UFTABI-2635) ([977435f](///commit/977435f2481c68dcb842cbe3f3aaa93302e0175d))
* **sedo:** add authentication for sedo (UFTABI-2608) ([1636105](///commit/163610568944417b4150132600c9082e5a25bb00))
* **sedo:** add configurable table columns (UFTABI-3042) ([4e9f0b0](///commit/4e9f0b00d21fa6697fa4bd296e9c2b7e1e62c983))
* **sedo:** add expandable details  (UFTABI-2626) ([414e52a](///commit/414e52a4a3e1bc9cff3bc71aad308be1e185aa4e))
* **sedo:** added datasource to table (UFTABI-3034) ([1db86e6](///commit/1db86e6224666d87bb13356322d16f0bd93fe8ef))
* **sedo:** basic sales summary view (UFTABI-3036) ([2b2d688](///commit/2b2d688ed730616ab76b1552135139a432958279))
* **sedo:** create sedo app (UFTABI-2542) ([5dd7b41](///commit/5dd7b41a859fb0dacf0ffd85c0767b74fc77ce36))
* **sta:** use shared auth library (UFTABI-2265) ([3eb7c69](///commit/3eb7c69b3c6aec1b05766205d06f87ce4c821d7a))
* **styles:** make styles lib publishable (UFTABI-2916) ([245e355](///commit/245e355c6de4dafff18bdf03301074adb41669c3))
* **workspace:** update to angular 11 ([2701a47](///commit/2701a47e42d4740cb0efd5671a1e3e5694d2f347))


### 🐛 Bug Fixes

* **sedo:** fix bug in ag grid expanded row ([653911c](///commit/653911c7529fd9c8889e17fae79feb0e31f94323))
* **sedo:** fix unit tests jenkins error ([eacd0e1](///commit/eacd0e1c0845dc903031ec0f9a1fc608fdfe7cdf))

## [1.9.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.8.0...v1.9.0) (2020-10-26)


### 🎸 Features

* **sedo:** add configurable table columns (UFTABI-3042) ([4e9f0b0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/4e9f0b00d21fa6697fa4bd296e9c2b7e1e62c983))
* **sedo:** added datasource to table (UFTABI-3034) ([1db86e6](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/1db86e6224666d87bb13356322d16f0bd93fe8ef))

## [1.8.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.7.0...v1.8.0) (2020-10-12)


### 🎸 Features

* **sedo:** basic sales summary view (UFTABI-3036) ([2b2d688](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/2b2d688ed730616ab76b1552135139a432958279))

### [1.6.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.6.0...v1.6.1) (2020-09-28)

### [1.5.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.5.0...v1.5.1) (2020-09-11)

## [1.5.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.4.0...v1.5.0) (2020-08-27)


### 🎸 Features

* **styles:** make styles lib publishable (UFTABI-2916) ([245e355](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/245e355c6de4dafff18bdf03301074adb41669c3))

### [1.3.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.3.0...v1.3.1) (2020-08-12)

## [1.3.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.2.0...v1.3.0) (2020-08-07)


### 🎸 Features

* **auth:** make auth library publishable (UFTABI-2636) ([26833ff](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/26833ffdccd5dc448e99130de7fd240462721e02))
* **empty-states:** migrate lib to publishable lib (UFTABI-2635) ([977435f](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/977435f2481c68dcb842cbe3f3aaa93302e0175d))
* **sta:** use shared auth library (UFTABI-2265) ([3eb7c69](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/3eb7c69b3c6aec1b05766205d06f87ce4c821d7a))

## [1.2.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.1.0...v1.2.0) (2020-07-21)


### 🎸 Features

* **sedo:** add authentication for sedo (UFTABI-2608) ([1636105](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/163610568944417b4150132600c9082e5a25bb00))
* **sedo:** create sedo app (UFTABI-2542) ([5dd7b41](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/5dd7b41a859fb0dacf0ffd85c0767b74fc77ce36))
