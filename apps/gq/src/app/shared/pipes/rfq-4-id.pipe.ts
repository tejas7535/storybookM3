import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rfq4Id',
})
export class Rfq4IdPipe implements PipeTransform {
  transform(rfqId: number): string {
    return `RFQ${rfqId}`;
  }
}
