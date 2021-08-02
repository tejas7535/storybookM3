 Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
**Note:** Dependency updates, refactored code & style/test/performance changes are not shown within this changelog. Thus, releases without any entries may occur.

## [1.17.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/gq-v1.17.0...gq-v1.16.0) (2021-08-02)


### 🐛 Bug Fixes

* **gq:** fixed lint rules ([d0d448f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/d0d448f9097d0b259ab8421b4677fdcb564528fd))
* **gq:** fixed Price Difference % not correct concerning Price Unit > 1  (GQUOTE-775 ) ([8bd23be](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8bd23be509c73095e9c2f41f7cc7a1e25c4d76bb))


### 🎸 Features

* **gq:** add position counter to work area (GQUOTE-565) ([8611832](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8611832403dd254ddcfc95d51971cecd7c501b4c))
* **gq:** added last offer data to workarea (GQUOTE-629) ([a4e423c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/a4e423cb0e78fd4f27e8c53381d11465ef3f2073))
* **gq:** added lastCustomerPriceDate as column on workarea ([2efda37](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/2efda376560a860b252ba83ef92bfb23e5ab4d48))
* **gq:** added summary page to excel export (GQUOTE-692) ([687124d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/687124d36114b8bab2c2d81cf54a6b720997211a))
* **gq:** display notification on reimported quotation (GQUOTE-747) ([aa2cae3](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/aa2cae3be0720b98494d89c3447a3bfac6277acc))
* **gq:** displayed relocation cost and plant data (GQUOTE-615) ([ca0d57a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ca0d57a141bd9f76d6d40f748c9a829ee5d5813d))
* **gq:** removed limit for create manual case (GQUOTE-767) ([038f3e8](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/038f3e8e689157d6b866475ffa6ccd4de16e9369))

## [1.16.0](///compare/gq-v1.16.0...gq-v1.15.1) (2021-06-30)


### 🐛 Bug Fixes

