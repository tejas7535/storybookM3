 Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
**Note:** Dependency updates, refactored code & style/test/performance changes are not shown within this changelog. Thus, releases without any entries may occur.

## [2.5.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/cdba-v2.5.0...cdba-v2.4.0) (2021-10-26)


### 🎸 Features

* **cdba:** add pcm tooling cost to detail page (DSCDA-2684) ([#3161](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3161)) ([7220c88](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/7220c88e69027256b8ede83ebeac97a6bc96a7bb))
* **cdba:** introduce detail-label-value component (DSCDA-2739) ([bccd27a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/bccd27a345516ffef60060dfd77b8a06b21c8b57))
* **share-button:** add share button lib (UFTABI-4939) ([4901165](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4901165a172d95185184fa8acbd870193753240b)), closes [#3031](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3031)


### 🐛 Bug Fixes

* **cdba:** enable tooltips for disabled buttons (DSCDA-2752) ([#3128](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3128)) ([8e3ce4b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8e3ce4bb53348c610d1e130a7d65c8438367004a))
* **cdba:** make breadcrumbs service a root service (DSCDA-2753) ([bae11bb](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/bae11bbc74ed19b05a92f1c2e445df38ee43404f))

## [2.4.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/cdba-v2.4.0...cdba-v2.3.1) (2021-10-12)


### 📈 Improvements

* **cdba:** adjust styling and wording of drawings and bom chart hint (DSCDA-2709) ([6789d7b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/6789d7b42c0b3f27442856c411c7f3011f81b39a))


### 🐛 Bug Fixes

* **cdba:** add fallbacks for missing units in dimensions widget (DSCDA-2721) ([#3014](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3014)) ([433c68f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/433c68fc9e3f46802e016df534ead4ed73760c45))
* **CDBA:** change link and text of action button (DSCDA-2712) ([1a05e9c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/1a05e9c75c19a2953b59f5d59da5fe5dbc04bdc6))
* **cdba:** don't allow search without selected IdValue filters (DSCDA-2720) ([33e9b0a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/33e9b0a80f7219ea7bdc03a9192d4790d1fc571b)), closes [#3006](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3006)
* **cdba:** fix custom cell for grouped "pcm" rows (DSCDA-2697) ([#3017](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3017)) ([133c3fb](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/133c3fbcfa46a670549c719aa2fe20177e21bb0c))
* **CDBA:** remove obsolete component styling after tailwind update ([87b3096](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/87b3096ce6b6c038959532fb8d7564e702aaf320))
* **CDBA:** switch names between "forbidden" and "no-access" paths (DSCDA-2712) ([123ce07](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/123ce0751c1f35c951d80b25d98953a3640ef716))
* **workspace:** correct style button and font regressions ([93b8427](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/93b8427b40554a19024ea30d765c546965d2f0e9))
* **workspace:** style button and font regressions cleanup ([#3015](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3015)) ([85f704c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/85f704c9d644da7e3f30b5d6c90a91b42a5226e1))


### 🎸 Features

* **app-shell:** extend app shell ([#3003](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3003)) ([781c13d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/781c13d61fac9aea94800e5e008cbfbd320de411))
* **cdba:** align typography, wordings and spacings (DSCDA-2706) ([#2960](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2960)) ([9424aad](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/9424aad7171a5492b900cab818367b55e809d202))
* **cdba:** disable button for certain calculation cost type (DSCDA-2711) ([e2021d0](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/e2021d04c0a1285037ff2b9c758747a499ceabdd))
* **cdba:** disable search button without selected filters (DSCDA-2708) ([#2969](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2969)) ([db5fa33](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/db5fa33cb34f0db0a5ff8a81e99513973e803cf7))
* **cdba:** improve results table header tooltips (DSCDA-2683) ([#3061](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3061)) ([9633b1f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/9633b1f02e58e2de93257cb06048a5c12bff2304))
* **cdba:** rename dimensions (DSCDA-2698)  ([#2937](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2937)) ([6aabdfd](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/6aabdfd3c3a6eff1dcd758f4d31342eb3b26a8c0))
* **cdba:** rework "forbidden" pages (DSCDA-2712) ([304f3e9](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/304f3e91e20e1f1f5c7fecba5306d2bc8cb202ca))
* **CDBA:** unify snackbar messages (DSCDA-2707) ([d773ecc](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/d773ecc991f562d068ca97b0a4e01e119156f6ee))
* **ia:** use own interceptor and configuration for http services (IA-301) ([#3036](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3036)) ([79b21b9](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/79b21b9cc5ac5f4dcf790e91026c750addcb3999))

### [2.3.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/cdba-v2.3.1...cdba-v2.3.0) (2021-09-14)


### 🐛 Bug Fixes

* **cdba:** change support email address (DSCDA-2620) ([#2935](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2935)) ([bc71e18](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/bc71e181460e3f36175dd27bb81c4ee89a726fe2))

## [2.3.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/cdba-v2.3.0...cdba-v2.2.0) (2021-09-13)


### 🐛 Bug Fixes

* **styles:** switch theme color names "warn" and "accent" ([#2866](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2866)) ([8918afc](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8918afcd5a3561f19abc86d84d232961c234c81b))


### 🎸 Features

* **cdba:** implement "locale selection" feature (DSCDA-2698) ([9d364bd](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/9d364bd2a504b8107453b6f4189ad0ef35cd38bb))

## [2.2.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/cdba-v2.2.0...cdba-v2.1.1) (2021-09-06)


### 🎸 Features

* **cdba:** implement "chargeable soon" feature (DSCDA-2620) ([b0a2fe7](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/b0a2fe78a67ce2cbc0cec43152129f718a8f2186))

### [2.1.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/cdba-v2.1.1...cdba-v2.1.0) (2021-08-31)

## [2.1.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/cdba-v2.1.0...cdba-v2.0.1) (2021-08-31)


### 🐛 Bug Fixes

* **cdba:** sort dimensions (l/w/h) on detail and compare page correctly (DSCDA-2527) ([#2791](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2791)) ([57495f1](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/57495f15f1795421ec8df823a91a17ef8957e462))
* **cdba:** trim search inputs before executing search (DSCDA-2656) ([#2803](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2803)) ([be4073c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/be4073cbbb7668f84e3da5373f31f42466d06042))


### 🎸 Features

* **cdba:** implement language switch in user settings ([c287759](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/c287759ec14a906dcb0050ea34afa8e51d459ae2))
* **cdba:** integrate app-shell lib in cdba (DSCDA-2437) ([5fc29c8](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/5fc29c82d6fed7f2e128d2ae6389aab721897d10))
* **cdba:** proofread and improve translations (DSCDA-2672) ([8bde72f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8bde72fe3ff04a33e6354c19b9e2349e4036b732))

### [2.0.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/cdba-v2.0.1...cdba-v2.0.0) (2021-08-18)


### 🐛 Bug Fixes

* **workspace:** disable caching for index.html and configure outputHashing (GQUOTE-685) (DSCDA-2362) ([#2727](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2727)) ([5400d16](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/5400d16ed0f1cab1caf7c3760724148ff996922f))

## [2.0.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/cdba-v2.0.0...cdba-v1.28.0) (2021-08-17)


### ⚠ BREAKING CHANGES

* **footer:** This lib now depends on tailwind. See `Readme` for more details.

* refactor(footer): move footer-tailwind implementation to footer

* refactor: use footer instead of footer tailwind

* refactor: remove footer tailwind entirely

* fix(footer): add missing logo

* chore: dont pass lint in case of errors

* test(footer): fix unit tests of footer

Co-authored-by: Fabian Kaupp <kauppfbi@schaeffler.com>

### 📈 Improvements

* **cdba:** simplify tab logic in compare screens (DSCDA-2526) ([#2718](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2718)) ([2c69e58](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/2c69e58bce17f9697aafe4e963b81bda16208a25))


### 🎸 Features

* **cdba:** scramble material-designations and -numbers for screencast (DSCDA-2531 & DSCDA-2534) ([#2711](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2711)) ([753ec30](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/753ec3012b8624b8d0d1976b987260b869f96f9d))
* **footer:** reimplement footer based on tailwind (UFTABI-4632) ([#2700](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2700)) ([e54c88d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/e54c88d08e472f2915bc0ce1770eac5b4e9cca07))
* **workspace:** make eslint in CI pipeline mandatory (UFTABI-4967) ([#2732](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2732)) ([0fdd5c5](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/0fdd5c56215b49f91a90dd66d4ed031a43e3839f))

## [1.28.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/cdba-v1.28.0...cdba-v1.27.1) (2021-08-03)


### 🐛 Bug Fixes

* **cdba:** better AG Grid filtering options for decimal values (DSCDA-2538) ([fbd1628](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/fbd16280e9f46166f652732d543dec16dd662722))


### 🎸 Features

* **cdba:** improve role related behaviour (DSCDA-2454) ([996b8d4](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/996b8d480db9c3a17ebce807d075357860d7524d))

### [1.27.1](///compare/cdba-v1.27.1...cdba-v1.27.0) (2021-07-21)


### 🐛 Bug Fixes

* **cdba:** solve page rendering issue for users without sales access rights (DSCDA-2546) d89ab42

## [1.27.0](///compare/cdba-v1.27.0...cdba-v1.26.0) (2021-07-20)


### 🎸 Features

* **cdba:** add hover effect for sidebar b04b8cf
* **cdba:** increase panel width for search selects (DSCDA-2513) 27a39ea

## [1.26.0](///compare/cdba-v1.26.0...cdba-v1.25.0) (2021-07-06)


### 🎸 Features

* **cdba:** display result count if there are too many results ([b2b7694](///commit/b2b76949b47d26af09bab5d1c87c9649293a6c38))
* **cdba:** excel export for bill of materials (DSCDA-2389) ([933d407](///commit/933d40731b347b156c0c21e1057002bfc8934102))
* **cdba:** integrate breadcrumbs for simpler navigation (DSCDA-2129) ([097934b](///commit/097934bc6d3c988ed1c97b64b7ee8b7efeded14f))
* **cdba:** separate search and result (DSCDA-2500) ([f9ee76e](///commit/f9ee76e4ad6ce93ad886ed16e11dacbdf6876185))

## [1.25.0](///compare/cdba-v1.25.0...cdba-v1.24.0) (2021-06-21)


### 📈 Improvements

* **cdba:** restore table selection after returning back (DSCDA-2450) ([0272659](///commit/02726598b298726b3a474df2896cb921b6020c7b))


### 🎸 Features

* **cdba:** add share button on detail and compare pages (DSCDA-2366) ([b2e03c3](///commit/b2e03c3fb77e1f29b375d41dee966ee5de15db79))
* **cdba:** add tooltip if second level filters are disabled (DSCDA-2452) ([a1ce36f](///commit/a1ce36f6053b0a52eb925d838d640b0da5c5ad93))
* **cdba:** display disabled second level filter as initial filter (DSCDA-2453) ([4376b3e](///commit/4376b3e8784433166ba7a0329bc34d3563ef96f6))
* restore table filters after navigating back ([16efbfc](///commit/16efbfc859ea739940ce0db8b1015a3722e38abb))


### 🐛 Bug Fixes

* **cdba:** prevent layout break due to css class name overlapse (DSCDA-2460) ([bd7a99a](///commit/bd7a99a739e4c0ca661c213207116bddcba57dc4))
* **cdba:** set debounce timer correctly ([5c6f283](///commit/5c6f2834521db14e245aae399bdd3b848afc9683))

## [1.24.0](///compare/cdba-v1.24.0...cdba-v1.23.0) (2021-06-09)


### 🎸 Features

* **cdba:** add compare detail page (DSCDA-2185) ([c17290a](///commit/c17290a03fc808d19980cdfe9927bb13d1a53217))
* **cdba:** track functional role of the user (DSCDA-2402) ([665d008](///commit/665d008bf6577b94a003a1517daba0b71011890b))


### 📈 Improvements

* **cdba:** add multiple improvements for compare details page (DSCDA-2324) ([be0f0f1](///commit/be0f0f1bb1158e48548c0262398365ba98966f04))


### 🐛 Bug Fixes

* **cdba:** send identification hash correctly encoded (DSCDA-2350) ([a1dd602](///commit/a1dd602fe049f392aaecc07713aa67077137a0d1))

## [1.23.0](///compare/cdba-v1.23.0...cdba-v1.22.0) (2021-05-26)


### 🐛 Bug Fixes

* **cdba:** show loading spinner for drawings correctly ([435b5c9](///commit/435b5c91cb92d1b4d63887053e53850fb986ca0b))


### 🎸 Features

* **cdba:** add faqs to footer ([9362f32](///commit/9362f321acb3f627afd95bdc5c92a0d0a4acb5d9))

## [1.22.0](///compare/cdba-v1.22.0...cdba-v1.21.0) (2021-05-25)


### 🏭 Automation

* **workspace:** adjust lint rules (UFTABI-4456) ([bcd52ff](///commit/bcd52ffddcf2011986085d510bc54488903a90dc))


### 🎸 Features

* **cdba:** add plant as query param to calculations and drawings call (DSCDA-2397) ([6d1163f](///commit/6d1163f3c4c1bd33d1133fdda396fc4d48f66406))
* **cdba:** localize delimiter improve UX for range filters (DSCDA-2034) ([a410f59](///commit/a410f591b1db33fad502b86b21ea98cb9e081654))
* **cdba:** use azure-auth lib (DSCDA-2407) ([1dc33b0](///commit/1dc33b0e9f519661f81fc7e6d7570eed05c1f2a5))

## [1.21.0](///compare/cdba-v1.21.0...cdba-v1.20.0) (2021-05-11)


### 🎸 Features

* **cdba:** use tailwind footer (DSCDA-2406) ([ad327fc](///commit/ad327fc6785364b95070c44c6c5cb54faeaa1c2f))


### 🐛 Bug Fixes

* **cdba:** revert migrate app to use azure-auth lib (DSCDA-2407) ([b22a94a](///commit/b22a94ad490c0f2517150cf2372e2b50ab1566c9))

## [1.20.0](///compare/cdba-v1.20.0...cdba-v1.19.0) (2021-05-10)


### 📈 Improvements

* **cdba:** disable compare detail tab when same materials are compared (DSCDA-2387) ([c009894](///commit/c0098942101d8d008a1e66df05e28f88972c8559))


### 🐛 Bug Fixes

* **cdba:** decouple calculation selections (DSCDA-2384) ([3de9ca6](///commit/3de9ca6f5bf8cb188ab4b8f9eb05ee469a33854a))
* **cdba:** fix behaviour of back button in tabs header (DSCDA-2386) ([ce7026c](///commit/ce7026c0a6784953a6eec039c00f361f34d71d4b))
* **cdba:** properly reset bom table for new data ([3bfb28a](///commit/3bfb28aec36dd75eb3441d8c088b9c905991c6d5))


### 🎸 Features

* **cdba:** dialog for users using an unspported browser (DSCDA-2357) ([2e64f94](///commit/2e64f94d8cefa57d7d73c2583d322aa4c4e67c73))
* **cdba:** migrate app to use azure-auth lib ([5bc2681](///commit/5bc2681b8535672b6e999f59353a32af25db0330))
* **cdba:** multiple improvements for drawings table (DSCDA-2353) ([6c17d2a](///commit/6c17d2a139f0da13ea67eaf0292b7b6b2a9c9503))
* **styles:** tab styles depend on tailwind ([06e54fb](///commit/06e54fb3154322e873f671af3f886a5e054d1a94))
* **transloco:** update transloco testing module (UFTABI-4323) ([47630c6](///commit/47630c62ca451d70e613182684fc34506a34705a))

## [1.19.0](///compare/cdba-v1.19.0...cdba-v1.18.0) (2021-04-26)


### 📈 Improvements

* **cdba:** route to 404 for malformed compare urls (DSCDA-2311) ([bff8bd6](///commit/bff8bd680125825be0375e9cac0c2b4b6581d9a4))


### 🐛 Bug Fixes

* **cdba:** avoid unprotected access to possible undefined field ([d5a18b6](///commit/d5a18b6beed23aee5f0208e608f23af1a9ecd433))


### 🎸 Features

* **cdba:** add basic state management for compare screen (DSCDA-2309) ([9e4eefe](///commit/9e4eefe96844c8c05f99255ba56638ee6ee3f1b5))
* **cdba:** align error handling for BoM container (DSCDA-2315) ([3e506e1](///commit/3e506e11c5e4fb9a4e439abe88e32f4759284d2f))
* **cdba:** integrate bom overlay bom on compare screen ([bce2b88](///commit/bce2b88614a1c64fa1edb28e0cfa9fd80bdfef8a))
* **cdba:** pass selected calculation node to compare screen (DSCDA-2310) ([8e4f745](///commit/8e4f745826fa82a3760ec12a9485864d3c15ba48))
* **cdba:** show bom table on compare bom page ([6a410fb](///commit/6a410fbe487feee8da4d803befc2f4bbb7ed0baa))
* **cdba:** show detail information in bom headline (DSCDA-2349) ([b45930e](///commit/b45930e6c67c0998cf6e5499be2fd2861966fd78))

## [1.18.0](///compare/cdba-v1.18.0...cdba-v1.17.1) (2021-04-13)


### 🎸 Features

* **cdba:** add visual fallback for undefined values (DSCDA-2258) ([3764f47](///commit/3764f478e0884531048757806c6d09c4545dd18f))
* **cdba:** display drawings table on detail page (DSCDA-2274) ([315e17c](///commit/315e17cb9077eb87c1e850325a7a66bf6a87b873))
* **cdba:** enable caching of rest calls (DSCDA-2306) ([eae4c26](///commit/eae4c26fd6750f6f3780011c3218b1c62a24dc4d))

### [1.17.1](///compare/cdba-v1.17.1...cdba-v1.17.0) (2021-03-26)


### 🐛 Bug Fixes

* **cdba:** correctly report department to application insights (DSCDA-2079) ([4bc998c](///commit/4bc998c930be893c7c8f0b3d8168a615fa594f51))


### 📈 Improvements

* **cdba:** map undefined departments to department unavailable ([4885274](///commit/488527432632f9142282b7edd6c8da3be5e207fa))

## [1.17.0](///compare/cdba-v1.17.0...cdba-v1.16.0) (2021-03-22)


### 🐛 Bug Fixes

* **cdba:** fix font issue within tabs ([4e43ebc](///commit/4e43ebc78fbc8b8fb930282c639e662e2dded83d))
* **cdba:** fix tooltip behaviour of the chart ([7aada45](///commit/7aada45a1755a999b3ad66aca8a74cf23f63071d))
* **cdba:** resolve column visibility issue (DSCDA-2164) ([4f1ce33](///commit/4f1ce3349b4665a3a671e5467c8b03728f6988b7))
* **mm:** fix empty state styles ([de912f6](///commit/de912f6b2a70e7863c94c868fd9191e4fc958d7f))


### 🎸 Features

* **auth:** add selector for users department ([8a8f925](///commit/8a8f9255037df07977d03be0b4eded21e5d50402))
* **cdba:** add translations for key account ([039590c](///commit/039590c16872cf6851914fcbbe3d8513e9d0e6fb))
* **cdba:** add user department to ai telemetry data (DSCDA-2216) ([e4a7d42](///commit/e4a7d42c76bc17841dcdf473d786d84ddffaa911))
* **cdba:** added routing for compare page (DSCDA-2230) ([80cee0f](///commit/80cee0f4af109bc0ba8103f9266250467f82791a))
* **cdba:** show average price in pricing detail widget (DSCDA-2218) ([0441bbb](///commit/0441bbb4a9ad790062b5c88d223e25927aaa2b53))

## [1.16.0](///compare/cdba-v1.16.0...cdba-v1.15.3) (2021-02-16)


### 🎸 Features

* **cdba:** support different material number notations in filter (DSCDA-2128) ([671e864](///commit/671e8644ec0a8c8cc5b27349cc5dade49ad8c82e))
* **transloco:** support cache busting (DSCDA-1780) ([b3977ae](///commit/b3977aefd6534d8be3689f2240bac6f4b5861fa8))

### [1.15.3](///compare/cdba-v1.15.3...cdba-v1.15.2) (2021-02-02)


### 📈 Improvements

* **cdba:** provide custom echarts bundle (DSCDA-2147) ([341001a](///commit/341001ae033bb12e5858b85103d8657737ba4a7d))


### 🐛 Bug Fixes

* **cdba:** fix translation issue for range filters ([2bbc5bd](///commit/2bbc5bd41473edce4e6a312e2a450f5abca9cbf6))

### [1.15.2](///compare/cdba-v1.15.2...cdba-v1.15.1) (2021-02-01)


### 📈 Improvements

* **cdba:** add format hint to autocomplete filters (DSCDA-2162) ([8a528e9](///commit/8a528e94ec5ffe5b930abd004dd307c3c45a58b8))

### [1.15.1](///compare/cdba-v1.15.1...cdba-v1.15.0) (2021-01-27)


### 🐛 Bug Fixes

* **cdba:** always show selected BoM (DSCDA-2153) ([b8ac27b](///commit/b8ac27bfcdfde8a1406b60fcaab79fd203ce3a8c))

## [1.15.0](///compare/cdba-v1.15.0...cdba-v1.14.0) (2021-01-18)


### 🎸 Features

* **cdba:** show info message when a pcm row was selected (DSCDA-2133) ([da79107](///commit/da79107f8b4cbdc0193cfae52ff69ad9f14392ef))
* **cdba:** show pcm chip in reference types table (DSCDA-2134) ([8c37bcb](///commit/8c37bcbb383f013c65d19ed356f5be0ce2bd6d90))

## [1.14.0](///compare/cdba-v1.14.0...cdba-v1.13.0) (2020-12-14)


### 🐛 Bug Fixes

* **cdba:** restore stored column order (DSCDA-2080) ([da8fa27](///commit/da8fa277fbcb01d0438ac311b3b4a6743fc76b8e))
* **cdba:** show customer group on detail page ([4513482](///commit/451348204559ebc1c161e49441abe8ace23a7163))


### 🎸 Features

* **deps:** update to nx 11 and fix jest setup ([4df2df3](///commit/4df2df38f8a3fa29abae9b9f736e7d237344541b))

## [1.13.0](///compare/cdba-v1.13.0...cdba-v1.12.0) (2020-12-02)


### 🎸 Features

* show column costing version ([56865c8](///commit/56865c8fedbe048a3f5e5d356f2a08d15f08296a))


### 📈 Improvements

* **cdba:** adjust login behaviour to be less confusing (DSCDA-2086) ([e9129e6](///commit/e9129e6fada5fb76989dc5620e833d93e7c5a559))

## [1.12.0](///compare/cdba-v1.12.0...cdba-v1.11.0) (2020-11-30)


### 📈 Improvements

* **cdba:** show rfq number in calculation table (DSCDA-2068) ([9d02947](///commit/9d02947cef50e2a5de3720b13a3d9d76d429f0da))
* **workspace:** show border for tool panel in ag grid ([ce08056](///commit/ce08056cdd9b26519d4b90e4f10568d4a5385b87))


### 🎸 Features

* **cdba:** add lazy loaded compare module (DSCDA-306) ([82d2ffb](///commit/82d2ffbe9ebe8432862ee3c145e908e741866375))
* **cdba:** show level-2 (range) filters (DSCDA-1998) ([9f11e69](///commit/9f11e6927884614375896bfaa6c2d47f5a103c77))
* **goldwind:** cdba ([69b1c8a](///commit/69b1c8a39c52dfbd5ddf8ac5e11336eef90dfd92))

## [1.10.0](///compare/v1.11.0...v1.10.0) (2020-11-09)


### 📈 Improvements

* **cdba:** adjust to use shared http lib (DSCDA-2037) ([dbb7869](///commit/dbb7869e2233816dba98b4ba8bc07895fd0d2a5b))


### 🎸 Features

* **cdba:** add application insights to application (DSCDA-2032) ([7ab80f3](///commit/7ab80f3b8b824a293f4621f7db087b231d582b89))
* **cdba:** add menu items in column menus (DSCDA-1915) ([8af4f4b](///commit/8af4f4bd0cb86baef2aa60dfbf7593d84c04f99c))
* **cdba:** reduce column content length (DSCDA-1904) ([6f77164](///commit/6f77164a7c5688fb60627c04c50a96826e54e226))

## [1.9.0](///compare/v1.11.0...v1.9.0) (2020-11-06)


### 🎸 Features

* **cdba:** add menu items in column menus (DSCDA-1915) ([8af4f4b](///commit/8af4f4bd0cb86baef2aa60dfbf7593d84c04f99c))
* **cdba:** reduce column content length (DSCDA-1904) ([6f77164](///commit/6f77164a7c5688fb60627c04c50a96826e54e226))


### 📈 Improvements

* **cdba:** adjust to use shared http lib (DSCDA-2037) ([dbb7869](///commit/dbb7869e2233816dba98b4ba8bc07895fd0d2a5b))

### [1.7.2](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.8.0...v1.9.0) (2020-10-27)

### 🐛 Bug Fixes

* **cdba:** fix design of grouped columns (DSCDA-1939) ([57716d8](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/57716d839a15994cafa9601449d69c7cfd457d5f))
* **cdba:** reduce row height of bom table (DSCDA-2021) ([f0fa40b](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/f0fa40be44b3753daed371fa6829c65ff2b4753b))
* **cdba:** show last columns in ref types table again ([c8344a2](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/c8344a244b9fa6ea77e614500ba36846175ddead))
* **cdba:** supress csv and excel export of bom table ([c741d3a](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/c741d3a811eb31ec6661439a493f09764110459f))


### [1.7.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.7.0...v1.7.1) (2020-10-12)


### 🐛 Bug Fixes

* **cdba:** fix synchronisation of column state with local storage ([a36e746](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/a36e746f9169be980f7b4da71f7e2bb7ab135f7a))
* **cdba:** rename column to work center ([40ec79c](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/40ec79c680635f180dfc9ab1ac10eb1b0a8a0ca6))

## [1.7.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.6.0...v1.7.0) (2020-09-28)


### 🎸 Features

* **cdba:** add localization to tables ([d15cc0f](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/d15cc0f5892de0ebac679d469e38cad0c0d6ca05))


### 📈 Improvements

* **cdba:** show dashes in material numbers (DSCDA-1928) ([c130ff1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/c130ff1d57187d9dcc5507ae80e6d164ebfdc597))
* **cdba:** support ids within local search (DSCDA-1960) ([ccd57bb](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/ccd57bb5518d3c6cbd00db9a9e1d787870d47e8d))

## [1.6.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.5.0...v1.6.0) (2020-09-11)


### 🎸 Features

* **cdba:** add bom pareto chart in additional info widget (DSCDA-1967) ([6f89e4d](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/6f89e4df9714e3770ce7c0e07ef4a7c85409eca9))
* **cdba:** add calculations table in additional info widget (DSCDA-1747) ([43a7816](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/43a781608a46b0de73b7d25335c7bf71891d3593))
* **cdba:** add legend for bom chart (DSCDA-1968) ([6b9025c](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/6b9025c4c1038c736546c75033e1be25b692a71d))
* **cdba:** show additional information overlay (DSCDA-1688) ([8c9237b](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/8c9237ba56c4bfb29ff9c7790bfbbebe53e8dc56))
* **deps:** update to angular v10.1 and typescript 4.0.2 ([edc0bb1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/edc0bb1d32af1b0b585de3f79bc96eaf393c240e))


### 📈 Improvements

* **cdba:** always show loading spinner for bom table when loading ([f15df66](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/f15df66c16ae86b2422f052a9caea9f19e1b5345))
* **cdba:** improve chart visualisation (DSCDA-1977) ([1c1662d](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/1c1662d1edf3dc7494fec71005942a3caa1f46d4))

## [1.5.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.4.0...v1.5.0) (2020-08-27)


### 🐛 Bug Fixes

* **cdba:** use correct labels for quantities (DSCDA-1965) ([bcd8069](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/bcd80698c4fd737e08e0e2cbba1962c168ffe5aa))


### 🎸 Features

* **cdba:** update REST API to support ref type uniqueness (DSCDA-1898) ([da6ece4](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/da6ece426f84ed604f6d3750f9cc305a67321cde))
* **styles:** make styles lib publishable (UFTABI-2916) ([245e355](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/245e355c6de4dafff18bdf03301074adb41669c3))

## [1.4.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.3.0...v1.4.0) (2020-08-12)


### 🎸 Features

* **cdba:** improve decimals of prices ([e9ec7ec](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/e9ec7ec3de343eaf288dbc9eab34df88e72d315c))


### 🐛 Bug Fixes

* **cdba:** route to not found on invalid URL (DSCDA-1899) ([2a8e8e1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/2a8e8e156b59c25d03b4a118928e84c8a6038893))
* **cdba:** stop loading spinner on error (DSCDA-1925) ([3d2dbe6](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/3d2dbe67966cac7730382d2771fdf79deb3a9d8c))

## [1.3.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.2.0...v1.3.0) (2020-08-07)


### 🎸 Features

* **auth:** make auth library publishable (UFTABI-2636) ([26833ff](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/26833ffdccd5dc448e99130de7fd240462721e02))
* **cdba:** add calculation table (DSCDA-1744) ([526a8bf](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/526a8bfd2c13ea97d5468111ce10049cf91c3018))
* **cdba:** add empty state to drawings widget (DSCDA-1867 ([91f240e](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/91f240e667fe9579e0266e91560018664bd813f0))
* **cdba:** add new favicon ([24e181b](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/24e181b2b0561e0ffec3e7ca65ef99568d550a90))
* **cdba:** autofocus autocomplete input on open (DSCDA-1887) ([14c9d4d](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/14c9d4d8e111a26c812ca109d2d4f551a765a586))
* **cdba:** error handling of REST calls (DSCDA-1860) ([47777ef](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/47777ef47904cd032b1af5339a10390f3a20c9d8))
* **cdba:** improve app styling ([d531fc9](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/d531fc975d0f041eaace223a551643e4c3aef8c0))
* **cdba:** integrate BOM (DSCDA-1687) ([d655927](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/d655927406895b0c7315b37ed313dc6df605c655))
* **cdba:** only update filters when necessary (DSCDA-1809) ([665f418](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/665f4180f21806f2044816ab344a1cb010e8ba16))
* **cdba:** remove drawings tab (DSCDA-1859) ([e88582c](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/e88582c698c44d501bfda2d3529ac1bd126ac84c))
* **cdba:** remove flickering loading bar ([750ce3b](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/750ce3b4fd67c05d8f23261e7b1d7f795dfcfed3))
* **cdba:** use loading spinner for each widget (DSCDA-1861) ([28763a7](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/28763a78de94fb029586077a362add07b4f193e6))
* **empty-states:** migrate lib to publishable lib (UFTABI-2635) ([977435f](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/977435f2481c68dcb842cbe3f3aaa93302e0175d))
* **sta:** use shared auth library (UFTABI-2265) ([3eb7c69](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/3eb7c69b3c6aec1b05766205d06f87ce4c821d7a))


### 🐛 Bug Fixes

* **cdba:** always show checkbox in ref types table (DSCDA-1812) ([003ace7](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/003ace79541cd5ccafdb5d4ec524eb84d480b6f2))
* **cdba:** back button on detail page navigates to search (DSCDA-1874) ([3fac057](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/3fac057919dc7770401b8fccdfe21a086cc30244))
* **cdba:** enter should not break filter (DSCDA-1900) ([b0de17e](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/b0de17e4e8e163fc0ddac011c612dc963f39739e))
* **cdba:** fix reset button disabled condition (DSCDA-1876) ([16791b2](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/16791b2f7e313984b69a3c07f88799d387f465fc))


### 📈 Improvements

* **cdba:** ensure data consistency on detail page (DSCDA-1844) ([563be60](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/563be6040a5ea18a0e49687949ec7183588a67c7))
* **cdba:** hide range filter (DSCDA-1840) ([a74b1df](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/a74b1df5dfe22530ffa0098eedb768ef8cbae2b4))
* **cdba:** id-value label for product line and plant (DSCDA-1914) ([91d2a96](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/91d2a9605b5bb323e1ed976e0eeb16746b4d7c1b))
* **cdba:** update REST API for unique results (DSCDA-1839) ([658df98](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/658df98c1ed6e7247b6c8e165f4fedd28685dfb2))

## [1.2.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.1.0...v1.2.0) (2020-07-21)


### 🐛 Bug Fixes

* **cdba:** correct localization on detail page (DSCDA-1827) ([f1b34e2](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/f1b34e254a897d2edc48b521753c333b9c09f933))
* **cdba:** fix translation keys ([b49edf9](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/b49edf978484698c5f02bb66e50757511c4f85bf))
* **cdba:** wrong options in filter after update (DSCDA-1813) ([546ca80](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/546ca80bf9d0be2cdd8de600bffffa02c66728ed))


### 🎸 Features

* **auth:** enable code flow (UFTABI-2237) ([d9b4ffa](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/d9b4ffa0452b69f4547db98f0698f8f9d8eabd91))
* **cdba:** add customer details widget (DSCDA-1709) ([4802ab0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/4802ab0ac89c95b5fcc9bf706550efaa40732c70))
* **cdba:** add dimension and wight widget (DSCDA-1705) ([af5bab3](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/af5bab36a2bed95691dba784b895b337ed697627))
* **cdba:** add production details widget (DSCDA-1710) ([506588d](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/506588daa9c24da1801ab2d7eb027a70e9bb192b))
* **cdba:** add quantities details widget (DSCDA-1708) ([a50d5c6](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/a50d5c66e1e92ed59bfe95539ef80ee210274c6b))
* **cdba:** add reducer, rest service, effect and selector for calculations (DSCDA-1745) ([95a81a3](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/95a81a3342140150c03545a50177c7e86fddd1b3))
* **cdba:** add responsive behaviour for filter panel ([3e4c8e0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/3e4c8e0d08f8a5d7d40118a08354c8c721058ae0))
* **cdba:** add rudimentary progress bar (DSCDA-1825) ([29d3bad](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/29d3badf3f2d2fd7ce67a2c3be3ad27512a8d6c5))
* **cdba:** add service and store for detail page (DSCDA-1701) ([45f90c9](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/45f90c9ba3adec1c30fdc716989e17310caa6f9f))
* **cdba:** add subrouting for detail page (DSCDA-1815) ([5e0555d](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/5e0555db2b4f75e556c0961bf9ee42ccb12d74c6))
* **cdba:** add translation for new filters (DSCDA-1806) ([3a3a32e](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/3a3a32e2279dd9924773404fa9ab5769731d8c12))
* **cdba:** added pricing details widget (DSCDA-1704) ([7b7983b](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/7b7983bee7858130d7545523c88c436f3070a7cb))
* **cdba:** added sales and description details widget (DSCDA-1680) ([2a1acf0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/2a1acf00d8d6962726dc3b9f0b011942e0e24467))
* **cdba:** handle 1 character for autocomplete differently (DSCDA-1774) ([6882874](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/68828741cc0d739e1f94e58efefef68f64b181f4))
* **cdba:** show result count for search (DSCDA-1697) ([7d0b581](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/7d0b58166b6f8646ca00d66056f20484c8e161cf))
* **cdba:** update REST API due to new SP call in BE (DSCDA-1771) ([03add37](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/03add377eead113767790e9ef25e983deb590f52))
* **cdba:** use code flow for authentication (DSCDA-1814) ([5e9c6bd](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/5e9c6bdfe13dfa86521d19afe12e4eb3613b0d76))

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
