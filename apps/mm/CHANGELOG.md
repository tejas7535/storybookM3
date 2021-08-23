 Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
**Note:** Dependency updates, refactored code & style/test/performance changes are not shown within this changelog. Thus, releases without any entries may occur.

## [0.1.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/mm-v0.1.0...mm-v0.0.1) (2021-08-23)


### ⚠ BREAKING CHANGES

* **footer:** This lib now depends on tailwind. See `Readme` for more details.

* refactor(footer): move footer-tailwind implementation to footer

* refactor: use footer instead of footer tailwind

* refactor: remove footer tailwind entirely

* fix(footer): add missing logo

* chore: dont pass lint in case of errors

* test(footer): fix unit tests of footer

Co-authored-by: Fabian Kaupp <kauppfbi@schaeffler.com>

### 🐛 Bug Fixes

* **mm:** disable navigation to disabled steps (UFTABI-4599) ([#2660](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2660)) ([7d210a2](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/7d210a2fde083e71142262edc498fd521bc0c5e5))
* **mm:** empty cached form values after back navigation (UFTABI-4859) ([ff53f02](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ff53f0238e7f444469f2d7a1a8fd84083a236174))
* **mm:** fix bearing series selection (UFTABI-4902) ([7eddbe4](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/7eddbe441fb9e1882e2d18795a6bd7501f2508e3))
* **mm:** fix empty state styles ([de912f6](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/de912f6b2a70e7863c94c868fd9191e4fc958d7f))
* **mm:** fix form reset (UFTABI-4942) ([#2653](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2653)) ([4d73754](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4d737549bfd265e78812396d11547c47b6568ad1))
* **mm:** fix iframe styling (UFTABI-4929) ([#2664](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2664)) ([82d8635](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/82d863541420a3630d2c8faf6d350cf54041d7a7))
* **mm:** fix mobile styling in iframe ([ed7e8eb](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ed7e8eb14ac3fbbf262c18df12a749e45e69d03f))
* **mm:** fix table styling ([9d1b59c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/9d1b59c4cb02ed70ad9a3146cc05ddcb46ba84c7))
* **mm:** no control reset on page 4 or 5 ([afab92c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/afab92cedc8872476714ef91080974e865817762))
* **workspace:** disable caching for index.html and configure outputHashing (GQUOTE-685) (DSCDA-2362) ([#2727](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2727)) ([5400d16](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/5400d16ed0f1cab1caf7c3760724148ff996922f))


### 🎸 Features

* **autocomplete:** add a search-autocomplete lib (UFTABI-3723) ([d979837](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/d979837a0e3390ae8cd43ad64b1713d40f7b69bd))
* **footer:** reimplement footer based on tailwind (UFTABI-4632) ([#2700](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2700)) ([e54c88d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/e54c88d08e472f2915bc0ce1770eac5b4e9cca07))
* **legal-pages:** add shared lib (UFTABI-4848) ([#2687](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2687)) ([8977b28](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8977b281d8adc3bf6705aaff5cb124af8fb8fea9))
* **mm:** add a magnetic slider (UFTABI-3802) ([26b9800](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/26b98008712770d2410b325d66b02c4143752dee))
* **mm:** add app insights and final legal documents ([11ce5c5](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/11ce5c5d98b584ce80725a7e83413cf2b2dee0e7))
* **mm:** add favicon and metainformation (UFTABI-3821) ([#2696](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2696)) ([662680f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/662680fbf551ab6ea8ca37eb22342a8b4695ff5f))
* **mm:** add full translation for dialog.json (UFTABI-4506) ([76fbbd2](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/76fbbd210c4ce646de8a0ad13b8878c1f84dca12))
* **mm:** add http cache (UFTABI-4518) ([79154cb](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/79154cb57f6155f08157a69ba898e76f1f4873c7))
* **mm:** add iframe behaviour (UFTABI-4658) ([78f71ed](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/78f71ed0c69d8eef89b861aacc469053b5468d1d))
* **mm:** add locale to http header (UFTABI-4518) ([045272f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/045272fbf39090dc9f6b80864ebef725b83011d1))
* **mm:** add manual switch for language and decimal separator ([291504b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/291504b1a4bb92e896514dc2d9f033d7efc67bab))
* **mm:** add ru/zh general translations (UFTABI-4941) ([ab9a36a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ab9a36abc2d112536cc78b40963914a4981addd8))
* **mm:** add shared seperator component (UFTABI-4517) ([6ba1a75](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/6ba1a75a266ea8f0a93180738232e435fcb5c78c))
* **mm:** add shared stepper component (UFTABI-4470) ([57745b2](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/57745b21d9be16fdc9c5463cd9c765cd64ccb718))
* **mm:** add strict template check (UFTABI-4629) ([bae342c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/bae342ca20680549d9a02d75958dd11a3aff210c))
* **mm:** add wizard with dynamic forms ([b2e9812](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/b2e98125cc53a98fe585a273a7aee3348951310c))
* **mm:** adjust styling (UFTABI-4849) ([bd3e54a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/bd3e54a0918ef1aedd60e30f257871f69752684c))
* **mm:** adjust to show three bearing types ([#2655](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2655)) ([5804078](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/5804078bb25ada5daa94f2d9ce1afb81bad89da1))
* **mm:** apply changes from design review (UFTABI-4850) ([3c3fa0b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/3c3fa0b2bcdbe1e18f67b14a33ce101907997f73))
* **mm:** cache bearing responses, styling (UFTABI-4172) ([9d95443](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/9d954430f1a2184528cc07a872d14401508baa5a))
* **mm:** configure bearing optionally (UFTABI-4905) ([#2638](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2638)) ([db8de2b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/db8de2ba3fe2bec87dd9ca1d99e0f1e3bdfdc7f5))
* **mm:** finish styling of report (UFTABI-4852) ([c09fa5a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/c09fa5ae339d0df59169c8da8038d4cfb06e834c))
* **mm:** fix lint issues ([b4fec4c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/b4fec4c1de442df04a7439fdf430d447b9eba195))
* **mm:** handle all start parameters (UFTABI-3619) ([cd2145f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/cd2145f748bbc641015b638e8208412718211bf0))
* **mm:** integrate loading spinner (UFTABI-4367) ([2d2803d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/2d2803de1873e809a62c5d14987cf5c23a418b6a))
* **mm:** mark inaccessible steps as done ([d24a00c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/d24a00c17741aff0094e55dcdb088a339f596c0d))
* **mm:** prepare release (UFTABI-4978) ([#2789](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2789)) ([eee1973](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/eee197367a76348ff57c047d0584069953fa5584))
* **mm:** preselect only available option ([65e9893](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/65e9893335060f7ce1c2b92bc349c92ad632f159))
* **mm:** refactor bearing search (UFTABI-4244) ([d9964a3](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/d9964a389065400c52d14ca7e87128fcbb3ad080))
* **mm:** refactor picture card (UFTABI-4858) ([52f1b24](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/52f1b2471a79248e83aea0865c13d4829298325b))
* **mm:** refactor string-number/list-member (UFTABI-4366) ([236076b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/236076ba751c9e5f0c94a9fedda11a7a4ca97fb4))
* **mm:** refactor tests ([c877df2](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/c877df2ec5d6c16d0150608561b7fa41b230c0eb))
* **mm:** remove unused cachebucket ([6555ca6](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/6555ca6f0d2bdcdae5a8b2d2d47a6d7a1ed40225))
* **mm:** reset wizard on language change (UFTABI-4720) ([1d3c5e8](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/1d3c5e8cc6295d2677ceb6a4540f7b9771aa90b9))
* **mm:** result page upgrades (UFTABI-4814) ([#2619](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2619)) ([2f24da1](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/2f24da1168cdb8dc7431cdde77a1f5e512fddafb))
* **mm:** show selected bearing (UFTABI-4752) ([b50a8a2](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/b50a8a2461a4d88c3a64309b0f63ee0c17929841))
* **mm:** split page 4 into subsections (UFTABI-4494) ([a39ac52](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/a39ac52c66a769f59411ad06a425e75b501efa07))
* **mm:** tracking opt in based on consent (UFTABI-4827) ([539d331](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/539d3319b5694c97d3eb71e2cc6483ec487fe121))
* **mm:** translate dialog strings (UFTABI-4913) ([204c25f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/204c25fc56d5450237741a6ef34cd6341e70d9be))
* **mm:** update translations ([#2668](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2668)) ([5723291](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/5723291d4ca16c78a137dea61d78a701470924d3))
* **mm:** use shared subheader (UFTABI-4893) ([c52cfd7](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/c52cfd7986eb6044eec2b6ef93691b04afd7e392))
* **report:** add shared ui report component (UFTABI-4104) ([4418486](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4418486859c3ea2045e4c7698131e33fb49e68b8))
* **workspace:** add eslint config (UFTABI-3762) ([4d3b417](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4d3b417a7a01b99d3c211203414c2bc80540a783))

### 0.0.1 (2021-02-18)


### 🎸 Features

* **mm:** add static interims legal pages page (UFTABI-3794) ([9bd3877](///commit/9bd38772ade8f3397b034528d528fc8732383e74))
* **mm:** implement footer in styled boilerplate (UFTABI-3849) ([0d8a135](///commit/0d8a135317d64a553db1c6ca79880a9d1589020f))
* **mm:** linting changes ([6b2ad58](///commit/6b2ad5871c05235a9801bb42fb9e13d732548dcc))
* **mm:** remove user menu from MM ([708e325](///commit/708e3253e0e1a9b0518b8a74469d79927c1d0f0d))
* **mm:** set up a store for MM steps (UFTABI-3578) ([3a299be](///commit/3a299be78a11076b5cdccf8247c9451ea404722f))
* **mm:** setup mounting manager ([34c7f21](///commit/34c7f21f64502b263921c3641a1561af99d3aaf7))
* **mm:** setup tailwind with schematic (UFTABI-3647) ([c7766c3](///commit/c7766c37d22de27da23c173dda495b8e008ce3c9))
* **workspace:** configure tailwind (UFTABI-3648) ([bc6fa70](///commit/bc6fa7016c1cfa2a2e484c9871e261d832b23cca))
