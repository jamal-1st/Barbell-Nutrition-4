import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../Services/user.service';
import { DataService } from '../../Services/data.service';

import { ReOrderModalPage } from '../re-order-modal/re-order-modal.page';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.page.html',
  styleUrls: ['./order-status.page.scss'],
})
export class OrderStatusPage implements OnInit {

  orderDetail: any;
  orderStatusSegment: string;
  odertiming: any;
  orderId: any;
  orderStatus: any;
  paymentMethod: any;
  paymentStatus: any;
  addressDetail: any;
  orderItem: any;
  taxRate: any;
  shippingCharges: any;
  total: any;
  subTotal: any;
  transctionRate: any;
  totalCard: any;
  availabilityMsg: any;
  availability: boolean;
  availabilityStatus: boolean;
  restuarantClosedMsg: any;


  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private services: UserService,
    private toastController: ToastController,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private dataServices: DataService,
    private nativePageTransitions: NativePageTransitions,
    private modalController: ModalController
  ) {
    //sthis.menuCtrl.enable(false);
    this.orderStatusSegment = 'order';

  }

  ngOnInit() {
    console.log(" this.dataServices.restuarantClosed ngOninit", this.dataServices.restuarantClosed)
    this.route.queryParams.subscribe(params => {
      let orderDetail = JSON.parse(params.order);
      console.log("order detail", orderDetail);
      this.orderDetail = orderDetail;
      this.availabilityMsg = params.availabilityMsg,
        this.availability = params.availabilityStatus,
        console.log("order availabilityStatus", this.availability)
      this.getOrderStatusData();
      // this.restuarantStatus();
    });
  }
  //--------- Back arrow function--------//
  backArrow() {
    console.log("back function");
    let options: NativeTransitionOptions = {
      direction: 'right',
      duration: 400,
      slowdownfactor: -1,
      iosdelay: 50
    };

    this.nativePageTransitions.slide(options);
    this.navCtrl.navigateBack('order-history');
  }


  // restuarantStatus() {

  // }

  getOrderStatusData() {

    // ------- this variable for order items -------/////
    this.orderItem = this.orderDetail.items;

    // ------- these variable for order status -------/////
    this.orderId = this.orderDetail.order_id;
    this.orderStatus = this.orderDetail.status;
    this.paymentMethod = this.orderDetail.payment_method;
    this.paymentStatus = this.orderDetail.is_payment_confirmed;

    // ------- this variable for order address -------/////
    this.addressDetail = this.orderDetail.address_detail;

    // ------- this variable for order timing -------/////
    this.odertiming = this.orderDetail.created_time;
    // this.availabilityStatus = this.availability;
    // this.restuarantClosedMsg = this.availabilityMsg;
    // console.log('    this.availabilityStatus = this.availability', this.availabilityStatus);
    // console.log('    this.restuarantClosedMsg = this.restuarantClosedMsg', this.restuarantClosedMsg);
    // ------- this variable for order prices and tax -------/////
    this.subTotal = this.orderDetail.subtotal;
    this.taxRate = this.orderDetail.tax_rate;
    this.shippingCharges = this.orderDetail.shipping_charges;
    this.transctionRate = this.orderDetail.transaction_charges;
    this.total = this.orderDetail.amount;
    var totalChangeFormate = parseFloat(this.total)
    var transctionRateChangeFormate = parseFloat(this.transctionRate)
    this.totalCard = (totalChangeFormate + transctionRateChangeFormate).toFixed(2);

  }

  //---------- Toast for error ----------//
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3500,
      translucent: true,
    });
    toast.present();
  }

  /////---------- Alert----------//////
  async alertFor() {
    const alert = await this.alertCtrl.create({
      header: 'Restaurant closed',
      message: this.availabilityMsg,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'OK',
          handler: () => {
            let options: NativeTransitionOptions = {
              direction: 'right',
              duration: 400,
              slowdownfactor: -1,
              iosdelay: 50
            };
        
            this.nativePageTransitions.slide(options);
            this.navCtrl.navigateBack('order-history');
          }
        }
      ]
    });
    await alert.present();
  }

  async presentModal() {

    if(this.dataServices.restuarantClosed == true){
    const modal = await this.modalController.create({
      component: ReOrderModalPage,
      componentProps: {
        "orderId": this.orderId,
        'amount': this.total,
        'paymentMethod': this.paymentMethod,
        'transactionFee': this.transctionRate
      }
    });
    return await modal.present();
  }
  else if(this.dataServices.restuarantClosed == false){
    this.alertFor()
  }
}

}