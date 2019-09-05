import { Component, OnInit, Input } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-selected-products',
  templateUrl: './selected-products.page.html',
  styleUrls: ['./selected-products.page.scss'],
})
export class SelectedProductsPage implements OnInit {
  products = [];
  @Input() title;
  @Input() selectedProducts;
  @Input() countsOfSelectedProducts;
  @Input() idsOfSelectedProducts;
  @Input() language;
  titleOfPage = '';

  constructor(private modalCtrl: ModalController, private translate: TranslateService) { }

  ngOnInit() {
    this.translate.use(this.language);
    this.updateListOfProducts();
    this.translate.get(this.title).subscribe((res : string) => {
      this.titleOfPage = res;
    });
  }

  close() {
    this.modalCtrl.dismiss(this.products);
  }

  changedCount(event) {
    console.log('Displaying list of products:');
    console.log(this.products);
  }

  updateListOfProducts() {
    this.products = [];
    for (let i = 0; i < this.selectedProducts.length; i++) {
      this.products.push({name: this.selectedProducts[i], count: this.countsOfSelectedProducts[i], _id: this.idsOfSelectedProducts[i]});
    }
  }

}
