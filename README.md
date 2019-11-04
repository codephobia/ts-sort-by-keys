# Using TypeScript to Sort by Keys

## TL;DR- ⏱️

- Sort arrays of objects recursively by multiple keys.
- Keep it typed, and control asc/desc.
- Use it in Angular templates via Pipes.
- Use it in my Angular components, services, etc.
- Use it in rxjs pipes with a custom operator.

## When your google-fu fails you 🐱‍👤

Sometimes you run into a problem that needs to be solved and you just can't find a good example of it. I ran into this issue where I wanted to sort arrays of objects by multiple keys, keep it type safe, and be able to use it easily from templates, code, and in rxjs pipes.

## Why did you even need this? 🙋

Initially, I was working on a Twitch Extension for polling viewers, and I wanted to be able to sort the results by vote counts, and the order I created them. I knew all of my data would be available on the client at once, and would be updating dynamically with PUBSUB as people vote. I didn't want to send the entire poll with each PUBSUB message, so needed a good way to sort it on the client on the fly. I've since used it in other projects as well for varying use cases.

## Just show it to me 👁️

```ts
// Errors.
const ERROR_REQUIRES_AT_LEAST_ONE_KEY = 'provide at least one key to sort by';
const ERROR_KEY_LENGTH_INVALID = 'a key was provided as an empty string';
const ERROR_DESC_KEY_LENGTH_INVALID = 'a descending key was missing the key name';
const ERROR_OBJECT_DOESNT_CONTAIN_KEY = 'a key you are attempting to sort by is not on all objects';

/**
 *  Recursive function to sort values by their keys.
 */
const sortByKey = <T>(a: T, b: T, ...keys: string[]): number => {
    // Get first key in array.
    let key = keys.shift();

    // Make sure we have a valid key name.
    if (!key.length) {
        throw new Error(ERROR_KEY_LENGTH_INVALID);
    }

    // Default to ascending order.
    let desc = false;

    // Check for descending sort.
    if (key.charAt(0) === '-') {
        // Make sure key has a name as well as the minus sign.
        if (key.length < 2) {
            throw new Error(ERROR_DESC_KEY_LENGTH_INVALID);
        }

        // Remove minus from key name.
        key = key.substr(1);

        // Flag as descending order.
        desc = true;
    }

    // Make sure the objects both have the key. We make sure
    // to check this after we have removed the minus sign.
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        throw new Error(ERROR_OBJECT_DOESNT_CONTAIN_KEY);
    }

    // Determine checks based on asc / desc.
    const direction = (desc) ? -1 : 1;

    // Perform bubble sort based on the values.
    if (a[key] > b[key]) {
        return 1 * direction;
    }
    if (a[key] < b[key]) {
        return -1 * direction;
    }

    // The values of the current key are equal, so if we still
    // have keys to check recursively, check the next key.
    if (keys.length) {
        return sortByKey(a, b, ...keys);
    }

    // All keys returned and no more sorting needed.
    return 0;
};

/**
 * Wrapper sort function for the recursive one.
 */
export const sortByKeys = <T>(data: T[], ...keys: string[]): T[] => {
    // Make sure we have at least one key to sort by.
    if (!keys.length) {
        throw new Error(ERROR_REQUIRES_AT_LEAST_ONE_KEY);
    }

    // Sort data.
    data.sort((a: T, b: T): number => {
        return sortByKey(a, b, ...keys);
    });

    // Return sorted data.
    return data;
};
```

### Generics to the rescue

Being able to use generics in our functions allows us to keep everything type safe. I really wanted to avoid passing in an `Interface`, and it coming back as some random object.

### Recursive all the things

When two values are equal, we will recursively run the function again, but this time hopping to the next key in the sorting order until there are no more keys to compare.

### Control the order

Adding a very simple way to pick between ascending and descending order was important. I opted to add a minus sign `-` as the first character to flag descending, and default to ascending.

### Error handling

If something isn't working, I want to know why. Maybe I forgot a key name, or I tried to sort a field that didn't exist. Throwing these errors allows us to catch them in our rxjs pipes as well and handle them gracefully.

## Piping hot pipes 🔥

Taking advantage of Angular's `Pipes`, we can now use this function in our templates without having to worry about importing any code to our components.

```ts
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
```

And then in the templates, use it like so:

```html
<table>
    <tbody>
        <tr *ngFor="let person of unsortedPeople | sortByKeys:'city':'lastName':'firstName'">
            <td>{{ person.firstName }}</td>
            <td>{{ person.lastName }}</td>
            <td>{{ person.city }}</td>
            <td>{{ person.votes }}</td>
        </tr>
    </tbody>
</table>
```

This example will always sort by city, then last name, and finally first name - all in ascending order.

## Components 🦁, Services 🐯, and more 🐻, OH MY! 😮

Using the functionality in your code is super straight forward, and can be used in places like a `ngOnInit`, `Input` setters, or in your `reducers`. Some examples:

```ts
public ngOnInit(): void {
    // Sort the people on the component.
    this.sortedPeople = sortByKeys(people, '-city', '-lastName', '-firstName');
}
```

```ts
@Input()
public set people(people: Person[]) {
    this._people = sortByKeys(people, '-city', '-lastName', '-firstName');
}
public get people(): Person[] {
    return this._people;
}

private _people: Person[] = [];
```

## But I only code reactive things 🤷

Reactive code is awesome. If you want to use this in your rxjs pipes, you can make a custom operator that wraps the function for you. This will take in the `Observable`, sort it, and return a new sorted `Observable` of the same type.

```ts
import { map } from 'rxjs/operators';

import { sortByKeys } from './sort-by-keys';

/**
 * Custom operator for the sorting function.
 */
export const sortKeys = <T>(...keys: string[]) => map(
    (x: T[]): T[] => sortByKeys(x, ...keys)
);
```

This code is quite minimal since we are able to rely on the already existing `map` operator. Optionally, we could use a more explicit approach like this one:

```ts
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { sortByKeys } from './sort-by-keys';

export const sortKeys = <T>(...keys: string[]) => (source: Observable<T[]>): Observable<T[]> =>
    new Observable(observer => {
        return source.subscribe({
            next(x) {
                observer.next(
                    sortByKeys(x, ...keys)
                );
            },
            error(err) { observer.error(err); },
            complete() { observer.complete(); }
        });
    });

```

Using the operator in a pipe becomes ezpz:

```ts
// Service that returns an Obserable.
this.myService.getData().pipe(
        // Custom operator.
        sortKeys('-votes', 'firstName', 'lastName'),
    ).subscribe(...);
```

And then watch your sorting happen as new data comes in:

![Updating data](https://i.imgur.com/GMDM8gI.gif)

## Don't @ me 😨

### Bubble sort?

Yep. All the arrays I needed this for are fairly small, so no need to use a crazy algorythm here.

### But pagination?

True. If you are paginating the data, sorting on the client doesn't make any sense. Do it on the server / database instead.

## Code Sources 💾

I made an Angular app on Github [here](https://github.com/codephobia/ts-sort-by-keys) that shows some examples. You can also check it out on Stack Blitz [here](https://stackblitz.com/edit/ts-sort-by-keys) as well.

## Feedback is Awesome 📢

Know a better way to do this? Have you done something similar? Tell me in the comments below!