import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddRequestPage } from './add-request.page';
import { OrderSummaryPage } from '../order-summary/order-summary.page';
import { OrderSummaryPageModule } from '../order-summary/order-summary.module';
import {SelectedProductsPage} from '../selected-products/selected-products.page';
import {SelectedProductsPageModule} from '../selected-products/selected-products.module';
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: AddRequestPage
  }
];

@NgModule({
  entryComponents: [OrderSummaryPage, SelectedProductsPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    OrderSummaryPageModule,
    SelectedProductsPageModule,
    TranslateModule
  ],
  declarations: [AddRequestPage]
})
export class AddRequestPageModule {}
