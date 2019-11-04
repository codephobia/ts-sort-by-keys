// import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { sortByKeys } from './sort-by-keys';

/**
 * Custom operator for the sorting function.
 */
export const sortKeys = <T>(...keys: string[]) => map(
    (x: T[]): T[] => sortByKeys(x, ...keys)
);

// Optionally you could use a full explicit operator like the one below.

// export const sortKeys = <T>(...keys: string[]) => (source: Observable<T[]>): Observable<T[]> =>
//     new Observable(observer => {
//         return source.subscribe({
//             next(x) {
//                 observer.next(
//                     sortByKeys(x, ...keys)
//                 );
//             },
//             error(err) { observer.error(err); },
//             complete() { observer.complete(); }
//         });
//     });
