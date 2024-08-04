import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
    declarations: [HomeComponent],
    imports: [MatButtonModule, MatIconModule,],
    providers: [],
    exports: [
        HomeComponent
    ]
})
export class HomeModule {

}