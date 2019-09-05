import { Component, OnInit, Input } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {
  @Input() amount;
  @Input() selectedProducts;
  @Input() origin;
  @Input() _id;
  @Input() language;
  private products = [];

private total = {name: 'Total:', price: '0 Euros'};

  constructor(private modalCtrl: ModalController, private translate: TranslateService) { }

  ngOnInit() {
    this.translate.use(this.language);
    this.getDataOfOpenedOrder();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  getDataOfOpenedOrder() {
    console.log('Displaying selected products');
    console.log(this.selectedProducts);
    let productsPrices = [];
    let countsOfProducts = [];
    let namesOfProducts = [];
    let idsOfProducts = [];
    for (let i = 0; i < this.selectedProducts.length; i++) {
      let pos = idsOfProducts.indexOf(this.selectedProducts[i]._id);
      if (pos < 0) {
        idsOfProducts.push(this.selectedProducts[i]._id);
        productsPrices.push(this.selectedProducts[i].price);
        countsOfProducts.push(1);
        namesOfProducts.push(this.selectedProducts[i].name);
      } else {
        countsOfProducts[pos] += 1;
      }
    }


    this.products = [];
    for( let i = 0; i < idsOfProducts.length; i++) {
      let currentPrice = productsPrices[i] * countsOfProducts[i];
      this.products.push({name: namesOfProducts[i], price: currentPrice.toString() + ' Euros', count: countsOfProducts[i].toString()});
    }
    this.total.price = this.amount.toString() + ' Euros';
  }


}
