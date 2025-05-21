import { Injectable } from '@angular/core';

import { TableWithHeader } from '@mm/shared/components/pdf/pdf-table-with-header/table-with-header';

import {
  Colors,
  HeadingFonts,
  SectionHeading,
  Table,
} from '@schaeffler/pdf-generator';

@Injectable()
export class PdfTableFactory {
  createStyledTable(data: string[][], alternateBackground = true): Table {
    const oddRowColor = Colors.Surface;
    const evenRowColor = '#eee';

    return new Table({
      data,
      style: {
        fontStyle: {
          fontStyle: 'normal',
          fontFamily: 'Noto',
          fontSize: 8,
        },
        background: alternateBackground
          ? [oddRowColor, evenRowColor]
          : undefined,
      },
    });
  }

  createTableWithHeader(table: Table, title: string): TableWithHeader {
    return new TableWithHeader({
      header: new SectionHeading({
        font: { ...HeadingFonts.medium, fontStyle: 'bold' },
        text: title,
        underline: true,
      }),
      table,
      spacing: 3,
    });
  }

  createCompleteTable(data: string[][], title: string): TableWithHeader {
    const table = this.createStyledTable(data);

    return this.createTableWithHeader(table, title);
  }
}
