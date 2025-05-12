/* eslint-disable max-lines */
import { Injectable } from '@angular/core';

import {
  BehaviorSubject,
  debounceTime,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
  withLatestFrom,
  zip,
} from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { environment } from '@lsa/environments/environment';
import { toCamelCase } from '@lsa/recommendation/result/accessory-table/accessory-table.helper';
import {
  SelectedProductComponent,
  SelectedProductComponetInterface,
} from '@lsa/shared/components/pdf/selected-product.component';
import { PowerSupply } from '@lsa/shared/constants';
import { PipeLength } from '@lsa/shared/constants/tube-length.enum';
import {
  Accessory,
  Lubricator,
  RecommendationResponse,
} from '@lsa/shared/models';

import {
  ControlCommands,
  DisclaimerFooter,
  FontResolverService,
  Grid,
  HeadingFonts,
  ImageResolverService,
  LabelValues,
  PDFDocument,
  PDFHeader,
  ProductGroup,
  ProductList,
  ProductListSummary,
  SectionHeading,
  Table,
} from '@schaeffler/pdf-generator';

import { AddToCartService } from '../add-to-cart.service';
import { LsaFormService } from '../lsa-form.service';
import { PriceAvailabilityService } from '../price-availability.service';
import { RestService } from '../rest.service';
import { ResultInputsService } from '../result-inputs.service';
import {
  chooseSelectedProducts,
  makeProductGroups,
  summarizeProductGroups,
} from './product-groups.helper';

export type FormDataType = Partial<{
  [key: string]: Partial<{ [key: string]: number }>;
}>;

const IMAGE_FALLBACK_URL = `${environment.assetsPath}/images/placeholder.png`;

@Injectable({ providedIn: 'root' })
export class PDFGeneratorService {
  public readonly loading$$ = new BehaviorSubject<boolean>(false);

  private readonly recommendation$ = this.restService.recommendation$;
  private readonly tableData$$ = new Subject<FormDataType>();
  private readonly pricingAndAvailabilityData$$ =
    this.priceService.priceAndAvailabilityResponse$;
  private readonly forRecommendation$$ = new Subject<boolean>();

  private readonly recommendedLubricator$ = this.recommendation$.pipe(
    map(
      (recommendation) =>
        (recommendation as RecommendationResponse).lubricators
          .recommendedLubricator
    )
  );

  private readonly minimumLubricator$ = this.recommendation$.pipe(
    map(
      (recommendation) =>
        (recommendation as RecommendationResponse).lubricators
          .minimumRequiredLubricator
    )
  );

  private readonly recommendedLubData = this.forRecommendation$$.pipe(
    tap(() => this.loading$$.next(true)),
    switchMap((useRecommendation) =>
      useRecommendation ? this.recommendedLubricator$ : this.minimumLubricator$
    )
  );

  private readonly accessoryLookupMap$ = this.forRecommendation$$.pipe(
    withLatestFrom(this.recommendedLubData),
    map(([_, lubricator]) => {
      const accMap = new Map<string, Accessory>();
      for (const accesory of lubricator.bundle) {
        accMap.set(accesory.fifteen_digit, accesory);
      }

      return accMap;
    })
  );

  private readonly inputData$$ = this.recommendedLubData.pipe(
    map(() => this.formService.getRecommendationForm().getRawValue()),
    switchMap((form) =>
      this.convertPipeLengthString(form.lubricationPoints.pipeLength)
    ),
    map((pipeLengthTranslation) => {
      const form = this.formService.getRecommendationForm().getRawValue();
      const { lubricationPoints, lubricant, application } = form;
      const labelValues: LabelValues[] = [
        {
          label: this.translocoService.translate('inputs.lubricationPoints'),
          value: lubricationPoints.lubricationPoints,
        },
        {
          label: this.translocoService.translate(
            'inputs.relubricationQuantity.title',
            {
              value: lubricationPoints.lubricationQty,
            }
          ),
          value: this.translocoService.translate(
            'inputs.relubricationQuantity.value',
            {
              quantity: lubricationPoints.lubricationQty,
              interval: this.translocoService.translate(
                `recommendation.lubricationPoints.${lubricationPoints.lubricationInterval}`
              ),
            }
          ),
        },
        {
          label: this.translocoService.translate('inputs.maxPipeLengthTitle'),
          value: pipeLengthTranslation,
        },
        {
          label: this.translocoService.translate('inputs.optimeTitle'),
          value: this.translocoService.translate(
            `recommendation.lubricationPoints.optime.${lubricationPoints.optime}`
          ),
        },
        {
          label: this.translocoService.translate('inputs.lubricant'),
          value: lubricant.grease.title,
        },
        {
          label: this.translocoService.translate('inputs.temperature.title'),
          value: this.translocoService.translate('inputs.temperature.value', {
            min: application.temperature.min,
            max: application.temperature.max,
          }),
        },
        {
          label: this.translocoService.translate('inputs.powerSupplyTitle'),
          value: this.getPowerSupplyTranslation(application.battery),
        },
      ];

      return labelValues;
    })
  );

