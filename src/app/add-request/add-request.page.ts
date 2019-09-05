import { Component, OnInit, Input } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';
import {Router, ActivatedRoute} from '@angular/router';
import { AlertController } from '@ionic/angular';
import {OrderSummaryPage} from '../order-summary/order-summary.page';
import {SelectedProductsPage} from '../selected-products/selected-products.page';
import {TranslateService} from '@ngx-translate/core';
import {RestaurateurService} from '../restaurateur.service';
import {Product} from '../models/product';
import {Location} from '../models/location';

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.page.html',
  styleUrls: ['./add-request.page.scss'],
})
export class AddRequestPage implements OnInit {
  private language = null;
  arrayOfSelectedProducts: Array<string> = [];
  products: Array<{id: string, name: string, price: number}> = [];
  tableIsSelected = false;
  selectedDishes = [];
  selectedBeverages = [];
  selectedTable: any;
  isDisabledSelectionOfTable = false;
  countsOfSelectedDishes: number[];
  countsOfSelectedBeverages: number[];
  dishesOrdered = [];
  beveragesOrdered = [];
  infoAboutProducts: Product[] = [];
  dishes: Product[] = [];
  beverages: Product[] = [];
  labelOfCancelButton = '';
  availableLocations = [];
  firstLoad = true;


  constructor(public toastController: ToastController, private router: Router, public alertController: AlertController,
              public modalController: ModalController, private translate: TranslateService, private activatedRoute: ActivatedRoute, private restaurateurService: RestaurateurService) { }

  ngOnInit() {
    this.language = this.activatedRoute.snapshot.paramMap.get('language');
    this.translate.use(this.language);
    
    this.translate.get('cancel_button').subscribe((res : string) => {
      this.labelOfCancelButton = res;
    });
    
  }

  ionViewWillEnter(){
    this.firstLoad = true;
    this.initializeValues();
    this.loadProducts();
    this.loadLocations();
   
  }

  loadProducts() {
    this.restaurateurService.getProducts().subscribe((data : Product[]) => {
      this.infoAboutProducts = data;
      this.selectedDishes = [];
      this.selectedBeverages = [];
      this.dishes = [];
      this.beverages = [];
      this.firstLoad = true;
      for (let i = 0 ; i < this.infoAboutProducts.length; i++) {
        if (this.infoAboutProducts[i].type == 'dish') {
          // this.selectedDishes.push(this.infoAboutProducts[i].name);
          this.dishes.push(this.infoAboutProducts[i]);
        } else {
         // this.selectedBeverages.push(this.infoAboutProducts[i].name);
          this.beverages.push(this.infoAboutProducts[i]);
        }
      }
      this.firstLoad = false;
    });
  }


  showOrder() {
     if (this.selectedTable === undefined) {
       this.selectTableAlert();
       return ;
     }

     if (this.dishesOrdered.length == 0 && this.beveragesOrdered.length == 0) {
       this.selectProductAlert();
     } else {
     this.tableIsSelected = true;
     this.isDisabledSelectionOfTable = true;
     this.presentModal();
    }
  }

  async selectProductAlert() {
    let translations = {error_at_proccessing_order: '', error_products_are_not_selected: '', message_error_products_are_not_selected: ''};
    await this.translate.get(['error_at_proccessing_order', 'error_products_are_not_selected', 'message_error_products_are_not_selected']).subscribe((res: {error_at_proccessing_order: string, error_products_are_not_selected: string, message_error_products_are_not_selected: string}) => {
     console.log('Displaying translations:');
     console.log(res);  
     translations = res;
     });
    const alert = await this.alertController.create({
      header: translations.error_at_proccessing_order,
      subHeader: translations.error_products_are_not_selected,
      message: translations.message_error_products_are_not_selected,
      buttons: ['OK']
   });
   alert.backdropDismiss = true;
    await alert.present();
    await alert.dismiss();
  }

