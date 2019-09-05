import { Component, OnInit, Input } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ModalController, ToastController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {RestaurateurService} from '../restaurateur.service';
import {StateOfOrder} from '../models/stateOfOrder';
@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.page.html',
  styleUrls: ['./order-summary.page.scss'],
})
export class OrderSummaryPage implements OnInit {
  products = new Array<{name: string, count: number, icon: string}>();
  @Input() selectedProducts;
  @Input() dishesOrdered;
  @Input() beveragesOrdered;
  @Input() language;
  @Input() origin;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private modalCtrl: ModalController,
              public toastController: ToastController, private translate: TranslateService, private restaurateurService: RestaurateurService) {
   }

  ngOnInit() {
    this.translate.use(this.language);
    this.summaryOfSelectedProducts();
  }

  close() {
    this.modalCtrl.dismiss({confirmed: false});
  }

  async processOrder() {
    let idsOfProductsSelected = [];
    for (let i = 0; i < this.dishesOrdered.length; i++) {
      let j = 0;
      while (j < this.dishesOrdered[i].count) {
        idsOfProductsSelected.push(this.dishesOrdered[i]._id);
        j++;
      }   
    }
    for (let j = 0; j < this.beveragesOrdered.length; j++) {
      let k = 0;
      while ( k < this.beveragesOrdered[j].count) {
        idsOfProductsSelected.push(this.beveragesOrdered[j]._id);
        k++;
      }
    }
    await this.restaurateurService.addOrder(this.origin, idsOfProductsSelected).subscribe((data: StateOfOrder) => {
      console.log(data);
    });
    this.modalCtrl.dismiss({confirmed: true});
  }

  summaryOfSelectedProducts() {
    console.log('Displaying entered dishes:');
    console.log(this.dishesOrdered);
    console.log('Displaying entered beverages:');
    console.log(this.beveragesOrdered);
    for (let j = 0; j < this.dishesOrdered.length; j++) {
      this.products.push({name: this.dishesOrdered[j].name, count: this.dishesOrdered[j].count, icon: 'restaurant'});
    }
    for (let i = 0; i < this.beveragesOrdered.length; i++) {
      this.products.push({name: this.beveragesOrdered[i].name, count: this.beveragesOrdered[i].count, icon: 'beer'});
    }
    console.log('Displaying products:');
    console.log(this.products);
  }



}
