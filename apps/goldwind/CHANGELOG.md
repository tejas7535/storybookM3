 Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
**Note:** Dependency updates, refactored code & style/test/performance changes are not shown within this changelog. Thus, releases without any entries may occur.

### [0.2.2](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/goldwind-v0.2.2...goldwind-v0.2.1) (2021-10-25)


### 🎸 Features

* **goldwind:** add new load distribution tile & prepare demo ([#3162](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3162)) ([51dfdfa](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/51dfdfa877d829ca0bf0cd49e4c657c4f64a239f))

### [0.2.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/goldwind-v0.2.1...goldwind-v0.2.0) (2021-10-21)


### 🐛 Bug Fixes

* **goldwind:** change unit from N to kN ([#3199](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3199)) ([4095ba3](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4095ba388c7bab9b704890034471db752de50266))
* **goldwind:** edm display dynamic clazz data ([#3179](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3179)) ([fc1e94a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/fc1e94a760baa0fb0d215202fb46f46b46054d49))
* **goldwind:** force set height for 1080p display, not nice i know ([#3180](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3180)) ([9a8f647](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/9a8f6474aa16191f85fdd37253467837c2ec7818))
* **goldwind:** remove unit for edm lines ([#3200](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3200)) ([8b12a16](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8b12a167412e3e6b0e6e95e6e0d37d94fd64b04f))

## [0.2.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/goldwind-v0.2.0...goldwind-v0.1.0) (2021-10-19)


### 🐛 Bug Fixes

* **goldwind:** fix date range error and make millenium proof ([#3151](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3151)) ([4272dce](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4272dcebb56759d6fe7d67c1f592151ab25d5482))


### 🎸 Features

* **goldwind:** add custom http interceptor for linking to custom mailto link ([#3166](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3166)) ([c48df8f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/c48df8f7730923c86870b181fbfcf15a096e394d))
* **goldwind:** add local environment + mock server ([#3094](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3094)) ([de9afec](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/de9afecbb996a250cf2fa4e14025d7409976c0ec))
* **goldwind:** add missing polling for edm histogram ([#3163](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3163)) ([be544fa](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/be544faaf4bf64866136a2286a2d766ed9ad7943))
* **goldwind:** adjust dashboard updateinterval times ([#3165](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3165)) ([c3791f0](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/c3791f040c372c47981439398d96ff3f0cfc5d2b))

## [0.1.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/goldwind-v0.1.0...goldwind-v0.0.1) (2021-10-11)


### 🎸 Features

* **goldwind:** add some more colors to the controls ([#3107](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3107)) ([83bd084](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/83bd0849607d0ab97f2a21a133b9b5277dc61af0))


### 🐛 Bug Fixes

* **goldwind:** display 0 values probably ([#3111](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3111)) ([4658484](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/46584849a7bb32b747851ba498ae3734f893bd12))
* **goldwind:** edm now display current device ([#3110](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3110)) ([7cc31b2](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/7cc31b294f127e14efcad95d828238ddb0e53e06))
* **goldwind:** set min and max values for axis on line charts ([#3106](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3106)) ([83b04a1](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/83b04a1532acea59b9aab906036c805d80711a37))

### [0.0.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/goldwind-v0.0.1...goldwind-v1.12.1) (2021-10-08)


### ⚠ BREAKING CHANGES

* **footer:** This lib now depends on tailwind. See `Readme` for more details.

* refactor(footer): move footer-tailwind implementation to footer

* refactor: use footer instead of footer tailwind

* refactor: remove footer tailwind entirely

* fix(footer): add missing logo

* chore: dont pass lint in case of errors

* test(footer): fix unit tests of footer

Co-authored-by: Fabian Kaupp <kauppfbi@schaeffler.com>

### 🏭 Automation

* **workspace:** adjust lint rules (UFTABI-4456) ([bcd52ff](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/bcd52ffddcf2011986085d510bc54488903a90dc))


### 🎸 Features

* **footer:** reimplement footer based on tailwind (UFTABI-4632) ([#2700](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2700)) ([e54c88d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/e54c88d08e472f2915bc0ce1770eac5b4e9cca07))
* **goldwind:** add center loads ([2eed666](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/2eed666d190f25573b7b84207e2a94c63ac2e5d4))
* **goldwind:** add china bureaucracy metadata to footer (DIGDTGW-2613) ([#2832](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2832)) ([e755a64](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/e755a641fd739e3baeb8b3def3ddd395fff7995a))
* **goldwind:** add contact mail link to footer ([#2991](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2991)) ([fbaf062](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/fbaf062c5795f7ee19bac672908ed9c366659fd7))
* **goldwind:** add custom tooltip for heatmap (DIGDTGW-2694) ([#2716](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2716)) ([a361255](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/a361255c232ea253be337a511cd31caa04ac17f8))
* **goldwind:** add edm histogram to dashboard ([#3018](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3018)) ([ccb323c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ccb323c99fdfd8959f6619b34f879e6f02020ee0))
* **goldwind:** add edm values to maintenance view ([#2830](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2830)) ([88e4045](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/88e4045193a2bbdf3ad8d4481aac92027347662f))
* **goldwind:** add firt implementation of the static safety factor ([e97cdac](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/e97cdac06eb37ccb363a7d2642cb8630c24b6ede))
* **goldwind:** add heatmap api to echarts series converter class (DIGDTGW-2690) ([#2714](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2714)) ([9fb9dd2](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/9fb9dd2857404237a393e2c02d18d4d4907931c3))
* **goldwind:** add live heatmap api (DIGDTGW-2689) ([#2721](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2721)) ([cd34aee](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/cd34aee7dba1b43c0b9f79f5b673a54049dafbaa))
* **goldwind:** add lss to sensors in detailed analysis (DIGDTGW-2312) ([7b7cd9c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/7b7cd9cb5f4e82b0287ad484aae4677012e19c51))
* **goldwind:** add RSM to Maintenance View (DIGDTGW-2748) ([#2843](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2843)) ([2d71195](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/2d71195f766fb99e8736456458aebf2e1eba9fec))
* **goldwind:** add store and component stub for grease heatmap (DIGDTGW-2545) ([#2704](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2704)) ([0b4d166](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/0b4d166d813e7d970b6b1a773a43b1f0c3e70e3f))
* **goldwind:** add strict template check (UFTABI-4626) ([daca21e](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/daca21ed0bc2a78f04c3611f36d7d7ac98354b24))
* **goldwind:** adjust to api refactor (DIGDTGW-2233) ([4cf1e3a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4cf1e3aa70ffc5173b8fbbb927d5950e56fc0286))
* **goldwind:** apply new gauge design ([805150d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/805150d989493d4419a85c7f088d180a7e929899))
* **goldwind:** apply new gauge design ([ccdb6f9](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ccdb6f9926588139289acef4dacbd736d913c319))
* **goldwind:** checkbox tree in detailed analysis (DIGDTGW-2247) ([0404ab2](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/0404ab25690b013444cd445adde513796ebbea1a))
* **goldwind:** colorized checkboxes according to linechart color ([#3035](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3035)) ([b125c8a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/b125c8adec4f3eb69847efc21661880fb6318125))
* **goldwind:** fix lint errors (UFTABI-4836) ([09b09c7](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/09b09c707673b8f6283b71a7ab882c2a1a33ee02))
* **goldwind:** hide edm on dashboard, disabled download page while WIP ([#2944](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2944)) ([d754deb](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/d754deb83f52fb2bd7fe7cf600c5926bfd7bd97a))
* **goldwind:** implement legal pages in dumb components ([#2970](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2970)) ([1bd5414](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/1bd5414be2437922e48038816d97e906d689e143))
* **goldwind:** migrate to shared subheader ([#3012](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3012)) ([712ace9](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/712ace9c7d6407c5e68c21ac7045708ad2cfd58b))
* **goldwind:** split LoadAssessment into 2 pages ([#2658](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2658)) ([51cb7bc](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/51cb7bc21a2119800db5596fe263aec15c78cb88))
* **goldwind:** switch to labels in rows on linechart, fix heatmap styling ([#2961](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2961)) ([1483276](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/1483276471f3c13a57a1353e12da0600b45da5e8))
* **goldwind:** switch to tailwind grid ([#2996](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2996)) ([d4bb51a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/d4bb51a6618bee944e04f6a77e208a7484db5c6a))
* **shared-utils-auth:** removed deprecated lib (UFTABI-4533) ([8fde1d4](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8fde1d4e6cbd89d68506aee28449e95767f3402f))
* **styles:** tab styles depend on tailwind ([06e54fb](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/06e54fb3154322e873f671af3f886a5e054d1a94))
* **transloco:** update transloco testing module (UFTABI-4323) ([47630c6](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/47630c62ca451d70e613182684fc34506a34705a))
* **workspace:** fix accessibility and numerical separator issues (UFTABI-4728) ([699fb97](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/699fb97a63a9069d847dfa489386da561028e5ea))


### 🐛 Bug Fixes

* **goldwind:** adjust layout to use correct mat-card structure ([#2999](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2999)) ([7547967](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/75479674c44f72829f870d911bb1356e4bf75937))
* **goldwind:** adjust property name to new backend response (DIGDTGW-2774) ([#2888](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2888)) ([98d32af](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/98d32afcb9057a9f44f6ad7523000166ad8636c3))
* **goldwind:** adjust switch case to string comparison ([#2992](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2992)) ([5e0ff08](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/5e0ff08bcf89d8993610f59f4a77160669534f2a))
* **goldwind:** disabled edm preview overlay ([#3098](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3098)) ([a1816ba](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/a1816baa8ba909a85798ecb9408625731ce01d82))
* **goldwind:** fix call params for bearing load / electricdischarge (DIGDTGW-2677) ([#2695](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2695)) ([399d217](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/399d217c2c2d036fadef4f1b3ec750eb7a505911))
* **goldwind:** fix load of assessment line chart ([#2990](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2990)) ([18b6213](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/18b621319d135186b3ebb7ffdd5a936eaeefc76e))
* **goldwind:** icon coloring, add i18n key, responsivness in meta footer ([#2929](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2929)) ([a9cee2b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/a9cee2b990a3f0f8b33d54104f2fd3426ec63987))
* **goldwind:** improvement of responsiveness, reliability and usability  ([#2862](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2862)) ([d6e0093](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/d6e00938c78c5830e7ccae6b32f193ae12a897cd))
* **goldwind:** remove shaft mock value (DIGDTGW-2676) ([#2693](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2693)) ([63e5d03](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/63e5d032dfe40c5bffa3ebcf8ee38e953eb261d1))
* **goldwind:** several issues with styling and usability ([#2946](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2946)) ([afd5213](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/afd5213ac62c72c1726dc1062ac68bba8e1af593))
* **goldwind:** switch to correct title for maintenance run chart ([#2822](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2822)) ([fb4c477](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/fb4c4777c8a925af5f63a0b9521f5195322a7abf))
* **workspace:** disable caching for index.html and configure outputHashing (GQUOTE-685) (DSCDA-2362) ([#2727](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2727)) ([5400d16](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/5400d16ed0f1cab1caf7c3760724148ff996922f))
* **workspace:** style button and font regressions cleanup ([#3015](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3015)) ([85f704c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/85f704c9d644da7e3f30b5d6c90a91b42a5226e1))

### [1.12.1](///compare/goldwind-v1.12.1...goldwind-v1.12.0) (2021-04-23)

## [1.12.0](///compare/goldwind-v1.12.0...goldwind-v1.11.1) (2021-04-22)


### 📈 Improvements

* **goldwind:** migrate to azure auth lib ([9e7823d](///commit/9e7823d74a427d01bad5fab1944a97fda893ba31))


### 🎸 Features

* **goldwind:** add icons (DIGDTGW-631) ([d810332](///commit/d81033234bf8b596fe79b2cb1ba95cf82fbc7adf))
* **goldwind:** add legal pages (DIGDTGW-2152) ([e8d0ed8](///commit/e8d0ed8ee4d370e1e27877e47ca4a8660be72f61))
* **goldwind:** added grease sensor 2 data ([a3f7cec](///commit/a3f7cec36df5045890038d7d1a107f20fc59e1be))
* **goldwind:** adjust to use polar chart for load sense (DIGDTGW-2169) ([c3c39dd](///commit/c3c39dddc425515b8da9905efc3e2448dc0892e3))
* **goldwind:** disable hash routing strategy (UFTABI-4331) ([572d4fa](///commit/572d4fa56ebdb0f0eade7b7703463ece59741e53))
* **goldwind:** fix selection of series in grease analysis ([58d0c8f](///commit/58d0c8f2b5e7a8e05c5355ab79c54315b8d72ebd))
* **goldwind:** highlight selected dashboard tile ([11cd71c](///commit/11cd71c6e643ad028047a8c0fad69dda367f144c))
* **goldwind:** implement new meta data tile on dashboard ([89a64c7](///commit/89a64c72861669ee302dd3cfae789f84b7f29c78))
* **goldwind:** reduce metadata requests ([b0e1b80](///commit/b0e1b80934b3f8d8f6ac7bb2e76688d13a0dec37))
* **goldwind:** refactor connection state in status indicator ([a85375b](///commit/a85375bedd12969ddfd3e831224a9206e849bdca))
* **goldwind:** remove overall status from overview. Fix connection icon ([a57e434](///commit/a57e434b8bf95637a9becff1f50adb65696f6b6d))
* **goldwind:** remove slider and update bearing load data on dashboard (DIGDTGW-1969) ([1233ab8](///commit/1233ab8e76b6ae4a822d660973869c95bc8e2184))
* **goldwind:** remove tab for bearing load assesment ([e52abb1](///commit/e52abb1e2de77ca6b31662e6e969f7cfb93efa9f))
* **goldwind:** remove unused route path ([77443d8](///commit/77443d80a69939de1ccdc61c5b5de38dbe8023f0))
* **goldwind:** rename api calls after api update ([cc7aeb6](///commit/cc7aeb66d685689341e0a9785664e230b767d320))
* **goldwind:** show average loads in detailed analysis (DIGDTGW-2053) ([e8361e7](///commit/e8361e72854655cbb0cd9a008b78d4f4f0e69f82))
* **goldwind:** show loading state in dashboard tiles (DIGDTGW-2059) ([e2b4f0c](///commit/e2b4f0c706fcc88fbbaf524de8e0a4738e87a4d0))
* **goldwind:** Show metadata on dashboard (DIGDTGW-1944) ([0f19fc0](///commit/0f19fc0c7cf1808eb5a02fd1c667e2f7d3b449e7))
* **goldwind:** update gcm detail page on api update ([169ae7b](///commit/169ae7b92abfcdee942a3e004f35ec2623492e90))
* **helloworld-azure:** migrate to eslint ([d0d394a](///commit/d0d394a429cf10eafd34d5052d043000465f7fd9))
* **workspace:** add eslint config (UFTABI-3762) ([4d3b417](///commit/4d3b417a7a01b99d3c211203414c2bc80540a783))


### 🐛 Bug Fixes

* **goldwind:** change url back for old api structure ([c1a46fc](///commit/c1a46fcee08e4b0c8d42761aaf541a9650a16dca))
* **goldwind:** rsm line not shown in detailed analysis (DIGDTGW-2150) ([9e3347b](///commit/9e3347b6d5a0af0a516286908d4331a25240d20a))
* **mm:** fix empty state styles ([de912f6](///commit/de912f6b2a70e7863c94c868fd9191e4fc958d7f))

### [1.11.1](///compare/goldwind-v1.11.1...goldwind-v1.11.0) (2021-02-25)

## [1.11.0](///compare/goldwind-v1.11.0...goldwind-v1.10.0) (2021-02-23)


### 🎸 Features

* **goldwind:** add formatted time stamp to shaft and grease status (DIGDTGW-1773) ([98dbf26](///commit/98dbf26acf5c9bfe6fb1bf2b6d1e437878e0b077))
* **goldwind:** added http interceptor for showing api error calls ([eee96af](///commit/eee96af10ab927d31e7065c3d94b6350e47e2ad9))
* **goldwind:** adjust to recent api and db changes (DIGDTGW-1575) ([c2903ce](///commit/c2903cedc5f1701c7bb3a28da7f4f3e202ac8940))
* **goldwind:** continously refresh grease data (DIGDTGW-1525) ([1fd0cb4](///commit/1fd0cb4160d61e257fad15c019d3f862ee63d16a))
* **goldwind:** remove const routing (DIGDTGW-1866) ([f5b0fa2](///commit/f5b0fa2607f681331714f088cb6727d4dbeca075))
* **workspace:** improve extension, docu, echarts bundle ([7d1bce4](///commit/7d1bce4080a052fe7d88d4ee4e6536f4c25c48da))


### 📈 Improvements

* **goldwind:** sort devices by status and name ([7cd32b0](///commit/7cd32b08cf95f0b8d233f5bfe3a39047e255b17a))


### 🐛 Bug Fixes

* **goldwind:** fix grease status sensor toggle ([b381f78](///commit/b381f78fdb4a0be5ba25e53b90f272c41635d2f9))
* **goldwind:** fix lint ([60677f3](///commit/60677f3cdb322604f342786a786d710414e5915c))
* **goldwind:** fix lint ([65972d9](///commit/65972d96cf56a8e5f172928e0bab551b61085fa2))
* **goldwind:** fix multiplication 100 in grease status for content and deterioration not necessary ([052d807](///commit/052d8078b3a7f3ee4e10ca0d8f0d88359a16c96c))
* **goldwind:** fix review issues ([a6dd2c3](///commit/a6dd2c394e5a524b599de479aeba2fc972dff884))
* **goldwind:** fix shaft speed in gauge (not shaft counter value) ([ebf1a38](///commit/ebf1a38936c8ab2229a2f56161d917ade0a37188))
* **goldwind:** fix unit tests ([ca51b76](///commit/ca51b765002f40af57887b09faf8f4015dfc6e5a))
* **goldwind:** fixed date format for ui in center load component ([ac93377](///commit/ac93377da4c2416a78e04a4c85557e5cd2538159))
* **goldwind:** load sense graph switch to radar echart ([15da056](///commit/15da056339e4787c5926c893474c7fb3cb06419d))
* **goldwind:** mock devicelist ([2edad30](///commit/2edad308f5a14d513d058a96b66bda2d94b56cf5))

## [1.10.0](///compare/goldwind-v1.10.0...goldwind-v1.9.0) (2020-12-15)


### 📈 Improvements

* **workspace:** adjust header and tabbar shadows (DSCDA-2064) ([7c0a35f](///commit/7c0a35f0d93ba631cfe4c8dfa2515964b4f9f621))


### 🐛 Bug Fixes

* **goldwind:** fix minor ui imperfections (DIGDTGW-1422) ([a31fc43](///commit/a31fc43fb8a52319aaaa3f6e41ae8335c2176663))


### 🎸 Features

* **deps:** update to nx 11 and fix jest setup ([4df2df3](///commit/4df2df38f8a3fa29abae9b9f736e7d237344541b))
* **goldwind:** add shaft api response to store (DIGDTGW-724) ([a659caa](///commit/a659caa41a2fee13d3ecfb6a79d70c3878230225))
* **goldwind:** add shaft rotation gauge (DIGDTGW-1352) ([cbd7c7f](///commit/cbd7c7f27f8a21d81f0aa3312b0b9bae797565db))
* **goldwind:** adjust fixed device id and add mocked device ([4447006](///commit/44470068800b4fe08ef0c0d8f2824545f0ab6487))
* **goldwind:** adjust ui to updated screendesign (DIGDTGW-1307) ([03cd9d2](///commit/03cd9d2a9e771b651b3a3dcdafe21c56c8089056))
* **goldwind:** continously refresh shaft data (DIGDTGW-1421) ([596ddc2](///commit/596ddc2f007ccea91a1cf653de53e8b511e1d81b))
* **workspace:** update to angular 11 ([2701a47](///commit/2701a47e42d4740cb0efd5671a1e3e5694d2f347))

## [1.9.0](///compare/v1.11.0...v1.9.0) (2020-11-11)


### 🎸 Features

* **goldwind:** add polar chart from lsp data (DIGDTGW-1237) ([3d93020](///commit/3d9302023c81a33d4a50e07e034b259a75016a73))
* **goldwind:** conntect lsp api to frontend store (DIGDTGW-705) ([f370186](///commit/f37018662803b1ea82126e30eccca81aa36d3861))
* **goldwind:** migrate lls from websocket to http (DIGDTGW-1195) ([e70c559](///commit/e70c5598676f1843b45a64b7c301e8e8c0893a2e))

## [1.8.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.7.0...v1.8.0) (2020-10-12)


### 🎸 Features

* **goldwind:** display grease status gauges in overview (DIGDTGW-716) ([f79746e](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/f79746ee11e29b85402528e179d1889b3144bda2))

## [1.7.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.6.0...v1.7.0) (2020-09-28)


### 📈 Improvements

* **goldwind:** add construction hint and spinner to overview ([b5b6689](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/b5b66896aeb1edaf1410c50a6bef1c7335f028e0))


### 🎸 Features

* **goldwind:** add daterange picker to edm monitor (DIGDTGW-622) ([a395a7a](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/a395a7a04467f8a9b1033507fb6cd2958844141c))
* **goldwind:** add grease status detail diagramm (DIGDTGW-714) ([7fc177a](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/7fc177a46990d682915e87a8f74496d5960bc5cd))
* **goldwind:** display max value in edm monitor (DIGDTGW-781) ([bd64157](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/bd641577ae1fcfda1ac9723ee5426c201bc7e4c1))

## [1.6.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.5.0...v1.6.0) (2020-09-11)


### 🎸 Features

* **deps:** update to angular v10.1 and typescript 4.0.2 ([edc0bb1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/edc0bb1d32af1b0b585de3f79bc96eaf393c240e))
* **goldwind:** add grease check data from api (DIGDTGW-448) ([cf571f1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/cf571f1b57c6d8e5a3fe26d58d9599955ff0a544))
* **goldwind:** add windfarm overview from api data (DIGDTGW-393) ([3dc55d4](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/3dc55d41f0e9b214d811438366d634baec92ca60))
* **goldwind:** show edm data per antenna (DIGDTGW-621) ([e3246fc](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/e3246fca42ecb148b8b42e6430834476d8198fb0))

## [1.5.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.4.0...v1.5.0) (2020-08-27)


### 📈 Improvements

* **goldwind:** add @ngrx/component features ([730113a](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/730113a736076f56c3c33e905548244671b211cd))


### 🎸 Features

* **goldwind:** add condition measuring equipment (DIGDTGW-573) ([3d117a8](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/3d117a8eb9b84ac3a99369fdac0ccf8a3481f91c))
* **goldwind:** adjust edm from table to chart ([0429fcd](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/0429fcd3bb32230aae85160b167bf0ca9c711bcd))
* **styles:** make styles lib publishable (UFTABI-2916) ([245e355](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/245e355c6de4dafff18bdf03301074adb41669c3))

## [1.4.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.3.0...v1.4.0) (2020-08-12)


### 🎸 Features

* **goldwind:** connect frontend to EDM API (DIGDTGW-435) ([122c9de](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/122c9def9a72512d7349465db9d82075b3efd282))


### 🐛 Bug Fixes

* **goldwind:** fix apiurl socket transformation ([4929be8](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/4929be8e1e031e4e58e9ae908953aecb08df01db))

## [1.3.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.2.0...v1.3.0) (2020-08-07)


### 🎸 Features

* **auth:** make auth library publishable (UFTABI-2636) ([26833ff](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/26833ffdccd5dc448e99130de7fd240462721e02))
* **empty-states:** migrate lib to publishable lib (UFTABI-2635) ([977435f](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/977435f2481c68dcb842cbe3f3aaa93302e0175d))
* **goldwind:** add initial bearing condition-monitoring (DIGDTGW-407) ([47880c6](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/47880c66bc43a114f5eeedce3b2d67506b198d29))
* **sta:** use shared auth library (UFTABI-2265) ([3eb7c69](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/3eb7c69b3c6aec1b05766205d06f87ce4c821d7a))

## [1.2.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.1.0...v1.2.0) (2020-07-21)


### 🎸 Features

* **auth:** enable code flow (UFTABI-2237) ([d9b4ffa](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/d9b4ffa0452b69f4547db98f0698f8f9d8eabd91))
* **goldwind:** add device overview (DIGDTGW-393) ([585f98e](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/585f98ef75a0033080dbc00f0c624a2cb3725c3b))

### [0.5.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v0.5.0...v0.5.1) (2020-07-01)


### 🎸 Features

* **goldwind:** add authentication (DIGDTGW-330) ([a83e794](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/a83e79426f15464d67eb7fb150fa4eb69bdd47ec))
* **goldwind:** add goldwind app boilerplate (DIGDTGW-310) ([f8d4cc2](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/f8d4cc298dc4ed9296ecd26100b16a110355531e))