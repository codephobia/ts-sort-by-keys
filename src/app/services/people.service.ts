import { Injectable, NgZone } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Person } from '../models/person.model';
import { people } from '../data/people.data';

/**
 * Simple service to test an updating Observable with the
 * sorting that randomizes the votes on the people every
 * second.
 */
@Injectable({
    providedIn: 'root'
})
export class PeopleService {
    private _people = new BehaviorSubject<Person[]>(people);

    constructor(
        private _ngZone: NgZone,
    ) {
        window.setInterval(() => {
            this._ngZone.run(this._updatePeople.bind(this));
        }, 1000);
    }

    public getPeople(): Observable<Person[]> {
        return this._people.asObservable();
    }

    private _updatePeople(): void {
        const newPeople = this._people.value.map(person => ({
            ...person,
            votes: Math.round(Math.random() * 10000 + 1),
        }));

        this._people.next(newPeople);
    }
}