  private readonly productGroups$ = zip([
    this.recommendedLubData,
    this.forRecommendation$$.pipe(
      switchMap(() =>
        this.addToCartService.shouldShowPrices()
          ? this.priceService.priceAndAvailabilityResponse$.pipe(
              debounceTime(3500)
            )
          : of(true)
      )
    ),
  ]).pipe(
    withLatestFrom(this.tableData$$, this.accessoryLookupMap$),
    map(([_, tableData, lookupMap]) =>
      chooseSelectedProducts(tableData, lookupMap, IMAGE_FALLBACK_URL)
    ),
    switchMap((products) =>
      this.imagesResolver.fetchImages(products, 'imageUrl')
    ),
    withLatestFrom(this.pricingAndAvailabilityData$$),
    map(([products, priceInfo]) => {
      const priceItems = priceInfo.items;

      return products.map((product) => {
        const productInfo = priceItems[product.pimid];

        if (!(product.pimid in priceItems)) {
          return product;
        }
        if (this.addToCartService.shouldShowPrices()) {
          product.price = productInfo.price;
          product.currency = productInfo.currency;
          product.available = productInfo.available;
        }

        return product;
      });
    }),
    map((products) => makeProductGroups(products)),
    map((productGroups) =>
      productGroups.map((group) => ({
        ...group,
        title: this.translocoService.translate(
          `recommendation.result.category.${toCamelCase(group.title)}`
        ),
      }))
    )
  );

  private readonly detailsTable$$ = this.recommendedLubData.pipe(
    map((lub) => this.extractDetailsTable(lub))
  );

  private readonly selectedProductData$: Observable<SelectedProductComponetInterface> =
    this.recommendedLubData.pipe(
      withLatestFrom(this.forRecommendation$$),
      map(([lubricator, forRecommendation]) => {
        const selectedProductData: SelectedProductComponetInterface = {
          selectionTitle: this.translocoService.translate(
            'recommendation.result.pdf.selection'
          ),
          itemDescription: lubricator.description,
          productImage: lubricator.productImageUrl,
          idLabel: 'Schaeffler ID',
          idValue: lubricator.matNr,
          chipLabel: forRecommendation
            ? this.translocoService.translate(
                'recommendation.result.recommended'
              )
            : this.translocoService.translate(
                'recommendation.result.minimumRequirements'
              ),
          itemTitle: lubricator.name,
        };

        return selectedProductData;
      }),
      switchMap((data) =>
        this.imagesResolver.fetchImageObject(data, 'productImage')
      )
    );

  private readonly pdfFile = zip([
    this.detailsTable$$,
    this.productGroups$,
    this.selectedProductData$,
    this.inputData$$,
    this.forRecommendation$$,
    this.recommendedLubData,
  ]).pipe(
    withLatestFrom(
      this.fontResolver.fetchForLocale(this.translocoService.getActiveLang())
    ),
    map(([observableTrigger, fonts]) => {
      const [lubInfo, productGroups, productData, input, _, lubricator] =
        observableTrigger;
      const doc = new PDFDocument()
        .setPageMargin({ left: 7, right: 7, top: 6, bottom: 10 })
        .setDebug(false)
        .addFooter(
          new DisclaimerFooter({
            disclaimerText: `${this.translocoService.translate('disclaimer.text')} ${this.translocoService.translate('disclaimer.link')}`,
          })
        )
        .addFont(...fonts)
        .addHeader(
          new PDFHeader({
            reportTitle: this.translocoService.translate(
              'recommendation.result.pdf.title'
            ),
            date: {
              formattedDate: this.getFormattedDate(),
            },
          })
        )
        .setComponentSpacing(3)
        .addComponent(
          new SectionHeading({
            font: {
              fontFamily: 'Noto',
              fontSize: 12,
              fontStyle: 'bold',
            },
            text: this.translocoService.translate(
              'recommendation.result.pdf.title'
            ),
            strokeWidth: 0.75,
          })
        )
        .addComponent(
          new SectionHeading({
            font: HeadingFonts.main,
            text: this.translocoService.translate('inputs.title'),
          })
        )
        .addComponent(
          new Grid({
            layout: {
              columns: 3,
            },
            data: input,
          })
        )
        .addComponent(
          new SectionHeading({
            text: this.translocoService.translate(
              'recommendation.result.pdf.selection'
            ),
          })
        )
        .addComponent(new SelectedProductComponent(productData))
        .addComponent(
          new Table({
            data: lubInfo,
            style: {
              fontStyle: {
                fontStyle: 'normal',
                fontFamily: 'Noto',
                fontSize: 8,
              },
              background: ['#f6f7f8', '#FFF'],
            },
          })
        )
        .addComponent(ControlCommands.PageBreak)
        .addComponent(
          new SectionHeading({
            font: HeadingFonts.main,
            text: this.translocoService.translate(
              'recommendation.result.heading',
              { designation: lubricator.name }
            ),
          })
        );
      for (const group of productGroups as ProductGroup[]) {
        doc.addComponent(
          new ProductList({
            data: [group],
            showAvailabilityAndPriceWhenAvailabile:
              this.addToCartService.shouldShowPrices(),
            labels: {
              quantity: this.translocoService.translate(
                'recommendation.result.quantity'
              ),
              id: 'Schaeffler ID',
              availability: {
                inStock: this.translocoService.translate(
                  'recommendation.result.inStock'
                ),
                outOfStock: this.translocoService.translate(
                  'recommendation.result.notInStock'
                ),
              },
              price: this.translocoService.translate(
                'recommendation.result.perPiece'
              ),
            },
          })
        );
      }
      const [totalPieces, totalPrice] = summarizeProductGroups(
        productGroups,
        this.addToCartService.shouldShowPrices()
      );
      doc.addComponent(
        new ProductListSummary({
          data: [
            {
              label: this.translocoService.translate(
                'recommendation.result.totalPrice'
              ),
              value: totalPrice,
            },
            {
              label: this.translocoService.translate(
                'recommendation.result.totalPieces'
              ),
              value: `${totalPieces}`,
            },
          ],
        })
      );

      return doc;
    }),
    tap(() => this.loading$$.next(false))
  );

