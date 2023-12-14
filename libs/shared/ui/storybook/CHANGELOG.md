# Release Notes of Library Shared UI Storybook
## [2.0.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/storybook-v1.13.0...storybook-v2.0.0) (2023-12-14)


### ⚠ BREAKING CHANGES

* **footer:** This lib now depends on tailwind. See `Readme` for more details.

* refactor(footer): move footer-tailwind implementation to footer

* refactor: use footer instead of footer tailwind

* refactor: remove footer tailwind entirely

* fix(footer): add missing logo

* chore: dont pass lint in case of errors

* test(footer): fix unit tests of footer

Co-authored-by: Fabian Kaupp <kauppfbi@schaeffler.com>

### Features

* **app-shell:** extend app shell ([#3003](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3003)) ([781c13d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/781c13d61fac9aea94800e5e008cbfbd320de411))
* **app-shell:** implement footer links with custom handlers - [#5435](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5435) ([#5439](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5439)) ([855cd12](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/855cd12ff783c49af9a9f550079826c743c52e94))
* **banner:** migrate to tailwind ([#3666](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3666)) ([d675f67](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/d675f676840a04b6bc79e0c305fde48eaf64d171))
* **breadcrumbs:** add truncation option to breadcrumbs ([#3730](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3730)) ([be468be](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/be468be1ab788fb39b8633ab3bd03e4c030133bd))
* **breadcrumbs:** implement new library for breadcrumbs (DSCDA-2497) ([739d299](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/739d2997880e6c3582352678dcbca29f35901c89))
* **controls:** implement shared rotary control component ([b14824b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/b14824ba5115f3dca86257b0f8fc1701d3c93971))
* **ea:** add qualtrics survey ([#5535](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5535)) ([6f495ce](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/6f495cea0432cb17f521804b149d12d79b9f22e1))
* **ea:** update functional colors ([#5575](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5575)) ([3720963](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/37209638a128263240df2cd73f2eeb9409b6c61a))
* **empty-state:** added maintenance page as empty state ([#3068](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3068)) ([fed8886](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/fed8886ae76f2855309bbd58bebde0995df3d586))
* **empty-states:** increase api for forbidden component (DSCDA-2712) ([45041cf](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/45041cf263df07f2e7edc32d8b76be81e972446d))
* **empty-states:** remove flex layout dependency ([#3656](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3656)) ([696135d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/696135dddcdb1baa423a01554289c65f1e7ec713))
* **empty-states:** remove unsupported viewport component ([72b533f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/72b533ff03c32ffe480495f73505a813aa4dc781))
* enable strictTemplate rule for all libs ([#3323](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3323)) ([55d8aef](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/55d8aefd36823a5774979b7393cbe4dff41ba7de))
* **file-drop:** remove unused shared lib from mono ([#3657](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3657)) ([75d97f1](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/75d97f195039cde0690d86a405554b8ebd269f0a))
* **footer:** reimplement footer based on tailwind (UFTABI-4632) ([#2700](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2700)) ([e54c88d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/e54c88d08e472f2915bc0ce1770eac5b4e9cca07))
* **ga:** add bearing link to medias (UFTABI-6450) ([#5299](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5299)) ([19ae7d8](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/19ae7d86081d9ce796568f01c392d0663157e5e9))
* **ga:** add report toggle ([20c665c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/20c665c49e02f8e6110465bd77431d7dbd33202e))
* **ga:** use actual grease report ([1ba6d82](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/1ba6d828027b13d3f2a9fa84f333e10ec5e44fb5))
* **goldwind:** add china bureaucracy metadata to footer (DIGDTGW-2613) ([#2832](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2832)) ([e755a64](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/e755a641fd739e3baeb8b3def3ddd395fff7995a))
* **header:** reimplement header with tailwindr ([#2712](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2712)) ([8b9b0bb](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8b9b0bb36137d5d2518754a74292afe269f12cc7))
* **horizontal-seperator:** remove shared lib ([#3016](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3016)) ([7221b4c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/7221b4c54ece6899ff3027a523ab9ee0a2f3ea07))
* **inputs:** add filter function as input ([#4309](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4309)) ([05870a7](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/05870a728545e2504d60d6c6da1d743ac1da9433))
* **inputs:** add initial values for select and search control ([#4484](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4484)) ([f4980f7](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/f4980f7214115364a678e30d1a8250c4bec08c98))
* **inputs:** add lib for search and select control ([#4267](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4267)) ([223daf6](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/223daf66d34b5d59c6cb9154a5c3cf7e943837b1))
* **inputs:** add optional tooltip for select trigger ([#4812](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4812)) ([e7bedf3](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/e7bedf34d9c61cd7aed3fe00d323244173a646d3))
* **inputs:** add outer hint for select ([#5330](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5330)) ([308c6a9](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/308c6a9f310e0635d5a29ce16903406fe660dd78))
* **inputs:** add reset and clear button ([#4349](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4349)) ([acb1748](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/acb1748ecd27312d740c3a7ce56dbfb07d04f383))
* **inputs:** add tooltip position option ([#4822](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4822)) ([ee55a85](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ee55a855731f9bb20dbea4f2aac046e6bf4ae111))
* **inputs:** allow disabled option in search ([2948481](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/29484815a0cbfe8d1ab6e06bd172c2ae748f8a4b))
* **inputs:** update search component to support rounded design (UFTABI-6901) ([#5775](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5775)) ([80aee2b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/80aee2bd352ae082431ad844f29d64120d812da5))
* **label-value:** add min-width prop (UFTABI-5236) ([672e908](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/672e90809e4690ed94e6ad25a53bdddba7e8de97))
* **label-value:** allow custom html and components ([78653b2](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/78653b207faae0de25ef3df4529ef0d5a2cdac40))
* **label-value:** extend component ([c0093f2](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/c0093f24213cf143a3c58d611a75964d3bc86e07))
* **label-value:** init new shared component ([#3353](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3353)) ([421e74d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/421e74d2a5994578319704f5c75e9b2193011191))
* **legal-pages:** add shared lib (UFTABI-4848) ([#2687](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2687)) ([8977b28](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8977b281d8adc3bf6705aaff5cb124af8fb8fea9))
* **loading-spinner:** provide option to use bearing loading spinner ([#5331](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5331)) ([276768a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/276768a91a40b470844db7bd23e3b776597a6f5e))
* **mac:** use app shell ([#3140](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3140)) ([3b15f80](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/3b15f806ac6e170b7b3e4c2f7733c40964b459cd))
* **picture-card:** migrate components to mdc base version (5337) ([#5782](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5782)) ([0c8076c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/0c8076c04d769ab53b29480293301e7c4a9ce7c7))
* reduce css bundle sizes ([#3348](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3348)) ([#3377](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3377)) ([1978d74](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/1978d745d959d521f060f51e98ab85a2390612bf))
* remove custom snackbar lib ([5907f54](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/5907f54a6ba0181daf0ac03cc07dbdf43ce59f25))
* replace font styles with m3 standard ([#5211](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5211)) ([0ef134c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/0ef134c2cb41319de679919be47c318f010ce6c5))
* **report:** add json parsing (UFTABI-5021) ([#2825](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2825)) ([4a934e9](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4a934e9ef4edf32ba9302682895f49e06235d0c4))
* **roles & rights:** create new shared library(DSCDA-2748) ([#3231](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3231)) ([654ce26](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/654ce26c91da4feae7dde9d6750f02d1d239e2f1))
* **roles & rights:** extend component api (DSCDA-2750) ([b75870e](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/b75870ebae2f7081609b47e4376a7bb9fe73f6ed))
* **roles-and-rights:** implement "missing" status (DSCDA-2785) ([7ec5577](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/7ec5577e0fbee82f55a6f89a6451269b3712c366))
* **roles-and-rights:** switch to label-value component ([#3353](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3353)) ([a2b680e](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/a2b680e57f691a05b66231166b34e25171593a36))
* **scroll-to-top:** remove shared lib ([#3046](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3046)) ([a437f27](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/a437f272a3027325404a16eee00fe676e67d5e10))
* **share-button:** add share button lib (UFTABI-4939) ([4901165](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4901165a172d95185184fa8acbd870193753240b)), closes [#3031](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3031)
* **shared-subheader:** add story (UFTABI-4892) ([a0b9e39](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/a0b9e39763d80740b81dadc9cc271f8eae42555e))
* **shared-ui:** remove deprecated libs in favour of npm packages ([#3520](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3520)) ([a2bf36b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/a2bf36bf950ba4d8bd1d27ed9754565f9e364b90))
* **snackbar:** add new snackbar story ([#2949](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2949)) ([da4b501](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/da4b5018340766179a1053c0fc79e7df3fe42493))
* **speed-dial-fab:** remove shared lib ([#3047](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3047)) ([2bb7b1f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/2bb7b1f8fafec496f8a3a237451b6a1c248a8d87))
* **storybook:** add button story ([#2950](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2950)) ([f74e404](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/f74e404d178e1f1315cfb89f00c21de65f5723e0))
* **storybook:** add elevation story ([#3120](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3120)) ([ac1c6f3](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ac1c6f3c54ee9c0cb54235db3a471e5757088f4a))
* **storybook:** add figma design tab ([#3040](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3040)) ([0e00bc1](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/0e00bc174a6018395014ca7108d86248f3177283))
* **storybook:** add font story ([#2986](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2986)) ([1c43368](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/1c433680354f04a63ac0ef3141af31093d99a30c))
* **storybook:** add foundation category ([#3444](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3444)) ([#3528](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3528)) ([4416445](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4416445ea139adc1f1cf6fab79029bc8c84b95a0))
* **storybook:** add input stories ([#3814](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3814)) ([#3846](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3846)) ([71fba63](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/71fba633d99b3f1bc8476dad2ed83aa72d6bbd6b))
* **storybook:** add language select to storybook preview ([228992d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/228992dc7116e66f7551679ffed0978b682e46a5))
* **storybook:** add responsive and responsive grid story ([#3412](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3412)) ([3762608](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/3762608f3fed34ce5d15a1dec0217c0a067ec8b5))
* **storybook:** add tabs story and theme tabs ([#3562](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3562)) ([7bc9a3a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/7bc9a3ab9a9c06adfb6240bc7a803c8b450fcc70))
* **storybook:** add tooltip story ([a423f82](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/a423f821875fc99b3a3b27db6d5a3e66ac478973))
* **storybook:** add viewport configs ([#3404](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3404)) ([642e7fb](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/642e7fb3c91db2916d29935a1e53f43c33e4e250))
* **storybook:** adjust categories and labels ([#3543](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3543)) ([178efdd](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/178efdd831ef42541ac57b2b52b9dce2832ea54c))
* **storybook:** adjust tooltip according feedback ([593c262](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/593c26298704a0dc6fa8031675e547ef76a4be6c))
* **storybook:** categorize remaining stories ([#3913](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3913)) ([#3935](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3935)) ([35348f3](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/35348f350eb591dd4d58b6d71ea8436a48700b18))
* **storybook:** complete tooltip ([f79b8ad](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/f79b8addc020feec4d1cde5ed6d5367997722904))
* **storybook:** improve tooltip on touch devices ([#3420](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3420)) ([5955286](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/5955286200268940fcfbe2045ca3aa12e2a84ae5))
* **storybook:** introduce badges and maintain story navigation ([8285bfb](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8285bfb5fb64353e81fc3367655b011225bc756d))
* **storybook:** migration to 6.3 (UFTABI-4341) ([#2831](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2831)) ([e1b3897](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/e1b38978f73ec6592ad94aa3e344f68cc6d4d85e))
* **storybook:** update reviewed component status ([#3345](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3345)) ([8e3bd9c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8e3bd9cfd557238e7e4792c8d19973a9b31383ed))
* **style:** add new color variables ([#3391](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3391)) ([072e93c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/072e93cc90858f751717e10e383f87ab2d4c61f6))
* **styles:** add secondary-900 color to tailwind config ([#3962](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3962)) ([77b75ae](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/77b75ae465b1fa0be0c1d37606665c0aa98d289f))
* **styles:** add tailwind to styles lib ([#3573](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3573)) ([#4104](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4104)) ([d32b170](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/d32b170c13de73f90b3a792d9f50f29cede37898)), closes [#3753](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3753)
* **styles:** fix tab styles ([43e30df](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/43e30dff7ee440e5493d671d3aff9571fa598ac3))
* **styles:** provide new orange through tailwind ([53789d1](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/53789d1a34527e9a174b5a4a56d540c7aa9a4b46))
* **subheader:** adds possibility to add a status icon to the subheader ([#4713](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4713)) ([7e8a66f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/7e8a66fdb6d12ab4d4cfe2a5fab3e208e703a245))
* **tailwind:** add nordic blue to text and border color ([#3871](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3871)) ([d0bcf67](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/d0bcf6702c0732f563dd6972d8a5b825e193378d))
* **transloco:** implement locale select ([#3192](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3192)) ([25a3327](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/25a332787edce243876002594a5f8484f77f3427))
* **transloco:** implement shared component "language-select" ([#3191](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3191)) ([a675e8a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/a675e8a14572aec7dfb60da4674738ff2450b67c))
* **ui:** implement shared ui lib "app-shell" (DSCDA-2255) ([b6c84dd](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/b6c84dd93d557660f6d22ff4bd54745ad0e5088e))
* **view-toggle:** add disabled state to view toggle ([#4629](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4629)) ([59f764a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/59f764a548c8452ff3af4f47da80f782324879c1))
* **view-toggle:** add view toggle lib ([#4628](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4628)) ([c30f8a7](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/c30f8a72cbe6cb6c15b5083649c5b87193669f8c))
* **view-toggle:** added possibility to add icons to view-toggle component (GQUOTE-1985) ([#4872](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4872)) ([63b6bb1](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/63b6bb1c7d7d7f125dd2c651a611bf229e7756cb))
* **view-toggle:** refactor view-toggle to get active view from parent component (GQUOTE-2026) ([#4894](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4894)) ([6e7a128](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/6e7a1284287aa30183b4841ff272fa5137251f99))
* **workspace:** individual project configurations instead of one global ([#3248](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3248)) ([ba451ef](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ba451ef87c9c9cff99440b9739c9ebf4069a16dc))


### Bug Fixes

* adjust chinese translation ([afafac1](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/afafac1ed24d53c9b6c7e2a3bc964aae4212d045))
* **app-shell:** prevent ios content clipping (UFTABI-5207) ([#3331](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3331)) ([55e8386](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/55e8386108f249e08d5e0c83e4156a13a6a23de6))
* **banner:** adjust according review ([576ac7c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/576ac7caeb1189d6449ee5b08aa61fdc6e821c7f))
* **banner:** adjust icon logic to be more robust, adjust storybook ([604155d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/604155d2a50a8b9d446426cb31b3608ca555bfe6))
* **inputs:** fix error content projection ([#4314](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4314)) ([e2366e2](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/e2366e23dd4c08339f72f72748daba0688623c21))
* **legal-pages:** terms of use optional ([b37a7db](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/b37a7db3ba4214866eca11371950842aebcc1324))
* **mm:** select fields not working properly (UFTABI-6699) ([#5578](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5578)) ([d4531a5](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/d4531a51e571e2981db0c0fabbed530faf1aa21a))
* **snackbar:** dismiss snackbar on custom action button click ([ad318cf](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ad318cfc0f6bb1b66cb1e34af263e93b2d9b39dd))
* **storybook:** add missing controls to app-shell & subheader ([fb9b47c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/fb9b47cb919d5b12688ca1c9902ff770106d64dd))
* **storybook:** add missing styles and tw config ([09f195a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/09f195ad0fe9f120fc78e5ca1a42de99ee281fdd))
* **storybook:** advance input story ([#3874](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3874)) ([e291f94](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/e291f94a6cd5411e3296eb49b7d4e3f36a380c02))
* **storybook:** fix html format issues ([b488ff6](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/b488ff6b935d31c6521e9ad3b780520c5dfa3084))
* **storybook:** fix story book build and migration ([#5385](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5385)) ([0d7d3bc](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/0d7d3bcf95a0954fe40b5718226c80ee9f0b4446))
* **storybook:** fix transloco usage ([#2705](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2705)) ([463eb94](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/463eb9486fca3c66236f4e0a1b38c4c52d8e5f9a))
* **storybook:** handle terms of use addition ([ff58251](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ff58251736791a4a103e25ee342310b321a1f248))
* **storybook:** make it possible to test placeholders in input story ([c888656](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/c888656cb293a5ccd090a533a2301cc3836320a5))
* **storybook:** remove fonts and adjust icons (UFTABI-5078) ([#2962](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2962)) ([4bcba1a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4bcba1aaf7b1c7314cd9d42da295ff1b263668e4))
* **storybook:** set correct glob pattern for dependencies tailwind classes ([ef12d33](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ef12d33c16fdb9e787cabee5d23ff93dee3f5ac4))
* **storybook:** use correct tailwind preset import ([841a8b7](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/841a8b7ae11ff3df6071eb869463d65815bc14bf))
* **styles:** adjust button styles ([6ba322c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/6ba322c0df6601920d414404d7f06af18fb31526))
* **styles:** adjust button styles according review ([#3060](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3060)) ([e04aa04](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/e04aa04d00e93ea918eb9d8fd5673512c2fb5522))
* **workspace:** correct style button and font regressions ([93b8427](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/93b8427b40554a19024ea30d765c546965d2f0e9))
* **workspace:** fix storybook support for mat-icons and notes ([7eb42a1](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/7eb42a17cc948ec037eae7158b6854392090b7a6))
* **workspace:** style button and font regressions cleanup ([#3015](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3015)) ([85f704c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/85f704c9d644da7e3f30b5d6c90a91b42a5226e1))


### Reverts

* Revert "chore(storybook): remove build config" ([a60d5b8](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/a60d5b8c316a8189d000cd835ed4662dbd867310))
* Revert "chore(workspace): upgrade to tailwind 3" ([8e56642](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8e56642bb0989b9fc5b201b05a7b130405b441cc))

## [1.13.0](///compare/storybook-v1.13.0...storybook-v1.12.0) (2021-05-20)


### 🎸 Features

* **autocomplete:** add a search-autocomplete lib (UFTABI-3723) ([d979837](///commit/d979837a0e3390ae8cd43ad64b1713d40f7b69bd))
* **empty-states:** parametrize under construction component (DSCDA-2382) ([9d407f3](///commit/9d407f3f637824a5f9d30310a088115238376624))
* **report:** add shared ui report component (UFTABI-4104) ([4418486](///commit/4418486859c3ea2045e4c7698131e33fb49e68b8))
* **stepper:** adjust stepper to be compatible with MM (UFTABI-4470) ([80792a6](///commit/80792a6b7378d4ad34992e8ad26367015eadb48f))

## [1.12.0](///compare/storybook-v1.12.0...storybook-v1.11.0) (2021-04-29)


### 🎸 Features

* **horizontal-separator:** add Horizontal Separator UI lib (UFTABI-3725) ([7ad30ba](///commit/7ad30ba7d38dfb074dca190d8425ff7110243909))
* **loading-spinner:** add loading spinner ui lib (UFTABI-3691) ([a5306de](///commit/a5306ded9570347792480d2aa26223b6111c46eb))
* **transloco:** update transloco testing module (UFTABI-4323) ([47630c6](///commit/47630c62ca451d70e613182684fc34506a34705a))

## [1.11.0](///compare/storybook-v1.11.0...storybook-v1.10.1) (2021-03-24)


### 🎸 Features

* **dropdown-input:** add dropdown input component (UFTABI-3593) ([1cf36ca](///commit/1cf36caeff37a89a5eaa5eaa23c1304bb80e8066))
* **header:** allow links in header title  (UFTABI-3751) ([0193893](///commit/0193893576f6d63d89b5763d2e0414d58f32a467))
* **picture-card:** create picture card (UFTABI-3590) ([0e5e11b](///commit/0e5e11b54e2444b4b04b99e5d2356034dd8f8fc1))
* **stepper:** add a mobile-friendly stepper (UFTABI-3641) ([fd81bdd](///commit/fd81bdd79eec74fb3bd15ad004ff316491602d3f))
* **storybooks:** allow tailwind styling in storybooks (UFTABI-3850) ([ee1ec06](///commit/ee1ec0675b2c7a4b5f589a73d0f8a46dc64d1144))

### [1.10.1](///compare/storybook-v1.10.1...storybook-v1.10.0) (2021-01-22)


### 🐛 Bug Fixes

* **workspace:** always set correct lib name in root changelog (UFTABI-3417) ([663b1fa](///commit/663b1fa843447402f85f423cf2906e4c3bb331e4))
* **workspace:** ensure loading of global jest configuration ([777e2e5](///commit/777e2e5f58b7c11b53d03dc0c698c2e399ec3298))

## 1.10.0 (2020-11-25)


### ✏️ Documentation

* **empty-states:** update empty states docs (UFTABI-2748) ([5d2a8d9](///commit/5d2a8d9b90172eea026e4368fefb4baf434b3d75))


### 🐛 Bug Fixes

* **storybook:** fix translation issues of empty states (UFTABI-2747) ([f52ddf6](///commit/f52ddf6ca7efeca9025b573c160f4674f09d95a2))
* enable page not found story ([4c9405e](///commit/4c9405eff36f2edc95f15a366956dcfeb6715b04))


### 🎸 Features

* **banner:** add storybook stories (UFTABI-2511) ([0168a1a](///commit/0168a1a8edbca9817a571d220d73f35ae9a1d1da))
* **deps:** update storybook to v6 (major) ([f2af3c1](///commit/f2af3c1775dc23c308bb78246affd46a5940c5af))
* **empty-state:** use view engine for build (UFTABI-2917) ([34a16b1](///commit/34a16b189b73e97dd86d10bbf936a836468ac0f3))
* **empty-states:** adjust language file loaders to best practice (UFTABI-2477) ([0c77432](///commit/0c77432220b228e35108494de32872e3d8b7fcb8))
* **empty-states:** migrate lib to publishable lib (UFTABI-2635) ([977435f](///commit/977435f2481c68dcb842cbe3f3aaa93302e0175d))
* **libs:** use view engine and prevent barrel imports in banner and transloco (UFTABI-2733, UFTABI-2741) ([79024d5](///commit/79024d550448ec650a612566e85009158fb9788f))
* **scroll-to-top:** add storybook stories (UFTABI-2514) ([397c2a6](///commit/397c2a69454f043eaab4cb6b474dcdcafa5965ef))
* **settings-sidebar:** add storybook stories (UFTABI-2515) ([fd67e76](///commit/fd67e760086bc3baf13c53ca954678ec5dfec4a6))
* **sidebar:** add storybook stories (UFTABI-2516) ([983ff75](///commit/983ff7543a52c564b3b60c5d02f2b438a3a19fa1))
* **snackbar:** add story for snackbar ([de3debd](///commit/de3debdcd5cb1d73f44307014c21f74f2a791c1c))
* **speed-dial-fab:** use view engine and prevent barrel exports (UFTABI-2739) ([95cf204](///commit/95cf204f4d7420cd366f7453da41a3c98946df59))

### [1.9.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.9.0...v1.9.1) (2020-11-02)

### [1.9.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.9.0...v1.9.1) (2020-10-27)

### [1.7.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.7.0...v1.7.1) (2020-10-12)

### [1.6.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.6.0...v1.6.1) (2020-09-28)

## [1.6.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.5.0...v1.6.0) (2020-09-11)


### 🎸 Features

* **empty-state:** use view engine for build (UFTABI-2917) ([34a16b1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/34a16b189b73e97dd86d10bbf936a836468ac0f3))

## [1.5.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.4.0...v1.5.0) (2020-08-27)


### 🎸 Features

* **deps:** update storybook to v6 (major) ([f2af3c1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/f2af3c1775dc23c308bb78246affd46a5940c5af))
* **libs:** use view engine and prevent barrel imports in banner and transloco (UFTABI-2733, UFTABI-2741) ([79024d5](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/79024d550448ec650a612566e85009158fb9788f))
* **speed-dial-fab:** use view engine and prevent barrel exports (UFTABI-2739) ([95cf204](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/95cf204f4d7420cd366f7453da41a3c98946df59))

### [1.3.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.3.0...v1.3.1) (2020-08-12)


### ✏️ Documentation

* **empty-states:** update empty states docs (UFTABI-2748) ([5d2a8d9](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/5d2a8d9b90172eea026e4368fefb4baf434b3d75))


### 🐛 Bug Fixes

* **storybook:** fix translation issues of empty states (UFTABI-2747) ([f52ddf6](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/f52ddf6ca7efeca9025b573c160f4674f09d95a2))
* enable page not found story ([4c9405e](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/4c9405eff36f2edc95f15a366956dcfeb6715b04))

## [1.3.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.2.0...v1.3.0) (2020-08-07)


### 🎸 Features

* **empty-states:** migrate lib to publishable lib (UFTABI-2635) ([977435f](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/977435f2481c68dcb842cbe3f3aaa93302e0175d))

## [1.2.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.1.0...v1.2.0) (2020-07-21)


### 🎸 Features

* **empty-states:** adjust language file loaders to best practice (UFTABI-2477) ([0c77432](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/0c77432220b228e35108494de32872e3d8b7fcb8))

### [0.5.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v0.5.0...v0.5.1) (2020-07-01)


### 🎸 Features

* **banner:** add storybook stories (UFTABI-2511) ([0168a1a](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/0168a1a8edbca9817a571d220d73f35ae9a1d1da))
* **scroll-to-top:** add storybook stories (UFTABI-2514) ([397c2a6](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/397c2a69454f043eaab4cb6b474dcdcafa5965ef))
* **settings-sidebar:** add storybook stories (UFTABI-2515) ([fd67e76](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/fd67e760086bc3baf13c53ca954678ec5dfec4a6))
* **sidebar:** add storybook stories (UFTABI-2516) ([983ff75](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/983ff7543a52c564b3b60c5d02f2b438a3a19fa1))
* **snackbar:** add story for snackbar ([de3debd](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/de3debdcd5cb1d73f44307014c21f74f2a791c1c))
