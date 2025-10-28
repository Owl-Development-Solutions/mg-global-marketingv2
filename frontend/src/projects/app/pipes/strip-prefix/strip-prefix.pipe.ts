import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripPrefix',
})
export class StripPrefixPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';

    const message = value instanceof Error ? value.message : String(value);

    return message.replace(/^(Error|Success|Warning|Info)\s*:\s*/i, '').trim();
  }
}
