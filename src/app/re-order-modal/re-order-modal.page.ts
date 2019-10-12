import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastController, NavController, NavParams, ModalController, LoadingController, Platform, AlertController } from '@ionic/angular';
import { DataService } from '../../Services/data.service';
import { NavigationExtras,Router } from '@angular/router';
import { OrderService } from 'src/Services/order.service';

declare var Stripe;

@Component({
  selector: 'app-re-order-modal',
  templateUrl: './re-order-modal.page.html',
  styleUrls: ['./re-order-modal.page.scss'],
})
export class ReOrderModalPage implements OnInit {

  card: any;
  clientSecret: any;

  orderId: any;
  payment: any;
  todo: FormGroup;
  btnHide: boolean = false;
  submitAttempt: boolean = false;
  devicePlatform: any;
  paymentMethod: any;
  amount: any;
  intentID: any;
  stripeInit: any;
  stripeResponse: any;
  cardOrCash: any;
  transactionFee: any;
  additionalIntruction: any;

  constructor(
    private services: OrderService,
    private navCtrl: NavController,
    private toastController: ToastController,
    private router:Router,
    private alertCtrl: AlertController,
    private platform: Platform,
    private loadCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private navParams: NavParams,
    private dataServices: DataService,
    private modalController: ModalController
  ) {
    this.payment = "cash";
  }

  ngOnInit() {
    console.log(this.navParams);
    this.orderId = this.navParams.data.orderId;
    this.amount = this.navParams.data.amount;
    this.cardOrCash = this.navParams.data.paymentMethod;
    this.transactionFee = this.navParams.data.transactionFee;
    console.log(" this.cardOrCash", this.cardOrCash);
    if (this.platform.is('android')) {
      this.devicePlatform = 'android';
    }
    else if (this.platform.is('ios')) {
      this.devicePlatform = 'ios'
    }
    else {
      this.devicePlatform = 'desktop'
    }
    if (this.cardOrCash == 'card') {
      this.setepStripe();
    }
    else {
      console.log("cash re-order");
    }
  }

  async backArrow() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
  }

  //------------------ press stripe button----------------//
  async setepStripe() {
    const loading = await this.loadCtrl.create({
    });
    await loading.present();
    this.stripeMethodForIntend_ID(loading);
  }

  //--------------- get intend ID for stripe------------//
  stripeMethodForIntend_ID(loading: any) {

    this.services.getIndentID(this.amount, this.transactionFee).then((Jsonresponse) => {
      let response = JSON.parse(Jsonresponse);
      console.log("intent response", response);
      if (response.intent == null) {
        loading.dismiss();
        this.presentToast('Intent Null');
      }
      else if (response.intent != null) {
        this.intentID = response.intentID
        console.log('indentID', response.indentID);
        console.log('client secret', response.clientSecret);
        this.clientSecret = response.clientSecret;
        try {
          let stripeRes = Stripe('pk_test_U8qqPcFXoDsAP7MjxZ8j7sOg00JBFYcwMB', {
            stripeAccount: 'acct_1ESMujEDVV66TK6z'
          });
          this.stripeResponse = stripeRes;
          this.setStripeElement(stripeRes, loading);
        } catch{
          loading.dismiss();
          this.presentToast('Stripe Public Key Error!');
        }
      }
    }).catch((error) => {
      console.log("error in intendID for strip", error);
      this.presentToast("Stripe Server Error Get_IntentID");
    });
  }

  setStripeElement(stripe: any, loaading) {
    console.log('heeloo');
    let elements = stripe.elements();
    var style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };
    this.card = elements.create('card', { hidePostalCode: true, style: style });
    console.log('card ', this.card);

    this.card.addEventListener('change', event => {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    var form = document.getElementById('payment-form');
    form.addEventListener('submit', event => {
      event.preventDefault();

      stripe.createSource(this.card).then(result => {
        if (result.error) {
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          console.log(result);
        }
      });
    });
    this.card.mount('#card-element');
    loaading.dismiss();
  }


  async stripePyaement() {
    const loading = await this.loadCtrl.create({
    });
    await loading.present();
    console.log('add card handle stripe clientSecret', this.clientSecret);
    var card = this.card;
    this.stripeResponse.handleCardPayment(this.clientSecret, card).then((response) => {
      if (response.error) {
        console.log('response error', response.error);
        loading.dismiss();
        this.presentToast(response.error);
      } else if (response.paymentIntent && response.paymentIntent.status === 'succeeded') {
        this.cardReOrder(loading);
        console.log('response succeeded', response);
      }
    }).catch((error) => {
      console.log("error stripe", error);
      loading.dismiss();
      this.presentToast('Server Error');
    })

  }

  //------------- ReOder for "Cash" ----------------//
  async cashReOrder() {
    this.btnHide = true;
    const loading = await this.loadCtrl.create({
    });
    await loading.present();
    this.paymentMethod = 'cash';
    this.services.reOrder(this.orderId, this.devicePlatform, this.paymentMethod,this.additionalIntruction).then((jsonreponse) => {
      let response = JSON.parse(jsonreponse);
      console.log("response resturant avaliable", response)
      if (response.status == true) {
        this.alertShowMethod();
        loading.dismiss();
      }
      else if (response.status == false) {
        loading.dismiss();
        this.btnHide = false;
        this.presentToast(response.msg);
      }
    }).catch((error) => {
      loading.dismiss();
      console.log("error for re order", error);
      this.presentToast("Server Error");
      this.btnHide = false;
    });
  }

  cardReOrder(loading) {

    this.paymentMethod = 'card';
    this.services.reOrder(this.orderId, this.devicePlatform, this.paymentMethod,this.additionalIntruction).then((jsonreponse) => {
      let response = JSON.parse(jsonreponse);
      console.log("response resturant avaliable", response)
      if (response.status == true) {
        // this.creditCard(loading, response.data);
        loading.dismiss();
        this.alertShowMethod();
      }
      else if (response.status == false) {
        loading.dismiss();
        this.btnHide = false;
        this.presentToast(response.msg);
      }
    }).catch((error) => {
      loading.dismiss();
      this.btnHide = false;
      console.log("error for re order", error);
      this.presentToast("Server Error");
    });
  }

  /////---------- Alert For confirm oder Item ----------//////
  async alertShowMethod() {
    const alert = await this.alertCtrl.create({
      header: 'Order Placed',
      message: "Your order has been placed successfully.",
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.modalController.dismiss();
            let navigationExtras: NavigationExtras = {
              queryParams: {

                refresh: true
              }
            };
            this.navCtrl.navigateRoot(['order-history'], navigationExtras);
          }
        }
      ]
    });
    await alert.present();
  }

  //----------------- Toast method-----------//
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3500,
      translucent: true,
    });
    toast.present();
  }
}