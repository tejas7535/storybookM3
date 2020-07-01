# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.5.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v0.5.0...v0.5.1) (2020-07-01)


### 🎸 Features

* **cdba:** adapt to new REST API without filter merge logic (DSCDA-1663) ([03e5904](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/03e59049bd9865f323e2c0073ea31e28c40b2655))
* **cdba:** added reset filter button (DSCDA-1713) ([e1b3722](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/e1b3722aba2afeea19eaa7033d41f1ffc7e85f66))
* **cdba:** connect reference types table to backend (DSCDA-1493) ([4549af2](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/4549af2196705ae2f3f8af11c7cd7a7971d21514))
* **cdba:** hide forbidden columns in RT table (DSCDA-1610) ([a2dfc3e](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/a2dfc3ec354cb87c035a213568ccd13f98518cd5))
* **cdba:** implement Detail Page Layout (DSCDA-1638) ([449e693](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/449e693c9552825f0ea068b2b2123fc8b4e721a0))
* **cdba:** implement UI for "too many results" (DSCDA-1597) ([121a9d9](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/121a9d9f2b9305488839736af0db7b16de21ecca))
* **cdba:** make use of shared icon lib (DSCDA-1767) ([e941798](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/e94179860094987dbec85feab0367ebb0baad3a9))
* **cdba:** no results found msg for search in autocomplete (DSCDA-1670) ([94257b7](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/94257b7b991c5ff3e3a7354aa2d6643a938696bc))
* **cdba:** only load necessary table modules (DSCDA-1676) ([abf3a03](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/abf3a03b67550fc3f1e0e130a987057693fa7201))
* **cdba:** update aad credentials for environments ([43e8caf](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/43e8caf0c9b6ce426c422a9d9474c592545db472))
* release v1 (UFTABI-2483) ([79c1ba7](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/79c1ba7c6c1af8ccd909083d91fffbe0ae017ebb))


### 🐛 Bug Fixes

* **cdba:** fix aad credentials for dev ([37d12d0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/37d12d07828ab057d79a74b1900a5e938be64e13))
* **cdba:** update email for support (DSCDA-1750) ([e778c35](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/e778c353d4166a5a2282a77521c89622e725b773))

## [1.0.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v0.5.0...v1.0.0) (2020-06-02)

**⚠ First official release that contains all previous releases ⚠**

## [0.4.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v0.3.0...v0.4.0) (2020-05-13)


### ⚠ BREAKING CHANGES

* **header:** Header, Responsive and Transloco are moved to new publishable libraries (@schaeffler/shared/ui-components --> `@schaeffler/header`; @schaeffler/shared/responsive --> `@schaeffler/responsive`; @schaeffler/shared/transloco--> `@schaeffler/transloco`)

### 🎸 Features

* **cdba:** add reference types table with ag grid (DSCDA-1457) ([9ff48a0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/9ff48a0f9835c3aa766988c81c988948ef26e55d))
* **footer:** extract footer to its own lib (DSCDA-2311) ([3a3e8fb](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/3a3e8fb00f23a065dfe021de09205ec6d408b0b8))
* implement store & REST logic for search and filtering (DSCDA-1482) ([443ad3d](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/443ad3d018d3e02cf8c9e2b1f559277bde7a0fda))
* **cdba:** prepare layout for reference types search (DSCDA-1547) ([0318bdf](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/0318bdf8506f5ec3d2deb22bc2635cac79d2a60a))
* **header:** split header into seperate publishable lib (UFTABI-2309) ([721ead8](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/721ead8681c9ce017e6ff939911dc31d449831f7))
* **workspace:** enable custom changelogs for each project ([5e07b00](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/5e07b0064e287f9c8f5187b96617c9f685089052))
