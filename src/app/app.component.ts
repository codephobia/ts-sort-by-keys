import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Person } from './models/person.model';
import { people } from './data/people.data';
import { sortByKeys } from './utils/sort-by-keys';
import { PeopleService } from './services/people.service';
import { sortKeys } from './utils/sort-keys.operator';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    // Directly using the unsorted people data.
    public unsortedPeople = people;
    // Sorting the people on the component.
    public sortedPeople: Person[] = [];
    // Sorting the people from an Observable.
    public sortedPeopleFromObservable: Person[] = [];

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _peopleService: PeopleService,
    ) {}

    public ngOnInit(): void {
        // Sort the people on the component.
        this.sortedPeople = sortByKeys(people, '-city', '-lastName', '-firstName');

        // Subscribe to the Observable and sort with a custom operator.
        this._peopleService.getPeople().pipe(
            // You can still use other operators without an issue.
            // This one below for example would remove the city
            // field from the people.

            // map((p: Person[]): Person[] => {
            //     return p.map(person => {
            //         return {
            //             firstName: person.firstName,
            //             lastName: person.lastName,
            //             votes: person.votes,
            //         };
            //     });
            // }),

            // Custom operator.
            sortKeys('-votes', 'firstName', 'lastName'),
        ).subscribe(p => {
            // Update the sorted list of people.
            this.sortedPeopleFromObservable = p;

            // Mark the component for check since Observables don't
            // force change detection automagically.
            this._changeDetectorRef.markForCheck();
        });
    }
}
