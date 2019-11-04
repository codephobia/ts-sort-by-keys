import { Pipe, PipeTransform } from '@angular/core';

import { sortByKeys } from 'src/app/utils/sort-by-keys';

/**
 * Pipe for the sorting function.
 */
@Pipe({
    name: 'sortByKeys'
})
export class SortByKeysPipe implements PipeTransform {
    public transform(value: any[], ...keys: string[]): any[] {
        return sortByKeys<any>(value.slice(), ...keys);
    }
}
