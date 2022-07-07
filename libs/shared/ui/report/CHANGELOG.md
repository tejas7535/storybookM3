 Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
**Note:** Dependency updates, refactored code & style/test/performance changes are not shown within this changelog. Thus, releases without any entries may occur.

## 0.7.0 (2022-07-07)


### ⚠ BREAKING CHANGES

* **report:** update peer dependencies

### 📈 Improvements

* **libs:** adjust readmes to reference correct tailwind usage (UFTABI-4951) ([#2815](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2815)) ([a38ba59](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/a38ba598e284863613dfb5e1114a4da6ec19199c))


### ✏️ Documentation

* adjust to suggest material icon source ([a73e91b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/a73e91b89002ba7f7768461b1fae6713cc88a30a))


### 🐛 Bug Fixes

* add standard-version config for changelog generation ([#3902](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3902)) ([#3950](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3950)) ([c20807b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/c20807bfbdace3a554876ba7f5b9f1be10453c72))
* **application-insights:** adjust to handle apps without cookies ([#3988](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3988)) ([378599d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/378599d96eb620cc70d376b91d83b2f823d75b36))
* **application-insights:** only track when opt in happened ([#3932](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3932)) ([f55dc8c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/f55dc8ce3e48550b594da1d7733bd8e4f29f2efa))
* **ga:** adjust json report table padding (UFTABI-5311) ([#3550](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3550)) ([62579f4](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/62579f4eb4f5174e5df4b2220361ee95e9ce950c))
* **ga:** show correct medium grease quantity (UFTABI-5397) ([6624667](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/662466798f8808db1a7d0b9c9119661f6d2f098d))
* **picture-card:** fix html format issues ([cdb1184](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/cdb1184c82bb5db83a9460a9c9e067ce36f6b779))
* **report:** add white space break to "label" table cells in HTML report (UFTABI-5607) ([9c579fe](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/9c579fe6c5284b3fc6e8c87a5354b38d81697238))
* **report:** adjust report style to not affect outside logo ([8128368](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8128368117e29aabcdb2f44b82bb9f72a3cfee4d))
* **report:** handle missing translations in report for prod (UFTABI-5693) ([379d553](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/379d553a183146e42d5f69357530a4c82d0b5997))
* **report:** restore info tooltip in grease report ([#3423](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3423)) ([099b9b8](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/099b9b846f7b5020b2bae029f7eca48b85f0ecfd))
* **report:** set correct translation key ([bdc621f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/bdc621fe4b8c241c987a51b16f882a07119dca0f))
* **report:** typo in translation json resolved ([0014d95](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/0014d951c27543ec48084c7a83da416ea2ab89a2))
* **workspace:** fix eslint configuration for local and ci execution ([#3598](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3598)) ([4a7dc1f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4a7dc1fe79d94b6d8ddfa7cf2644e3bbc11a3e80))
* **workspace:** re-activate eslint rule ([#3599](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3599)) ([#3873](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3873)) ([b38665d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/b38665d76345a952f77da1ae28c7726397e8c010))


### 🎸 Features

* **ga:** add german grease report texts, icon styles ([49fc3b2](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/49fc3b2f1403bf493937f68e7ea6cc707f9f305d))
* **ga:** add most important custom event trackers (UFTABI-5298) ([#3923](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3923)) ([e56952a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/e56952aabc3d5fc4c57e8cd10f0d7ede4c79d2f1))
* **ga:** adjust according feedback ([d4596b9](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/d4596b91ee9f01b3d4f1f0dc2a2e788507f23f92))
* **ga:** adjust german report wording ([64184a2](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/64184a22cedeb426a8ccae53c6c7e9edc16a068b))
* **ga:** adjust grease json report parsing (UFTABI-5107) ([0a5deb4](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/0a5deb460c0db5503ea6dc95c7b2d7359f887f8a))
* **ga:** adjust to json result from api (UFTABI-5229) ([#3558](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3558)) ([ae85dbb](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ae85dbb3818403cdfecdb02437c8435e4fc32946))
* **ga:** apply design changes ([#3099](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3099)) ([7f7cac0](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/7f7cac0cc97b55d7b984611ff7bd2d971befb5d3))
* **ga:** fix tests, render three important rows ([7fbbe37](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/7fbbe378fdf89e8c49b3340d11d5a58ad94283b6))
* **ga:** parse title, subtitle ([452249c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/452249c4a12a4e72206ae77e7e3cbaae3ffe8ced))
* **ga:** revise info texts (UFTABI-5265) ([#3440](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3440)) ([60ad087](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/60ad087a703747af4f867938bf44fed384a2e184))
* **ga:** start table with grease props ([08fe01a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/08fe01a31674e1c163a6b86d90d8efc4fcff4e52))
* **ga:** use actual grease report ([1ba6d82](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/1ba6d828027b13d3f2a9fa84f333e10ec5e44fb5))
* **libs:** use partial compilation (UFTABI-4907) ([#2835](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2835)) ([27829ff](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/27829ff96da6ccc3a4ee0b98bc6f766a8c4a5057))
* load material icons from npm module ([0ba3a13](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/0ba3a138b9f07f56f2a4309a7b6954c45d7ead77))
* **mm:** finish styling of report (UFTABI-4852) ([c09fa5a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/c09fa5ae339d0df59169c8da8038d4cfb06e834c))
* **mm:** prepare release (UFTABI-4978) ([#2789](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2789)) ([eee1973](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/eee197367a76348ff57c047d0584069953fa5584))
* **mm:** show snackbar on error (UFTABI-4814) ([#2635](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2635)) ([154e93d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/154e93deba9f42703aeaf4cb810a0ccba8f181e0))
* **mm:** use different apis in environement ([#2984](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2984)) ([b20e4ac](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/b20e4ac0a2620e0f1b0643beb713dc93a0210df8))
* reduce css bundle sizes ([#3348](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3348)) ([#3377](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3377)) ([1978d74](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/1978d745d959d521f060f51e98ab85a2390612bf))
* **report:** add bottom spacing to grease result ([78d0f3e](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/78d0f3e8a1e2b186d4e6320f5431843a31cae87d))
* **report:** add json parsing (UFTABI-5021) ([#2825](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2825)) ([4a934e9](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4a934e9ef4edf32ba9302682895f49e06235d0c4))
* **report:** add kappa ([8961e5e](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8961e5ecddee6200a6d255db111856c8bfb1e20f))
* **report:** add shared ui report component (UFTABI-4104) ([4418486](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4418486859c3ea2045e4c7698131e33fb49e68b8))
* **report:** add tooltips, german version ([ef99510](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ef99510f6ea5ccb234abe5e8bf595d1686928c32))
* **report:** add weight to grease report (UFTABI-5253) ([#3554](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3554)) ([031f364](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/031f36408f281ddee18caae680ab5a834680cc25))
* **report:** adjust for translated errors and default snackbar (UFTABI-4948) ([#3511](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3511)) ([6108d2b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/6108d2b15deed7bc86be55b89258800f8779366f))
* **report:** change order of grease result entries (UFTABI-5579) ([#3961](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3961)) ([f89ac38](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/f89ac384a865226f547a93f5bef38523c37327fe))
* **report:** entire grease result parsed ([b7ffdbd](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/b7ffdbd2e91e24996ce7665431ead64976c90c28))
* **report:** extend root tailwind config ([5c5d70d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/5c5d70d650ebd16a0c7d764a6e8035b57e5ff843))
* **report:** finish decimal behaviour ([4747f2c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4747f2ca47b5a418f999a65fc247bc6849a8da92))
* **report:** handle small grease amounts (UFTABI-5437) ([c43f250](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/c43f25018a62a59eda2f120c473253dee50d9b77))
* **report:** highlight preferred grease result (UFTABI-4949) ([0e70325](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/0e7032583866f9789c4433c8a0436356a6778093))
* **report:** improve responsive behavior of input section (UFTABI-5236) ([74b92d8](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/74b92d844c203e0596fb8c06eb28858a65acadde))
* **report:** introduce report input component (UFTABI-5236) ([9410a9f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/9410a9f9cad9baf37b84494d2147a946e95df09d))
* **report:** localize grease result values (UFTABI-5613) ([06c10b9](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/06c10b9cb19f06b88f9f04f909e869fc7bac75fb))
* **report:** make result heading dynamic (UFTABI-4949) ([e30c805](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/e30c805ceb50d06a45d3d27fef8ea8246cb1dd3b))
* **report:** mark insufficient grease result item (UFTABI-4949) ([91f1f0a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/91f1f0a163df5eaf0ba7144d1ce4e1a9f2421f0e))
* **report:** report translations, grease desktop layout ([1b49cb6](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/1b49cb6c490e5df6b2ab92cdc309be6f0c345484))
* **report:** scope report styles ([7ebcc5c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/7ebcc5c5c750bce00f42fc46212a1f9b9c430d36))
* **report:** set language specific shop base url (UFTABI-5659) ([336705f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/336705fae5f5228b817529f141eb03fc44759a37))
* **report:** show total result amount ([34b65fd](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/34b65fd51c012d72b264a18c7dd8713f83b5ead1))
* **report:** switch value entries (UFTABI-5458) ([35b2f70](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/35b2f7009299418f9a731b39b33593bf2a3a8631))
* **report:** text change in grease report ([4894b95](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4894b95e0a32b50043370abdbb49216241e4ed32))
* **report:** toggle all greases in result (UFTABI-5344) ([fe537b1](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/fe537b1f29f4b2c2236d35c02f496bbd24fc4a94))
* **report:** toggle grease report additional fields ([9a76cf2](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/9a76cf2dd7e718d95e6791c70f2774114741ed02))
* **report:** translations, styling ([205f6ec](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/205f6ec72570237fa532a17f9fe62e38b0d9b5b6))
* **report:** update peer dependencies ([039da10](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/039da10c49d1cd20e0578c4e501f81507f31455e))
* **shared-ui-report:** style long expansion panel title ([002edbf](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/002edbf2739711cc72a11552fb691a64713c3488))
* **shared-ui-report:** text and style fixes ([1eda41c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/1eda41c4b6b7fc9604181e55c5b4f3e4e193fcdd))
* **style:** add new color variables ([#3391](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3391)) ([072e93c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/072e93cc90858f751717e10e383f87ab2d4c61f6))
* **styles:** add tailwind to styles lib ([#3573](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3573)) ([#4104](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4104)) ([d32b170](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/d32b170c13de73f90b3a792d9f50f29cede37898)), closes [#3753](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3753)
* **workspace:** fix accessibility and numerical separator issues (UFTABI-4728) ([699fb97](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/699fb97a63a9069d847dfa489386da561028e5ea))
* **workspace:** individual project configurations instead of one global ([#3248](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3248)) ([ba451ef](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ba451ef87c9c9cff99440b9739c9ebf4069a16dc))
* **workspace:** update core dependencies ([#3381](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3381)) ([#3383](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3383)) ([3c7b0a3](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/3c7b0a37be3104fc216c3ee6506d5f8ce2cadb21))
* **workspace:** use eslint for sorting of imports ([#3424](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3424)) ([546e884](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/546e8845a9250580ccdc982e3f5c1d818f8678bd))
