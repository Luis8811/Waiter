import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController,  ModalController  } from '@ionic/angular';
import {InvoicePage} from '../invoice/invoice.page';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {RestaurateurService} from '../restaurateur.service';
import { OpenedOrder } from '../models/openedOrder';
import {StateOfOrder} from '../models/stateOfOrder';

@Component({
  selector: 'app-close-request',
  templateUrl: './close-request.page.html',
  styleUrls: ['./close-request.page.scss'],
})
export class CloseRequestPage implements OnInit {
  private language = null;
  private labelInvoice = '';
  private labelGetPayment = '';
  private labelCancelOrder = '';
  private openedOrders: OpenedOrder[] = [];
  private indexSelected = 0;
  private orders = [
     {table: 'table 1', price: '30 Euros', _id: '', index: 0 },
     {table: 'table 2', price: '40 Euros', _id: '', index: 1 },
     {table: 'bar', price: '8 Euros'},
     {table: 'table 2', price: '12 Euros', _id: '', index: 2}
    ];

  constructor(public toastController: ToastController, public alertController: AlertController, public modalController: ModalController, private translate: TranslateService, private activatedRoute: ActivatedRoute, private restaurateurService: RestaurateurService) {
    this.language = this.activatedRoute.snapshot.paramMap.get('language');
    this.translate.use(this.language);
    this.translate.get('invoice_button').subscribe((res : string) => {
      this.labelInvoice = res;
    });

    this.translate.get('get_payment_button').subscribe((res : string) => {
      this.labelGetPayment = res;
    });

    this.translate.get('cancel_order_button').subscribe((res : string) => {
      this.labelCancelOrder = res;
    });
   }

  ngOnInit() {
    this.orders = new Array();
    this.getOpenedOrders();
  }

  async segmentChanged(event) {
    let optionSelected = event.detail.value;
    console.log('Displaying optionSelected: ' + optionSelected);
    const subString = optionSelected.substr(optionSelected.indexOf(','));
    console.log('Displaying substring: ' + subString);
    this.indexSelected = parseInt(subString.substr(1));
    console.log('Index selected: ' + this.indexSelected);
    optionSelected = optionSelected.substring(0, optionSelected.indexOf(','));
    if (optionSelected === this.labelInvoice) {
      this.presentModal();
    } else {
      if (optionSelected === this.labelGetPayment) {
        let idOfSelectedOrder = this.openedOrders[this.indexSelected]._id;
        this.getPaymentAndCloseOrder(idOfSelectedOrder); 
        let messageOfPayment = '';
        this.translate.get('payment_was_performed').subscribe((res : string) => {
          messageOfPayment = res;
        });
        const toast = await this.toastController.create({
          message: messageOfPayment,
          duration: 2000
        });
        toast.present();
      } else {
        // Cancelling order
        this.cancelOrderAlert();
      }
    }
  }

  async cancelOrderAlert() {
    let translations = {cancelling_order_header: '', cancelling_order_subheader: '', confirmation_of_cancelling_order: ''};
   await this.translate.get(['cancelling_order_header', 'cancelling_order_subheader', 'confirmation_of_cancelling_order']).subscribe((res: {cancelling_order_header: string, cancelling_order_subheader: string, confirmation_of_cancelling_order: string}) => {
    console.log('Displaying translations:');
    console.log(res);  
    translations = res;
    });
    const alert = await this.alertController.create({
      header: translations.cancelling_order_header,
      subHeader: translations.cancelling_order_subheader,
      message: translations.confirmation_of_cancelling_order,
      buttons: [{text: 'No', role: 'cancel', handler: (noAction) => {console.log('Button of No cancel the order was pressed'); }},
      {text: 'Yes', handler: (cancelOrder) => {
        console.log('Button of cancelling the order was pressed');
        this.showAlertOfOrderCanceled();
        let idOfOrder = this.openedOrders[this.indexSelected]._id;
        this.cancelOrder(idOfOrder);
      }}]
   });
    await alert.present();
  }

  async showAlertOfOrderCanceled() {
    let translations = {cancelling_order_header: '', cancelling_order_subheader: '', cancelling_order_successful: ''};
    await this.translate.get(['cancelling_order_header', 'cancelling_order_subheader', 'cancelling_order_successful']).subscribe((res: {cancelling_order_header: string, cancelling_order_subheader: string, cancelling_order_successful: string}) => {
      console.log('Displaying translations:');
      console.log(res); 
      translations = res;
    });
    const alert = await this.alertController.create({
      header: translations.cancelling_order_header,
      subHeader: translations.cancelling_order_subheader,
      message: translations.cancelling_order_successful,
      buttons: ['Ok']
   });

    await alert.present();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: InvoicePage ,
      componentProps: {
        selectedProducts: this.openedOrders[this.indexSelected].products,
        amount: this.openedOrders[this.indexSelected].amount,
        _id: this.openedOrders[this.indexSelected]._id,
        origin: this.openedOrders[this.indexSelected].origin,
        language: this.language
      }
    });
    await modal.present();
  }

  getOpenedOrders() {
    this.restaurateurService.getOpenedOrders().subscribe((data : OpenedOrder[]) => {
      this.openedOrders = data;
      console.log('Displaying opened orders obtained from the service...');
      console.log(this.openedOrders);
      console.log('Updating the list with orders in the GUI...');
      this.orders = [];
      for (let i = 0; i < this.openedOrders.length; i++) {
        this.orders.push({table: this.openedOrders[i].origin, price: this.openedOrders[i].amount.toString() + ' Euros', index: i, _id: this.openedOrders[i]._id});
      }
    });
  }

  getPaymentAndCloseOrder(idOfOrder) {
    this.restaurateurService.closeOrder(idOfOrder).subscribe((data : StateOfOrder) => {
      console.log(data);
      this.ngOnInit();
    });
  }

  cancelOrder(idOfOrder) {
    this.restaurateurService.cancelOrder(idOfOrder).subscribe((data : StateOfOrder) => {
      console.log(data);
      this.ngOnInit();
    });
  }

}