* **gq:** displayed gpm on detail view ([1bb62c4](///commit/1bb62c4e292df1246eb4b49995b97c6b8fe0ef8d))
* **gq:** fixed gpm calculation issue ([b0c569a](///commit/b0c569a1516c032b7527d5131efdd1bfc856dac5))
* **gq:** fixed unselect customer bug ([348c722](///commit/348c7228c58dc8f19028d80c211bf0cdfeeaecde))


### 🎸 Features

* **gq:** added breadcrumbs (GQUOTE-631) ([539eb0d](///commit/539eb0d5e533baaca21c406e93ac4aeeba9ee400))
* **gq:** added buttons and migrated to tailwind (GQUOTE-681) ([d3d77da](///commit/d3d77da1a41c2074b2b628e25826b72f96b75d89))
* **gq:** added clickable links (GQUOTE-632) ([4061dc3](///commit/4061dc350fd8aaeb176d875298d474149c26aeef))
* **gq:** added confirmation pop ups (GQUOTE-698) ([8cde5a1](///commit/8cde5a11140b0e83abc08fbe7d1a52bf7b7eb152))
* **gq:** added create-customer-case ui (GQUOTE-659) ([3e7d8c9](///commit/3e7d8c90f2e50df0ac75712c2eae3dca232ae480))
* **gq:** added dropdowns for pl and series (GQUOTE-657) ([1b0c262](///commit/1b0c262d1134bd6c0a1c2adc19b45ca5bb79ba2e))
* **gq:** added icon to paste from clipboard (GQUOTE-725) ([086a10c](///commit/086a10c00b210fde395cc2d849cec89f6f0243ab))
* **gq:** added modal for changing quantity (GQUOTE-652) ([017f6cf](///commit/017f6cf8f5cec31c5c867350790bfc6c9d7be5a5))
* **gq:** added progress text on calculation progress (GQUOTE-744) ([887b516](///commit/887b516bf10780464724aa268240b60abb1d6dea))
* **gq:** added rest call to create case button (GQUOTE-658) ([34c07f1](///commit/34c07f1c71a249cdc2c4aade11f7eeb763365ca4))
* **gq:** added strict template check (UFTABI-4624) ([dd0c1da](///commit/dd0c1da564de63af26e0950c9658ef0a1df41fa3))
* **gq:** migrated to new footer (GQUOTE-711) ([a9c6dbd](///commit/a9c6dbdcdcf08751fc4cd62fbd9ff418cfa17fec))
* **gq:** removed addedToOffer (GQUOTE-569) ([1eba424](///commit/1eba424736251c8799c159e48321ab6b5fa9c956))
* **gq:** reworked manual case modal (GQUOTE-572) ([640eb40](///commit/640eb40ca044153b25be4e3a3905248dd92e40d1))
* **gq:** splitted case creation into two pop ups (GQUOTE-682) ([4d2ec31](///commit/4d2ec31fa6ef6275ec815844594b24b81e8d8954))
* **workspace:** fix accessibility and numerical separator issues (UFTABI-4728) ([699fb97](///commit/699fb97a63a9069d847dfa489386da561028e5ea))

### [1.15.1](///compare/gq-v1.15.1...gq-v1.15.0) (2021-05-20)

## [1.15.0](///compare/gq-v1.15.0...gq-v1.14.1) (2021-05-19)


### 🏭 Automation

* **workspace:** adjust lint rules (UFTABI-4456) ([bcd52ff](///commit/bcd52ffddcf2011986085d510bc54488903a90dc))


### 🎸 Features

* **gq:** added customer currency to transaction view (GQUOTE-662) ([63ef01b](///commit/63ef01bde7158023129cd5e771b25d24c00b3c1c))
* **gq:** added customerMaterial ([39f870d](///commit/39f870d1c0965f76b1f1308177abf74ab0198bba))
* **gq:** added info icon to table ([c7679b9](///commit/c7679b9ab6f183f5752bf921d2b1e06057e22ff7))
* **gq:** added info icon to transaction-view header (GQUOTE-642) ([91caba7](///commit/91caba7e7e5e6d3f625765f5bb8e9f977f154837))
* **gq:** added marginXprofitMargin graph to transactions view(GQUOTE-360) ([3b70bfa](///commit/3b70bfa1186f94ca93663e4f806cf5e6fa452c31))
* **gq:** added quotation_item_id to manual cases (GQUOTE-570) ([0c2a836](///commit/0c2a836fac907a1d60be6a24ad91bdaa31755ff5))
* **gq:** added regression line to marginXquantity graph(GQUOTE-638) ([ed62036](///commit/ed6203692abee9dfd12532bc049b7a726244ed2c))
* **gq:** added routing and blank page for transactions (GQUOTE-619) ([8030b21](///commit/8030b21426438ff627ee3c5a14a13ccb67466a86))
* **gq:** added transactions table (GQUOTE-606) ([42b9ec4](///commit/42b9ec4aba5026eb585eec4f6435a6c85c3f5b93))
* **gq:** calculated and displayed gpm (GQUOTE-365) ([b03ccfb](///commit/b03ccfb9d0d71dae36f29ed392c162b638fc6e83))
* **gq:** changed customer identifier naming ([7175637](///commit/7175637bc799ae10edc5772a25c4dcb120793dd4))
* **gq:** created basic layout for transaction page (GQUOTE-618) ([f71f072](///commit/f71f0729988ce35e15e36c11d6106908a1fb344a))
* **gq:** display manual price details (GQUOTE-510) ([e0d60a0](///commit/e0d60a07a5db5ea2e5bd67d847c37e281f5bf4ff))
* **gq:** display priceUnit column (GQUOTE-604) ([613cb77](///commit/613cb776c02c9f357febfb33cc6fc07c0fecc9d9))
* **gq:** edit manual price directly in table (GQUOTE-509) ([5bcde2d](///commit/5bcde2d40a2fa6dc7e737034df1fcb3c62face91))
* **gq:** saved user column settings (GQUOTE-586) ([d547f39](///commit/d547f39dcaf92acf06b3fef9efa1d7836a497f3d))
* **transloco:** update transloco testing module (UFTABI-4323) ([47630c6](///commit/47630c62ca451d70e613182684fc34506a34705a))


### 🐛 Bug Fixes

* **gq:** disabled upload-offer for manual cases (GQUOTE-595) ([11041a7](///commit/11041a7f1d96b991c0264df23b6d2d6178604421))
* **gq:** fixed priceUnit bug (GQUOTE-673) ([9aee6c9](///commit/9aee6c9827b2b0f6bb720c47a4c2b0af58d14191))
* **gq:** fixed quantity and adding items ([3f3bea5](///commit/3f3bea5372b400abde07fb30e9d0740c51f314a6))
* **gq:** removed automotive roles ([f18de57](///commit/f18de574d2c830b9e75a354ccd95d7f52f20cd04))

### [1.14.1](///compare/gq-v1.14.1...gq-v1.14.0) (2021-04-13)


### 🐛 Bug Fixes

* **gq:** enable upload to SAP on prod (GQUOTE-591) ([ca1879c](///commit/ca1879c43582f4ac0a4ce337ada6adc9fd898c7e))

## [1.14.0](///compare/gq-v1.14.0...gq-v1.13.0) (2021-04-12)


### 🎸 Features

* **gq:** show customer marginDetails (GQUOTE-375) ([bbb4e7a](///commit/bbb4e7ac2cbd43f0ed255bb79c7bf0f419cb1216))


### 🐛 Bug Fixes

* **gq:** changed price source fixed to strategic (GQUOTE-583) ([978b2b4](///commit/978b2b43c2ebf812cdd3793effb7bfa6d1987559))
* **gq:** fixed auth routing issues ([be5241a](///commit/be5241a4a98d13bc7413c4dc58054f18535b857a))
* **gq:** fixed create case bug ([9dfd948](///commit/9dfd9489f2e1080219ab2c58293ddd528ef1e4a5))
* **gq:** fixed error on adding new positions (GQUOTE-584) ([3bc3194](///commit/3bc31949fc505dea257ca8b4ab5a2cd122945fce))
* **gq:** fixed margin formatting bug (GQUOTE-587) ([917d063](///commit/917d063a4e4a244d0a173b699c057509902039f1))
* **gq:** sort sapQuotationItem ascending (GQUOTE-585) ([d4ad248](///commit/d4ad2483994483642f94cb19138d3e6bd090debd))

## [1.13.0](///compare/gq-v1.13.0...gq-v1.12.2) (2021-04-01)


### 🎸 Features

* **gq:** added adjusted translations for prod release ([0becbef](///commit/0becbef43f3445dd4e0d376c522968ac3673347e))
* **gq:** adjusted rest call to set price sources (GQUOTE-423) ([23c7b39](///commit/23c7b395c1859bc8e49941b4cb34949b7367d3ef))
* **gq:** migrate to azure auth lib (GQUOTE-529) ([332d254](///commit/332d2541498bbbd6fa2df2815d3e60a0749acc68))
* **gq:** removed status and synchronized columns ([eb023eb](///commit/eb023ebb92f7ed2d3078bcb789d39fef45588545))


### 🐛 Bug Fixes

* **gq:** fixed added to offer bug ([88b0c4b](///commit/88b0c4b949f5c5a7e2d92e85fc3e268768b3fe3f))
* **gq:** fixed excel download (GQUOTE-468) ([35591ed](///commit/35591edc180fba7354f9f8366d995dbd86d18e48))

### [1.12.2](///compare/gq-v1.12.2...gq-v1.12.1) (2021-03-23)


### 🐛 Bug Fixes

* **gq:** display formatted numbers (GQUOTE-524) ([9cb47bf](///commit/9cb47bf65d4447fda9ad1355c64267133f10785c))

### [1.12.1](///compare/gq-v1.12.1...gq-v1.12.0) (2021-03-23)


### 🐛 Bug Fixes

* **gq:** fixed header bug ([13ff971](///commit/13ff97138039acdf8c74afb36793d0a67f72a50b))
* **gq:** fixed switched sqv and gpc ([cb356a8](///commit/cb356a810428fd663517c5575616df20616e68a7))

## [1.12.0](///compare/gq-v1.12.0...gq-v1.11.0) (2021-03-22)


### 🐛 Bug Fixes

* **gq:** autocomplete material number ignores dashes (GQUOTE-452) ([eaccefd](///commit/eaccefd90319e6ac88e2c1e8eef869d89effb52d))
* **gq:** create case button missing in dialog after adding a detail (GQUOTE-463) ([e10fe28](///commit/e10fe286f48ff35183d5afbb53cb97eff031db78))
* **gq:** internal server error after copy paste (GQUOTE-484) ([b0a2885](///commit/b0a288593cc2fbb6f4d2addd0fd511a9cdcd290e))
* **gq:** update cache when translation keys change (GQUOTE-465) ([378a1a4](///commit/378a1a4d26ceeaf37e24003eba3529d940aaacff))
* **gq:** wrong format of material no in excel export (GQUOTE-457) ([5ee50e4](///commit/5ee50e485b5c1c5bd6e45e1e99daeb7b46443e1e))


### 🎸 Features

* **gq:** added plant masterdata to columns and detail screen (GQUOTE-392) ([d3f21f9](///commit/d3f21f9ba0e054def7ee49e8ff827802fd3865e9))
* **gq:** added upload offer to sap rest call (GQUOTE-376) ([67e5c9c](///commit/67e5c9cc7ef24d50f8d6ecb2f5b34eab59ed38b8))

## [1.11.0](///compare/gq-v1.11.0...gq-v1.10.0) (2021-03-01)


### 🐛 Bug Fixes

* **gq:** calc average margin ([83d2e07](///commit/83d2e07f86856020757da7d3f4834f89806d90df))
* **gq:** empty modal after success, keep data on close (GQUOTE-350) ([a409d20](///commit/a409d20a06ceacb4f9eaf9bfead91a533de49c4e))
* **gq:** fix mat number pasting bug (GQUOTE-270) ([d8fee59](///commit/d8fee593cd9e2d3a9aa8e0a80dc1749ecb7df8e9))
* **gq:** fix quotation error when roles are missing ([98bae72](///commit/98bae724ecf5206103bead040d4c1926534db990))
* **gq:** fix translations for roles ([fb71dbe](///commit/fb71dbe0d608427ecf180311ab93551f89fe3762))
* **gq:** fixed updateMaterials bug (GQUOTE-413) ([dc481cf](///commit/dc481cf7b3a4fd8101b5d3d0dd504bb90e6dfdc4))
* **gq:** import quotation bug ([831cc21](///commit/831cc217ad242c410da1b3a204035e0735d19d4a))
* **mm:** fix empty state styles ([de912f6](///commit/de912f6b2a70e7863c94c868fd9191e4fc958d7f))


### 🎸 Features

* **gq:** add application insight ([f873dcc](///commit/f873dcc5a33e571f4a0364360074071d3634c3f3))
* **gq:** add data to material details (GQUOZE-265) ([7013a39](///commit/7013a39cc5839271c007f61cf1dafae4db7da392))
* **gq:** add favicon (GQUOTE-351) ([d3fa3c5](///commit/d3fa3c5489f3da4f18dd58cf04a4c939f0bd97a4))
* **gq:** add loading spinners (GQUOTE-393) ([17f488a](///commit/17f488a122e024c43cf4386a2f66aa7440ca2325))
* **gq:** add role description modal (GQUOTE-303) ([1f66586](///commit/1f665860b5d8c8949ee0e2621ec1ea98aacd5394))
* **gq:** added percentDiff calculation (GQUOTE-343) ([976cc98](///commit/976cc98da5c4cab49227deffb52b9659808b43c5))
* **gq:** added rest call on select manual price tile (GQUOTE-378) ([4b61b38](///commit/4b61b3887ffdaae1a500bc613fdfc7d6aad4cc47))
* **gq:** added role concept to the application (GQUOTE-281) ([199269f](///commit/199269f65bb7ede3ff22de081f5bd90016860356))
* **gq:** adjust customer autocomplete ([182f6b7](///commit/182f6b7ac4b5f7e03f5c96b411d529c546429eb2))
* **gq:** adjust project structure for shared components (GQUOTE-271) ([89db441](///commit/89db441e64a7de99ecb0b27a52ac1568805483cc))
* **gq:** adjusted FE material validation for new endpoint ([603e8e5](///commit/603e8e5dfc44248fe12f314463f6a1866f5a4832))
* **gq:** adjusted frontend to backend endpoints (GQUOTE-359) ([8f848db](///commit/8f848db25ed6df0dd429114243d29c5f60d89c67))
* **gq:** display gq rating in table ([caf4141](///commit/caf41415fbdfe1e1954319f2291c88341ca99017))
* **gq:** display material-no with dashes ([8791a0f](///commit/8791a0fd9e0a09ab01f526de79b7a44027cca5e8))
* **gq:** displaying Quotation-Case Details in Case Header (GQUOTE-236) ([1c20c22](///commit/1c20c2279edef3f97cee0ddde4005013f267899f))
* **gq:** enable search by material description (QUOTE-421) ([31f9b37](///commit/31f9b3759504da8a84b1cc43fbb81f4e95f622db))
* **gq:** fixed import quotation ([7d345a5](///commit/7d345a5a862d12d94107ca4ebbd7b021a8ab0f0f))
* **gq:** format numbers in table ([3e8a4fb](///commit/3e8a4fb2f9f4c623a110487f57ed4b5363873af4))
* **gq:** recalculate on price selection (GQUOTE-404) ([f2e38a3](///commit/f2e38a30bf42ea1045c39407ac9852bc4cf2ad3b))
* **gq:** refactor case feature store (GQUOTE-358) ([ec64a3e](///commit/ec64a3e575ee7e3ddd71d14aa55275e285e16008))
* **gq:** removed finalRecommendedSellingPrice (GQUOTE-417) ([d7a3eb2](///commit/d7a3eb257f357d29c2d19fa6baedee8caa2181fa))
* **gq:** restructure translation files (GQUOTE-380) ([2277404](///commit/2277404ac3841f84d057ef5b54cdbb97ec43abf5))
* **gq:** save case in the database (GQUOTE-294) ([5ace3e9](///commit/5ace3e925837ec4cdf702bfa348b3c39eaa929a8))
* **gq:** select gq business price (GQUOTE-385) ([0a46caa](///commit/0a46caa8483ce5c98466e733e647c20be4584e49))
* **gq:** show contact information (GQUOTE-396) ([fe19ae3](///commit/fe19ae3f211bb72837e7c72b2d5afaac891a796b))
* **gq:** show currency in price column (GQUOTE-403) ([058bc11](///commit/058bc113f5999e1633dfbebcdcef587cfc9ff956))
* **gq:** show material details from updated object (GQUOTE-400) ([f9ea712](///commit/f9ea71257a1e67f6c51a48927f54b1a4d06bf97a))
* **gq:** transform pasted quantities ([dba09b5](///commit/dba09b53933b7ec095997a1d416e223108269a1e))
* **gq:** use shared ui components ([a4a915e](///commit/a4a915e46809df8b9d37c46d520e7afc355f5bbc))

## [1.10.0](///compare/gq-v1.10.0...gq-v1.9.0) (2020-12-14)


### 🎸 Features

* **deps:** update to nx 11 and fix jest setup ([4df2df3](///commit/4df2df38f8a3fa29abae9b9f736e7d237344541b))
* **gq:** adapt customer details (GQUOTE-266) ([a3dc552](///commit/a3dc5528861440a6fc95d201b34fdda8e8d416ae))
* **gq:** adapt offer slider (GQUOTE-234) ([74ccc7c](///commit/74ccc7c232e4971429c3c76e4b144270abab1dd2))
* **gq:** add adding and removing of materials to a quotation (GQUOTE-81, GQUOTE-187) ([86146d2](///commit/86146d2de7ebce9c17a02ff6c6cdc46bec417992))
* **gq:** add customer name to quotation autocomplete (GQUOTE-233) ([1ec2a20](///commit/1ec2a202fcd7c0596445f20ad4d3feaf5626c04f))
* **gq:** add delete case functionality (GQUOTE-228) ([8445999](///commit/84459996fc3523e518d48d652f9b8c1b5c9750bf))
* **gq:** add loading spinner (GQUOTE-272) ([b158d2c](///commit/b158d2c96d67e1a4c77103eb8fd6330fcbc73221))
* **gq:** add snackbar notifications (GQUOTE-274) ([9aeaed3](///commit/9aeaed323321f54db206576381519c881ff5ae2d))
* **gq:** adjust gq id (GQUOTE-230) ([9c83a06](///commit/9c83a0663b5e06c58d97188fbf022f2757f508f4))
* **gq:** adjust screens to mock up (GQUOTE-237) ([80d0148](///commit/80d01480180bf5b321ed52a23f2083c52b29f19a))
* **gq:** adjustments and bugfixes (GQUOTE-272) ([45726f6](///commit/45726f6f40226845a6626e0853f04434be25f926))
* **gq:** fix comments (GQUOTE-234) ([1b464f0](///commit/1b464f0255684779d2e34cb96f1e78854910372d))


### 🐛 Bug Fixes

* **gq:** adjust gqid ([64ac951](///commit/64ac951129ca091be17a2bfd42779dd745bdf241))
* **gq:** fix bugs with offer table footer ([9bf5991](///commit/9bf599104904a7786f15c684e4493a1a264b3ae7))
* **gq:** fix imports ([640ed00](///commit/640ed006c415ed8a297d1476b1f8b028e994b29f))
* **gq:** show price on slider ([2b30bb9](///commit/2b30bb9ad9ecec7f1e0a5aeac021fd1fac3652ff))

## 1.9.0 (2020-12-07)


### 📈 Improvements

* **workspace:** show border for tool panel in ag grid ([ce08056](///commit/ce08056cdd9b26519d4b90e4f10568d4a5385b87))


### 🎸 Features

* **ci:** enable manual releases (UFTABI-2968) ([a7daa45](///commit/a7daa45700b798bae3340e87400c92288d4dd84b))
* **deps:** update to angular v10.1 and typescript 4.0.2 ([edc0bb1](///commit/edc0bb1d32af1b0b585de3f79bc96eaf393c240e))
* **gq:** add customer input (GQUOTE-141) ([ed7309c](///commit/ed7309c3c160d059f421e793e5eadb83febff182))
* **gq:** add customer view (GQUOTE-180) ([153204c](///commit/153204c6d77386c2d45805a8c108a7881ce7cd6c))
* **gq:** add detail page (GQUOTE-202) ([8935f4e](///commit/8935f4ef04ac538637795bddcc34f60cfab7ca90))
* **gq:** add dialog for querrying table (GQUOTE-111) ([1ade529](///commit/1ade5299975b341c915d2cb50acdb044fca4767a))
* **gq:** Add Excel export to Offer table (GQUOTE-198) ([a8ed4d0](///commit/a8ed4d0a90365caa59e17fe4d8f2a58bbb88f55e))
* **gq:** add http interceptor (GQUOTE-106) ([d97d71c](///commit/d97d71ca1191123317d22b4637702f8092d67216))
* **gq:** add input field according to dropdown selections (GQUOTE-98) ([b526f69](///commit/b526f6920ccb65c04f8f495f5e7671c5bf1eb2fa))
* **gq:** add offer view (GQUOTE-164) ([ce339a7](///commit/ce339a7f44b2785c56174e7ff41a4f9e52a147ab))
* **gq:** add process case view (GQOUTE-150) ([eed8fb9](///commit/eed8fb9ce669959a7779edec58ff66e2514aefc8))
* **gq:** add prod env, add dummy text ([e6cb298](///commit/e6cb2986f29b948bae3c8cd16419485a24a093ed))
* **gq:** add quotation input with autocomplete (GQUOTE-140) ([9002222](///commit/9002222e2c5d60f2a50370458f62e1390e02b588))
* **gq:** added usage of new shared http module with interceptor, removed old autocompl (deprecated) ([7d2c61a](///commit/7d2c61aff7523ecc472a6a8cd02d262b56041f4d))
* **gq:** adjust columns and fake data (GQOUTE-199) ([c6909e6](///commit/c6909e68b7c6296c241938c5c97a9503cb3dfa26))
* **gq:** Adjust Customer data in header (GQUOTE-166) ([ecea7d2](///commit/ecea7d238589f6f416aeb49aa2df1306cf80fe0c))
* **gq:** adjust endpoints (GQUOTE-205) ([78a59c0](///commit/78a59c0affdce4885e17ec0ff167a5e51e7ce864))
* **gq:** adjust process-case table (GQUOTE-167) ([9bf40f1](///commit/9bf40f1bd80e7ca4dcab63e6256f9bdffe5bd361))
* **gq:** button functionality for add to search query (GQUOTE-113) ([847eb7f](///commit/847eb7ff62ab091847b070184922e1362d5eb11a))
* **gq:** clean up frontend (GQUOTE-218) ([f98d12c](///commit/f98d12c83a59adc3d598a55d64e0276625b32f81))
* **gq:** Connect Case view to enpoint (GQUOTE-219) ([247fd2b](///commit/247fd2b0cbd06f661e18aca6e6b3ce23124b3560))
* **gq:** create case screen with table (GQUOTE-210) ([7185455](///commit/71854556cb8cfd2239e120d5bb186aafff2450fc))
* **gq:** create guided quoting application (GQUOTE-100) ([973d76a](///commit/973d76a77d7ceb25b150fcf0b2ae3a083c4a7695))
* **gq:** create store for creating new cases (GQUOTE-133) ([2d3d03d](///commit/2d3d03df4ed6a7d6781e5ff0953daa7879d4f81d))
* **gq:** create store for process quotation case (GQUOTE-149) ([e046e56](///commit/e046e56933d5526fd6c03bfebb02f3ce288993b8))
* **gq:** created modularized app structure (GQUOTE-105) ([669cd6a](///commit/669cd6ab544f2c549f10630980209edb83d10eb0))
* **gq:** Deletable query list item (GQUOTE-114) ([654c6b8](///commit/654c6b847fb7b6192757b624d75f12768e1e0c22))
* **gq:** display total sum and average margin (GQUOTE-200, GQUOTE-201) ([b1d939e](///commit/b1d939e174509b2a3f23a68c9290884de95b2b87))
* **gq:** dummy row with remove and add (GQUOTE-183) ([3053dc8](///commit/3053dc86f22e1e2d6edee80e7ce8f9b63e24f961))
* **gq:** Exclusivity for case creation (GQUOTE-142) ([7f86a99](///commit/7f86a992916c4ec80ff6551536e4047ea97cf4a4))
* **gq:** Input Check for Enabling "Add to Queries" (GQUOTE-29) ([ae4fc96](///commit/ae4fc965b9cca0dfd6088ee90637b4c489d67456))
* **gq:** migrate input section (GQUOTE-108) ([0a73a7b](///commit/0a73a7bf9c3e00a0395918bc8fd0666975c53058))
* **gq:** migrate query section (GQUOTE-109) ([b3f6c68](///commit/b3f6c68ca518d83c3eb91618aeb50dad158c3aff))
* **gq:** migrate result section (GQUOTE-110) ([473275f](///commit/473275fa48ceddce7a259c4c6f1e01efcd8af8e3))
* **gq:** multiselect for inputs (GQUOTE-119) ([11f7407](///commit/11f7407959fd1e72716828338f63a34ae1d438ee))
* **gq:** new blank page incl routing for new ui design ([9908fe5](///commit/9908fe571581c9d03741a003cde98bfa2c1da58d))
* **gq:** ngrx store migration (GQUOTE-107) ([1e3339a](///commit/1e3339ae8f267e61cb76776b683278e16adbfaec))
* **gq:** select and deselect rows ([7389691](///commit/73896910d17d7520b72b3dd3792bf97ac9f09ae1))
* **gq:** translate all templates (GQUOTE-99) ([eb0de17](///commit/eb0de174a58ed0b8614dc6277890f06440f0fb1e))
* **gq:** validity check for input table (GQUOTE-185) ([f3b2705](///commit/f3b27054c84e1ec9a62053ffc969b83a3da49059))
* **qg:** Add get details calls (GQUOTE-152) ([9f05aa7](///commit/9f05aa7a4b19dbc2a907009296c2263f22b3afd0))
* **qg:** Add Offer drawer (GQUOTE-153) ([3c5f111](///commit/3c5f111e8281f78d587280d76d9aad200377dc88))
* **styles:** make styles lib publishable (UFTABI-2916) ([245e355](///commit/245e355c6de4dafff18bdf03301074adb41669c3))
* **workspace:** update to angular 11 ([2701a47](///commit/2701a47e42d4740cb0efd5671a1e3e5694d2f347))


### 🐛 Bug Fixes

* **cdba:** fix synchronisation of column state with local storage ([a36e746](///commit/a36e746f9169be980f7b4da71f7e2bb7ab135f7a))
* **gq:** fix module imports to reenable translations ([220847f](///commit/220847f6e5ba6363d240f26020cec644d503df48))
* **gq:** fix selection checkbx for process case table ([f6252d9](///commit/f6252d9efa8099cd28542e26b2658e71bcf5da82))
* **gq:** fixed add and remove to/from offer ([91c4134](///commit/91c4134cbc506a0608ee2f59193067c8b4928b3f))
* **gq:** navigate on offer view ([76f9e5b](///commit/76f9e5b54d0810169ad04adc72f1181ce8d00c73))

## [1.8.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.7.0...v1.8.0) (2020-10-12)


### 🐛 Bug Fixes

* **cdba:** fix synchronisation of column state with local storage ([a36e746](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/a36e746f9169be980f7b4da71f7e2bb7ab135f7a))


### 🎸 Features

* **gq:** button functionality for add to search query (GQUOTE-113) ([847eb7f](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/847eb7ff62ab091847b070184922e1362d5eb11a))
* **gq:** create store for creating new cases (GQUOTE-133) ([2d3d03d](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/2d3d03df4ed6a7d6781e5ff0953daa7879d4f81d))
* **gq:** create store for process quotation case (GQUOTE-149) ([e046e56](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/e046e56933d5526fd6c03bfebb02f3ce288993b8))
* **gq:** Deletable query list item (GQUOTE-114) ([654c6b8](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/654c6b847fb7b6192757b624d75f12768e1e0c22))
* **gq:** new blank page incl routing for new ui design ([9908fe5](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/9908fe571581c9d03741a003cde98bfa2c1da58d))

## [1.7.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.6.0...v1.7.0) (2020-09-28)


### 🎸 Features

* **gq:** add dialog for querrying table (GQUOTE-111) ([1ade529](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/1ade5299975b341c915d2cb50acdb044fca4767a))
* **gq:** add input field according to dropdown selections (GQUOTE-98) ([b526f69](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/b526f6920ccb65c04f8f495f5e7671c5bf1eb2fa))
* **gq:** Input Check for Enabling "Add to Queries" (GQUOTE-29) ([ae4fc96](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/ae4fc965b9cca0dfd6088ee90637b4c489d67456))
* **gq:** migrate result section (GQUOTE-110) ([473275f](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/473275fa48ceddce7a259c4c6f1e01efcd8af8e3))
* **gq:** multiselect for inputs (GQUOTE-119) ([11f7407](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/11f7407959fd1e72716828338f63a34ae1d438ee))
* **gq:** translate all templates (GQUOTE-99) ([eb0de17](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/eb0de174a58ed0b8614dc6277890f06440f0fb1e))

## [1.6.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.5.0...v1.6.0) (2020-09-11)


### 🎸 Features

* **deps:** update to angular v10.1 and typescript 4.0.2 ([edc0bb1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/edc0bb1d32af1b0b585de3f79bc96eaf393c240e))
* **gq:** add http interceptor (GQUOTE-106) ([d97d71c](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/d97d71ca1191123317d22b4637702f8092d67216))
* **gq:** created modularized app structure (GQUOTE-105) ([669cd6a](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/669cd6ab544f2c549f10630980209edb83d10eb0))
* **gq:** migrate input section (GQUOTE-108) ([0a73a7b](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/0a73a7bf9c3e00a0395918bc8fd0666975c53058))
* **gq:** migrate query section (GQUOTE-109) ([b3f6c68](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/b3f6c68ca518d83c3eb91618aeb50dad158c3aff))
* **gq:** ngrx store migration (GQUOTE-107) ([1e3339a](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/1e3339ae8f267e61cb76776b683278e16adbfaec))

## [1.5.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.4.0...v1.5.0) (2020-08-27)


### 🎸 Features

* **gq:** create guided quoting application (GQUOTE-100) ([973d76a](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/973d76a77d7ceb25b150fcf0b2ae3a083c4a7695))
* **styles:** make styles lib publishable (UFTABI-2916) ([245e355](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/245e355c6de4dafff18bdf03301074adb41669c3))
