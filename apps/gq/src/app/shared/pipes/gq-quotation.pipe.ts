import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gqQuotation',
})
export class GqQuotationPipe implements PipeTransform {
  transform(gqId: number): string {
    const idString = `0000000${gqId}`;

    return `GQ${idString.substr(idString.length - 6)}`;
  }
}
