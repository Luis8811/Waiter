import { Component } from '@angular/core';
import {CountOfProducts} from '../models/countOfProducts';
import {RestaurateurService} from '../restaurateur.service';
import {CountOfOpenedOrders} from '../models/countOfOpenedOrders';
import {SoldProduct} from '../models/soldProduct';
import {TranslateService} from '@ngx-translate/core';
import { AppComponent } from '../app.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public businessStats: Array<{ name: string; value: string;}> = [];
  public moreSoldProductsToday: Array<{ name: string; countOfSales: string;}> = [];
  public moreSoldProductsInWeek: Array<{ name: string; countOfSales: string;}> = [];
  public countOfProducts: CountOfProducts;
  public countOfOpenedOrders: CountOfOpenedOrders;
  public soldProductsToday: SoldProduct[]; // list of more sold products today
  public soldProductsInWeek: SoldProduct[]; // list or more sold products in the week
  private language = null;
  constructor(private restaurateurService: RestaurateurService, private translate: TranslateService, private activatedRoute: ActivatedRoute, private appComponent: AppComponent) {
    this.language = this.activatedRoute.snapshot.paramMap.get('language');
    this.translate.use(this.language);
    this.mockupData();
    this.translate.get('count_of_products').subscribe((res : string) => {
      this.businessStats[0].name = res;
    });
    this.translate.get('count_of_opened_orders').subscribe((res : string) => {
      this.businessStats[1].name = res;
    });
    this.appComponent.language = this.language;
    this.appComponent.setLanguage();
  }

  ionViewWillEnter(){
    this.getSoldProductsToday();
    this.getCountOfProducts();
    this.getCountOfOpenedOrders();
    this.getMoreSoldProductsInWeek();
  }

  mockupData() {
    const namesOfBusinessStats = ['Count of products', 'Count of opened orders'];
    const valuesOfBusinessStats = ['0', '0'];
    for (let i = 0; i < namesOfBusinessStats.length; i++) {
      this.businessStats.push({
        name: namesOfBusinessStats[i],
        value: valuesOfBusinessStats[i]
      });
    }
   this.moreSoldProductsToday = new Array();
   this.moreSoldProductsInWeek = new Array();
  }

  getCountOfProducts() {
    this.restaurateurService.countOfProducts().subscribe((data: CountOfProducts) => {
      this.countOfProducts = data;
      console.log(this.countOfProducts);
      this.businessStats[0].value = this.countOfProducts.countOfProducts.toString();
  });  
  }

  getCountOfOpenedOrders() {
    this.restaurateurService.countOfOpenedOrders().subscribe((data: CountOfOpenedOrders) => {
      this.countOfOpenedOrders = data;
      console.log(this.countOfOpenedOrders);
      this.businessStats[1].value = this.countOfOpenedOrders.countOfOpenedOrders.toString();
  });
}

 getSoldProductsToday() {
  this.restaurateurService.getSoldProductsToday().subscribe((data: SoldProduct[]) => {
    this.soldProductsToday = data;
    console.log(this.soldProductsToday);
    this.moreSoldProductsToday = new Array();
    for (let i = 0; i < this.soldProductsToday.length; i++) {
      this.moreSoldProductsToday.push({name: this.soldProductsToday[i].productName, countOfSales: this.soldProductsToday[i].sales.toString()})
    }
});
 }

 getMoreSoldProductsInWeek() {
    this.restaurateurService.getMoreSoldProductsInWeek().subscribe((data: SoldProduct[]) => {
      this.soldProductsInWeek = data;
      console.log(this.soldProductsInWeek);
      this.moreSoldProductsInWeek = new Array();
      for (let i = 0; i < this.soldProductsInWeek.length; i++) {
        this.moreSoldProductsInWeek.push({name: this.soldProductsInWeek[i].productName, countOfSales: this.soldProductsInWeek[i].sales.toString()});
      }
  });
 }
}
