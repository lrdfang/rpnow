import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TitleComponent } from './title.component';
import { TitleRoutingModule } from './title-routing.module';
import { LetsRpnowComponent } from './components/lets-rpnow.component';
import { TitleEntryComponent } from './components/title-entry.component';



@NgModule({
  declarations: [
    TitleComponent,
    LetsRpnowComponent,
    TitleEntryComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TitleRoutingModule
  ]
})
export class TitleModule { }
