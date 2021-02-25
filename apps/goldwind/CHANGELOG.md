 Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
**Note:** Dependency updates, refactored code & style/test/performance changes are not shown within this changelog. Thus, releases without any entries may occur.

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