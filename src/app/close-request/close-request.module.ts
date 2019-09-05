import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CloseRequestPage } from './close-request.page';
import { InvoicePage } from '../invoice/invoice.page';
import {InvoicePageModule} from '../invoice/invoice.module';
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: CloseRequestPage
  }
];

@NgModule({
  entryComponents: [InvoicePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes),
    InvoicePageModule
  ],
  declarations: [CloseRequestPage]
})
export class CloseRequestPageModule {}
