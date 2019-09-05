import { Component, OnInit } from '@angular/core';
import {Product} from '../models/Product';
import {RestaurateurService} from '../restaurateur.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  private textOfSearch = '';
  private selectedItem: any;
  private language = 'es';
  private icons = [
    'flask',
    'wifi',
    'beer',
    'football',
    'basketball',
    'paper-plane',
    'american-football',
    'boat',
    'bluetooth',
    'build'
  ];
  public items: Array<{ title: string; note: string; icon: string }> = [];
  public beverages: Array<{ title: string; note: string; icon: string }> = [];
  public dishes: Array<{ title: string; note: string; icon: string }> = [];
  private searchPlaceHolder = '';

  public products: Product[];
  constructor(private restaurateurService: RestaurateurService, private translate: TranslateService, private activatedRoute: ActivatedRoute) {
    // this.mockupData();  
  }

  search(event) {
    this.textOfSearch = event.detail.value;
  }

  // Load products from the API
  loadProducts() {
    this.restaurateurService.getProducts().subscribe(data => {
      this.products = data;
      console.log('Products:')
      console.log(this.products);
     for (let i = 0; i < this.products.length; i++){
       if (this.products[i].type === 'beverage'){
         this.beverages.push({title: this.products[i].name, note: this.products[i].price.toString(), icon: this.getIconOfProduct(this.products[i].description, this.products[i].type)});
       }else {
         this.dishes.push({title: this.products[i].name, note: this.products[i].price.toString(), icon: this.getIconOfProduct(this.products[i].description, this.products[i].type)});
       }
     }
    });
  }

  // Returns the icon of the product from its description and type
  getIconOfProduct(descriptionOfProduct: string, type: string) {
    let icon ='restaurant';
    if (type === 'beverage'){
      switch (descriptionOfProduct){
        case "café": { 
         icon = 'cafe';
         break;
        }
        case "coffee": {
          icon = 'cafe';
          break;
        }
        case "beer": {
          icon = 'beer';
          break;
        }
        case "cerveza": {
          icon = 'beer';
          break;
        }
        case "ice cream": {
          icon = 'ice-cream';
          break;
        }
        case "helado": {
          icon = 'ice-cream';
          break
        }
        default: {
          icon = 'wine';
          break;
       }

      }
      
    }else {
      switch (descriptionOfProduct){
        case "pizza" : {
          icon = 'pizza';
          break;
        }
        case "vegetales" : {
          icon = 'nutrition';
          break;
        }
        case "vegetables" : {
          icon = 'nutrition';
          break;
        }
        default: {
          icon = 'restaurant';
          break;
       }
      }

    }
    return icon;
  }

  ngOnInit() {
    this.loadProducts();
    this.language = this.activatedRoute.snapshot.paramMap.get('language');
    this.translate.use(this.language);
    this.translate.get('search_place_holder').subscribe((res : string) => {
      this.searchPlaceHolder = res;
    });

  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }

  // Method for testing purposes
  mockupData() {
    const products = ['Soup of vegetables', 'Coffee', 'Pizza', 'Wine', 'Beer', 'Ice cream', 'Beans and pork'];
    const prices = ['10.5 Euros', '1.3 Euros', '3 Euros', '2 Euros', '1.4 Euros', '2 Euros', '13 Euros'];
    const iconsOfProducts = ['nutrition', 'cafe', 'pizza', 'wine', 'beer', 'ice-cream', 'restaurant'];

    for (let i = 0; i < products.length; i++) {
      this.items.push({
        title: products[i],
        note: prices[i],
        icon: iconsOfProducts[i]
      });
    }

    this.beverages.push(this.items[1]);
    this.beverages.push(this.items[3]);
    this.beverages.push(this.items[4]);

    this.dishes.push(this.items[0]);
    this.dishes.push(this.items[2]);
    this.dishes.push(this.items[5]);
    this.dishes.push(this.items[6]);
  }
}