  constructor(
    private readonly restService: RestService,
    private readonly translocoService: TranslocoService,
    private readonly imagesResolver: ImageResolverService,
    private readonly fontResolver: FontResolverService,
    private readonly formService: LsaFormService,
    private readonly resultInputsService: ResultInputsService,
    private readonly priceService: PriceAvailabilityService,
    private readonly addToCartService: AddToCartService,
    private readonly localeService: TranslocoLocaleService
  ) {
    this.pdfFile.subscribe((doc) => {
      doc.generate();
      const filename = this.getReportFilename();
      doc.save(filename);
    });
  }

  public setFormData(data: FormDataType) {
    this.tableData$$.next(data);
  }

  public generatePDF(forRecommendation: boolean) {
    this.forRecommendation$$.next(forRecommendation);
  }

  private getFormattedDate() {
    return this.localeService.localizeDate(
      Date.now(),
      this.translocoService.getActiveLang()
    );
  }

  private getReportFilename() {
    const reportTitle = this.translocoService.translate(
      'recommendation.result.pdf.title'
    );
    const reportDate = this.getFormattedDate().replaceAll('/', '-');

    return `${reportTitle} - ${reportDate}.pdf`.replaceAll(' ', '_');
  }

  private extractDetailsTable(lubricator: Lubricator): string[][] {
    const baseString = 'recommendation.result';

    return [
      [
        this.translocoService.translate(`${baseString}.func_principle`),
        lubricator.technicalAttributes['func_principle'],
      ],
      [
        this.translocoService.translate(`${baseString}.dimensions`),
        lubricator.technicalAttributes['dimensions'],
      ],
      [
        this.translocoService.translate(`${baseString}.volume`),
        !lubricator.volume.includes('ml') && !lubricator.volume.includes('cm³')
          ? `${lubricator.volume} ml`
          : lubricator.volume,
      ],
      [
        this.translocoService.translate(`${baseString}.maxOperatingPressure`),
        this.stripUnsupportedChars(`${lubricator.maxOperatingPressure} bar`),
      ],
      [
        this.translocoService.translate(`${baseString}.voltage`),
        `${lubricator.technicalAttributes['voltage']}`,
      ],
      [
        this.translocoService.translate(`${baseString}.medium_general`),
        this.stripUnsupportedChars(
          lubricator.technicalAttributes['medium_general']
        ),
      ],
      [
        this.translocoService.translate(`${baseString}.tempRange`),
        this.translocoService.translate(`${baseString}.tempRangeValues`, {
          min: lubricator.minTemp,
          max: lubricator.maxTemp,
        }),
      ],
      [
        this.translocoService.translate(`${baseString}.noOfOutlets`),
        `${lubricator.noOfOutlets}`,
      ],
      [
        this.translocoService.translate(`${baseString}.mounting_position`),
        lubricator.technicalAttributes['mounting_position'],
      ],
    ];
  }

  private convertPipeLengthString(length: PipeLength) {
    return this.resultInputsService.getPipeLengthTranslation(length);
  }

  private getPowerSupplyTranslation(psuOption: PowerSupply) {
    const base = `recommendation.application.powerOptions.`;
    switch (psuOption) {
      case PowerSupply.Battery:
        return this.translocoService.translate(`${base}battery`);
      case PowerSupply.External:
        return this.translocoService.translate(`${base}external`);
      case PowerSupply.NoPreference:
        return this.translocoService.translate(`${base}noPreference`);
      default:
        return 'unknown';
    }
  }

  private stripUnsupportedChars(input: string) {
    return input.replaceAll('≤', '<=').replaceAll('≥', '>=');
  }
}