  async selectTableAlert() {
    let translations = {error_at_proccessing_order: '', error_table_is_not_selected: '', message_error_table_is_not_selected: ''};
    await this.translate.get(['error_at_proccessing_order', 'error_table_is_not_selected', 'message_error_table_is_not_selected']).subscribe((res: {error_at_proccessing_order: string, error_table_is_not_selected: string, message_error_table_is_not_selected: string}) => {
     console.log('Displaying translations:');
     console.log(res);  
     translations = res;
     });
    const alert = await this.alertController.create({
      header: translations.error_at_proccessing_order,
      subHeader: translations.error_table_is_not_selected,
      message: translations.message_error_table_is_not_selected,
      buttons: ['OK']
   });

    await alert.present();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: OrderSummaryPage,
      componentProps: {
        selectedProducts: this.arrayOfSelectedProducts,
        dishesOrdered: this.dishesOrdered,
        beveragesOrdered: this.beveragesOrdered,
        language: this.language,
        origin: this.selectedTable
      }
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.confirmed) {
      let messageOfOrderConfirmed = '';
      await this.translate.get('order_confirmed').subscribe((res : string) => {
        messageOfOrderConfirmed = res;
      });
      const toast = await this.toastController.create({
        message: messageOfOrderConfirmed,
        duration: 2000
      });
      toast.present();
      let routeToNavigate = '/home'+ '/' + this.language;
      this.router.navigate([routeToNavigate]);
    }
  }

  initializeValues() {
    this.selectedBeverages = [];
    this.selectedDishes = [];
    this.arrayOfSelectedProducts = [];
    this.selectedTable = undefined;
    this.tableIsSelected = false;
    this.isDisabledSelectionOfTable = false;
    this.firstLoad = true;
  }

  updateDishes(event) {
    console.log('Displaying event ionChange:');
    console.log(event.detail);
    if (this.firstLoad == false) {
      if (this.selectedDishes.length == 0) {
        this.selectProductAlert();
        this.dishesOrdered = [];
      } else {
      this.countsOfSelectedDishes = new Array(this.selectedDishes.length);
      this.countsOfSelectedDishes = this.countsOfSelectedDishes.fill(1);
      this.selectionOfDishesModal();
      }
    }
  }

  updateBeverages(event) {
    console.log('Displaying event ionChange:');
    console.log(event.detail);
    if(this.firstLoad == false) {
      if (this.selectedBeverages.length == 0) {
        this.selectProductAlert();
        this.beveragesOrdered = [];
      } else {
      this.countsOfSelectedBeverages = new Array(this.selectedBeverages.length);
      this.countsOfSelectedBeverages = this.countsOfSelectedBeverages.fill(1);
      this.selectionOfBeveragesModal();
      }
    }
  }

  async selectionOfDishesModal() {
    let namesOfSelectedDishes = [];
    namesOfSelectedDishes = this.getNamesOfSelectedDishes();
    const modal = await this.modalController.create({
      component: SelectedProductsPage ,
      componentProps: {
        title: 'Selected_dishes',
        selectedProducts: namesOfSelectedDishes,
        countsOfSelectedProducts: this.countsOfSelectedDishes,
        language: this.language,
        idsOfSelectedProducts: this.selectedDishes
      } 
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    console.log('Displaying return of selected dishes:');
    console.log(data);
    this.dishesOrdered = data;
    this.firstLoad = false;
  }

  getNamesOfSelectedBeverages() {
    let namesOfSelectedBeverages = new Array(this.selectedBeverages.length);
    for (let i = 0; i < namesOfSelectedBeverages.length; i++) {
      namesOfSelectedBeverages[i] = this.getNameOfBeverage(this.selectedBeverages[i]);
    }
    return namesOfSelectedBeverages;
  }

  getNameOfBeverage(idOfBeverage) {
    let name = '';
    let found = false;
    let i = 0;
    while (found == false && i < this.beverages.length) {
      if (this.beverages[i]._id == idOfBeverage) {
        found = true;
        name = this.beverages[i].name;
      } else {
        i++;
      }
    }
    return name;
  }

  getNameOfDish(idOfDish) {
    let name = '';
    let found = false;
    let i = 0;
    while (found == false && i < this.dishes.length) {
      if (this.dishes[i]._id == idOfDish) {
        found = true;
        name = this.dishes[i].name;
      } else {
        i++;
      }
    }
    return name;
  }

  getNamesOfSelectedDishes() {
    let namesOfSelectedDishes = new Array(this.selectedDishes.length);
    for (let i = 0; i < namesOfSelectedDishes.length; i++) {
      namesOfSelectedDishes[i] = this.getNameOfDish(this.selectedDishes[i]);
    }
    return namesOfSelectedDishes;
  }

  async selectionOfBeveragesModal() {
    let namesOfSelectedBeverages = [];
    namesOfSelectedBeverages = this.getNamesOfSelectedBeverages();
    const modal = await this.modalController.create({
      component: SelectedProductsPage ,
      componentProps: {
        title: 'Selected_beverages',
        selectedProducts: namesOfSelectedBeverages,
        countsOfSelectedProducts: this.countsOfSelectedBeverages,
        language: this.language,
        idsOfSelectedProducts: this.selectedBeverages
      } 
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
   console.log('Displaying return of selected beverages:');
   console.log(data);
   this.beveragesOrdered = data;
   this.firstLoad = false;
  }

  loadLocations() {
    
    this.restaurateurService.getLocations().subscribe((data :Location[]) => {
      console.log('Displaying locations:');
      this.availableLocations = [];
      for (let i = 0; i < data.length; i++) {
        this.availableLocations.push(data[i].name);
        console.log(data[i].name);
        this.selectedTable = data[i].name;
      }
      console.log(this.availableLocations);
    } );
  }

}
