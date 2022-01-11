 Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
**Note:** Dependency updates, refactored code & style/test/performance changes are not shown within this changelog. Thus, releases without any entries may occur.

## [3.1.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/footer-v3.0.2...footer-v3.1.0) (2022-01-11)


### 🐛 Bug Fixes

* **footer:** adjust footer paddings (UFTABI-5095) ([#2902](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2902)) ([625a6ee](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/625a6ee3854310d84b025eca5570a4cb2984f2f1))


### 🎸 Features

* reduce css bundle sizes ([#3348](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3348)) ([#3377](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3377)) ([1978d74](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/1978d745d959d521f060f51e98ab85a2390612bf))
* **workspace:** individual project configurations instead of one global ([#3248](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3248)) ([ba451ef](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ba451ef87c9c9cff99440b9739c9ebf4069a16dc))
* **workspace:** update core dependencies ([#3381](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3381)) ([#3383](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3383)) ([3c7b0a3](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/3c7b0a37be3104fc216c3ee6506d5f8ce2cadb21))
* **workspace:** use eslint for sorting of imports ([#3424](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3424)) ([546e884](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/546e8845a9250580ccdc982e3f5c1d818f8678bd))

### [3.0.2](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/footer-v3.0.2...footer-v3.0.0) (2021-09-09)

### [3.0.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/footer-v3.0.1...footer-v3.0.0) (2021-09-07)

## [3.0.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/footer-v3.0.0...footer-v2.0.0) (2021-09-07)


### ⚠ BREAKING CHANGES

* **footer:** update peer dependencies

### 🎸 Features

* **footer:** update peer dependencies ([8fb7e43](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8fb7e4384d34fe7da177f4b2a4a1c576fd66e963))
* **goldwind:** add china bureaucracy metadata to footer (DIGDTGW-2613) ([#2832](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2832)) ([e755a64](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/e755a641fd739e3baeb8b3def3ddd395fff7995a))
* **libs:** use partial compilation (UFTABI-4907) ([#2835](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2835)) ([27829ff](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/27829ff96da6ccc3a4ee0b98bc6f766a8c4a5057))

## [2.0.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/footer-v2.0.0...footer-v1.7.2) (2021-08-24)


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

### [1.7.2](///compare/footer-v1.7.2...footer-v1.7.1) (2021-05-20)

### [1.7.1](///compare/footer-v1.7.1...footer-v1.7.0) (2021-04-29)

## [1.7.0](///compare/footer-v1.7.0...footer-v1.6.0) (2021-03-24)


### 🎸 Features

* **workspace:** build libs with prod config (UFTABI-4112) ([6cd84a2](///commit/6cd84a2b3f3b5fe695d93c28e6cf5eb69bf6c205))

## [1.6.0](///compare/footer-v1.6.0...footer-v1.5.0) (2021-01-22)


### 🎸 Features

* **deps:** update to nx 11 and fix jest setup ([4df2df3](///commit/4df2df38f8a3fa29abae9b9f736e7d237344541b))
* **footer:** use optional input parameter for footer version (UFTABI-3269) ([c5354e0](///commit/c5354e0f3ccdd4ed10ec0613b685f07b254b1997))

## 1.5.0 (2020-11-25)


### 🎸 Features

* **footer:** add storybook stories (UFTABI-2513) ([25d8a36](///commit/25d8a3646ab6db0fad19fcacad0bec61d1f6a26a))
* **footer:** decrease margin top ([f4341bc](///commit/f4341bc373b6616d492dea256cd9034cfb2d3610))
* **footer:** extract footer to its own lib (DSCDA-2311) ([3a3e8fb](///commit/3a3e8fb00f23a065dfe021de09205ec6d408b0b8))
* **footer:** use view engine and prevent barrel imports (UFABTI-2735) ([68ad5d1](///commit/68ad5d1205538d42b15f4e9cce99ed6ca4731f2e))
* **goldwind:** add goldwind app boilerplate (DIGDTGW-310) ([f8d4cc2](///commit/f8d4cc298dc4ed9296ecd26100b16a110355531e))
* **libs:** add automatic npm package deployment (UFTABI-2637) ([8e6a297](///commit/8e6a29702edbf348d540016a77814f5fce6193d5))
* **sidebar:** add storybook stories (UFTABI-2516) ([983ff75](///commit/983ff7543a52c564b3b60c5d02f2b438a3a19fa1))
* **styles:** make styles lib publishable (UFTABI-2916) ([245e355](///commit/245e355c6de4dafff18bdf03301074adb41669c3))
* **workspace:** enable auto-populated publishable library dependencies (UFTABI-2390) ([471e246](///commit/471e246144837957500060590020b380a0940c39))
* release v1 (UFTABI-2483) ([79c1ba7](///commit/79c1ba7c6c1af8ccd909083d91fffbe0ae017ebb))


### ✏️ Documentation

* **shared-libs:** improve documentation ([18b709a](///commit/18b709a184a4ff7c2c342620bfec4a297831ae6e))


### 📈 Improvements

* **goldwind:** add construction hint and spinner to overview ([b5b6689](///commit/b5b66896aeb1edaf1410c50a6bef1c7335f028e0))
* **workspace:** adjust libs to ensure angular 11 compatibility ([08e417a](///commit/08e417a2e3a8c2404681863ff6466216e9ba80c6))

### [1.4.4](///compare/v1.9.0...v1.4.4) (2020-11-02)

### [1.4.3](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.9.0...v1.4.3) (2020-10-27)

### [1.4.2](///compare/v1.7.0...v1.4.2) (2020-10-12)


### ✏️ Documentation

* **shared-libs:** improve documentation ([18b709a](///commit/18b709a184a4ff7c2c342620bfec4a297831ae6e))

### [1.4.1](///compare/v1.6.0...v1.4.1) (2020-09-28)


### 📈 Improvements

* **goldwind:** add construction hint and spinner to overview ([b5b6689](///commit/b5b66896aeb1edaf1410c50a6bef1c7335f028e0))

## [1.4.0](///compare/v1.5.0...v1.4.0) (2020-09-11)


### 🎸 Features

* **footer:** decrease margin top ([f4341bc](///commit/f4341bc373b6616d492dea256cd9034cfb2d3610))

## [1.3.0](///compare/v1.4.0...v1.3.0) (2020-08-27)


### 🎸 Features

* **footer:** use view engine and prevent barrel imports (UFABTI-2735) ([68ad5d1](///commit/68ad5d1205538d42b15f4e9cce99ed6ca4731f2e))
* **libs:** add automatic npm package deployment (UFTABI-2637) ([8e6a297](///commit/8e6a29702edbf348d540016a77814f5fce6193d5))
* **styles:** make styles lib publishable (UFTABI-2916) ([245e355](///commit/245e355c6de4dafff18bdf03301074adb41669c3))

### [1.2.2](///compare/v1.3.0...v1.2.2) (2020-08-12)

### [1.2.1](///compare/v1.2.0...v1.2.1) (2020-08-07)

## [1.2.0](///compare/v1.1.0...v1.2.0) (2020-07-21)


### 🎸 Features

* **workspace:** enable auto-populated publishable library dependencies (UFTABI-2390) ([471e246](///commit/471e246144837957500060590020b380a0940c39))

## [1.1.0](///compare/v0.5.0...v1.1.0) (2020-07-01)


### 🎸 Features

* **footer:** add storybook stories (UFTABI-2513) ([25d8a36](///commit/25d8a3646ab6db0fad19fcacad0bec61d1f6a26a))
* **goldwind:** add goldwind app boilerplate (DIGDTGW-310) ([f8d4cc2](///commit/f8d4cc298dc4ed9296ecd26100b16a110355531e))
* **sidebar:** add storybook stories (UFTABI-2516) ([983ff75](///commit/983ff7543a52c564b3b60c5d02f2b438a3a19fa1))
* release v1 (UFTABI-2483) ([79c1ba7](///commit/79c1ba7c6c1af8ccd909083d91fffbe0ae017ebb))

## [1.0.0](///compare/v0.5.0...v1.0.0) (2020-06-02)

**⚠ First official release that contains all previous releases ⚠**