import { Injectable } from '@angular/core';

import { HeadingFonts, SectionHeading, Table } from '../../components';
import { TableWithHeader } from '../../components/pdf-table-with-header/table-with-header';
import { Colors } from '../../constants';

@Injectable({
  providedIn: 'root',
})
export class PdfTableFactory {
  public createStyledTable(
    data: string[][],
    alternateBackground = true
  ): Table {
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

  public createTableWithHeader(table: Table, title: string): TableWithHeader {
    return new TableWithHeader({
      header: new SectionHeading({
        font: { ...HeadingFonts['medium'], fontStyle: 'bold' },
        text: title,
        underline: true,
      }),
      table,
      spacing: 3,
    });
  }

  public createCompleteTable(data: string[][], title: string): TableWithHeader {
    const table = this.createStyledTable(data);

    return this.createTableWithHeader(table, title);
  }
}
