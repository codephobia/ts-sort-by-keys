import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SortByKeysPipe } from './pipes/sort-by-keys.pipe';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                SortByKeysPipe,
            ],
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });
});
