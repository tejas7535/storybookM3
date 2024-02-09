import jsPDF from 'jspdf'; // eslint-disable-line import/no-extraneous-dependencies

import { FontsLoaderService } from '../fonts-loader.service';
import { generateFooter } from './components/footer';
import { generateHeader } from './components/header';
import { VerticalLayout } from './components/vertical-layouter';
import {
  DocumentData,
  GeneratedDocument,
  ResultBlock,
  ResultReport,
} from './data';
export class PDFREport {
  constructor(
    private readonly docSettings: DocumentData,
    private readonly data: ResultReport,
    private readonly fontsLoaderService: FontsLoaderService
  ) {}

  async generate(): Promise<GeneratedDocument> {
    const doc = new jsPDF({ unit: 'pt' });
    this.fontsLoaderService.loadFonts(doc);
    const verticalLayout = new VerticalLayout(doc, {
      offsetTop: 85,
      offsetBottom: 90,
    }).add('methods', this.data.calculationMethods, {
      header: this.docSettings.calculationMethodsHeading,
    });

    const hasBearinxCalculation = this.hasCatalogCalculationResults();

    if (hasBearinxCalculation) {
      verticalLayout.add('inputs', this.data.calculationInput, {
        header: this.docSettings.inputSectionHeading,
      });
    }

    if (
      this.data.upstreamEmissions &&
      this.data.upstreamEmissions.data !== undefined
    ) {
      verticalLayout.add('upstream', this.data.upstreamEmissions, {
        props: { disclaimer: this.docSettings.co2disclaimer },
      });
    }

    if (this.data.ratingLife && this.data.ratingLife.data.length > 0) {
      verticalLayout.add('resultgrid', this.data.ratingLife);
    }

    if (
      this.data.overrollingFrequency &&
      this.data.overrollingFrequency.data.length > 0
    ) {
      verticalLayout.add('resultgrid', this.data.overrollingFrequency);
    }

    if (
      this.data.lubricationInfo &&
      this.data.lubricationInfo.data.length > 0
    ) {
      verticalLayout.add('resultgrid', this.data.lubricationInfo);
    }

    if (this.data.frictionalPowerloss) {
      verticalLayout.add('resultgrid', this.data.frictionalPowerloss);
    }

    if (hasBearinxCalculation) {
      verticalLayout.add('notices', this.data.notices);
    }

    verticalLayout.loop();

    this.generateHeaderAndFooterSectionsOnEveryPage(doc);

    return {
      designation: 'test',
      document: doc,
    };
  }
  private generateHeaderAndFooterSectionsOnEveryPage(doc: jsPDF) {
    const filteredPages = doc.internal.pages.filter(
      (page) => page !== undefined
    ); // for some reason undefined value is returned as a first page.

    const totalPages = filteredPages.length;
    for (let currentPage = 1; currentPage <= totalPages; currentPage += 1) {
      doc.setPage(currentPage);

      generateHeader(doc, this.docSettings);
      generateFooter(doc, currentPage, totalPages, this.docSettings);
    }
  }

  private hasCatalogCalculationResults(): ResultBlock<any> {
    const hasBearinxCalculation =
      this.data.ratingLife ||
      this.data.frictionalPowerloss ||
      this.data.lubricationInfo ||
      this.data.overrollingFrequency;

    return hasBearinxCalculation;
  }
}
