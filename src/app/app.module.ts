import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SortByKeysPipe } from './pipes/sort-by-keys.pipe';

const COMPONENTS = [
    AppComponent,
];

const PIPES = [
    SortByKeysPipe,
];

@NgModule({
    declarations: [
        ...COMPONENTS,
        ...PIPES,
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
