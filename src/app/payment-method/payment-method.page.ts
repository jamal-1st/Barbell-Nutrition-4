import {
  Component
} from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController, Platform, ToastController, NavController, MenuController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/Services/data.service';
import { OrderService } from 'src/Services/order.service';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

declare var Stripe;

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.page.html',
  styleUrls: ['./payment-method.page.scss'],
})

export class PaymentMethodPage {

  card: any;
  clientSecret: any;
  paymentMethod: any;
  payment: any;
  private todo: FormGroup;
  submitAttempt: boolean = false;
  total: any;
  subTotal: any;
  totalCash: any;
  totalCredit: any;
  additionalIntruction: any;
  addressData: any;
  setting: any;
  tax: any;
  deliveryCharges: any;
  transctionFee: any;
  platformGet: any;
  btnHide: boolean = false;
  orderData: any;
  intentID: any;
  stripeInit: any;
  stripeResponse: any;

  constructor(private formBuilder: FormBuilder,
    private toastController: ToastController,
    private dataServices: DataService,
    private services: OrderService,
    private alertCtrl: AlertController,
    private router: Router,
    private navCtrl: NavController,
    private platform: Platform,
    private nativePageTransitions:NativePageTransitions,
    private route: ActivatedRoute,
    private menuCtrl: MenuController,
    public loadCtrl: LoadingController, ) {

    //------ Constructor start -------//
    this.payment = "cash";
    this.setting = this.dataServices.setting;

    //------ Validation for card data ------//

    this.todo = this.formBuilder.group({
      cardNumber: ['', Validators.required],
      cvvNumber: ['', Validators.required],
      expMonth: ['', Validators.required],
      expYear: ['', Validators.required],
    });

    // ---- Geting params values  ------//

    this.route.queryParams.subscribe(params => {
      console.log("param reviced", params.address);
      this.addressData = JSON.parse(params.address);
      console.log("params  this.addressData", this.addressData);
      //// calculate total price
      this.getDataFromLocalStorage();
    });

    // ---- Selecting platform ------//

    if (this.platform.is('android')) {
      this.platformGet = 'android'
    } else if (this.platform.is('ios')) {
      this.platformGet = 'ios';
      console.log("IOS", this.platformGet);
    }
    else {
      this.platformGet = 'desktop'
    }
  }
  ///////---------- End Constructor --------------///////

  backArrow() {
    this.navCtrl.back();
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
    this.services.getIndentID(this.totalCash, this.transctionFee).then((Jsonresponse) => {
      let response = JSON.parse(Jsonresponse);
      console.log("intent response", response);
      if (response.intent == null) {
        loading.dismiss();
        this.presentToast('Intent Null');
      }
      else if (response.intent != null) {
        this.intentID = response.intentID
        console.log('indentID', response.intentID);
        console.log('client secret', response.clientSecret);
        this.clientSecret = response.clientSecret;
        let stripeRes = Stripe('pk_test_U8qqPcFXoDsAP7MjxZ8j7sOg00JBFYcwMB', {
          stripeAccount: 'acct_1ESMujEDVV66TK6z'
        });
        this.stripeResponse = stripeRes;
        this.setStripeElement(this.stripeResponse, loading);
        // loading.dismiss();
        // this.presentToast('Stripe Public Key Error!');

      }
    }).catch((error) => {
      console.log("error in intendID for strip", error);
      this.presentToast("Stripe Server Error Get_IntentID");
    });
  }

  setStripeElement(stripe: any, loading) {
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
    loading.dismiss();
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
        this.presentToast('Stripe handlePayementCard Error');
      } else if (response.paymentIntent && response.paymentIntent.status === 'succeeded') {
        this.cardPayment('card', loading);
        console.log('response succeeded', response);
      }
    }).catch((error) => {
      console.log("error stripe", error);
      loading.dismiss();
      this.presentToast('Server Error');
    });
  }

  /**
     * Name:       cashPayment
     * Description: Place order
     **/
  cardPayment(payMethod: any, loading: any) {
    this.paymentMethod = payMethod;
    var otherData = {
      'tax': this.tax,
      'subTotal': this.subTotal,
      'total': this.totalCash,
      'taxRate': this.tax,
      'shippingChr': this.deliveryCharges,
      'addInstruc': this.additionalIntruction
    };
    this.orderData = otherData;
    var basket = JSON.parse(localStorage.getItem("cart"));
    var basketIOS = localStorage.getItem("cart");
    this.services.orderPlace(this.orderData, basketIOS, this.addressData.address_id, this.paymentMethod, this.platformGet, this.additionalIntruction, this.transctionFee, this.intentID).then((Jsonresponse) => {
      console.log("response with out parse", Jsonresponse);
      let response = JSON.parse(Jsonresponse);
      console.log('response', response);
      if (response.status == true) {
        // if (this.paymentMethod == 'cash') {
        this.btnHide = false;
        loading.dismiss();
        localStorage.removeItem("cart");
        this.alertShowMethod();
        console.log("staus true", response.status);
      }
      else if (response.status == false) {
        console.log("staus false", response.status);
        loading.dismiss();
        this.btnHide = false;
        let msg = response.msg;
        this.presentToast(msg);
      }
    }).catch(error => {
      console.log("Order Place Api error", error);
      this.presentToast("Server Error");
      loading.dismiss();
      this.btnHide = false;
    });
  }

  /**
     * Name:       cashPayment
     **/
  async cashPayment() {
    const loading = await this.loadCtrl.create({
    });
    await loading.present();
    this.paymentMethod = 'cash';
    var otherData = {
      'tax': this.tax,
      'subTotal': this.subTotal,
      'total': this.totalCash,
      'taxRate': this.tax,
      'shippingChr': this.deliveryCharges,
      'addInstruc': this.additionalIntruction
    };
    this.orderData = otherData;
    var basket = JSON.parse(localStorage.getItem("cart"));
    var basketIOS = localStorage.getItem("cart");
    this.services.orderPlace(this.orderData, basketIOS, this.addressData.address_id, this.paymentMethod, this.platformGet, this.additionalIntruction, null, null).then((Jsonresponse) => {
      console.log("response with out parse", Jsonresponse);
      let response = JSON.parse(Jsonresponse);
      console.log('response', response);
      if (response.status == true) {
        // if (this.paymentMethod == 'cash') {
        this.btnHide = false;
        loading.dismiss();
        localStorage.removeItem("cart");
        this.alertShowMethod();
        console.log("staus true", response.status);
      }
      else if (response.status == false) {
        console.log("staus false", response.status);
        loading.dismiss();
        this.btnHide = false;
        let msg = response.msg;
        this.presentToast(msg);
      }
    }).catch(error => {
      console.log("Order Place Api error", error);
      this.presentToast("Server Error");
      loading.dismiss();
      this.btnHide = false;
    });
  }

  // /**
  //    * Name:        getDataFromLocalStorage
  //    * Description: this fun get data from local storage 'Price' and add delivery charges
  //    **/
  getDataFromLocalStorage() {
    var storeData = JSON.parse(localStorage.getItem("Price"));
    console.log("store Data", storeData);
    this.subTotal = storeData.subTotal;
    this.additionalIntruction = storeData.additionalInst;
    this.tax = storeData.tax;
    this.deliveryCharges = this.addressData.delivery_charges;
    this.transctionFee = this.dataServices.setting.stripe_transaction_fee;
    console.log("tax !!", this.tax);
    console.log("this.deliveryCharges!!", this.deliveryCharges);
    console.log("this.transctionFee!1", this.transctionFee);
    this.calculatioForToatal();
  }

  // /**
  //  * Name:        calculatioForToatal
  //  * Description: calculate total for cash and credit card
  //  **/
  calculatioForToatal() {
    var delCharges = parseFloat(this.deliveryCharges);
    var tax = parseFloat(this.tax);
    var subTotal = parseFloat(this.subTotal);
    var transctionFee = parseFloat(this.transctionFee)
    this.totalCash = (delCharges + tax + subTotal).toFixed(2);
    this.totalCredit = (delCharges + tax + subTotal + transctionFee).toFixed(2);
  }

  /////---------- Alert For confirm oder Item ----------//////
  async alertShowMethod() {
    const alert = await this.alertCtrl.create({
      header: 'Order Placed',
      message: "Your order has been placed successfully",
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            let options: NativeTransitionOptions = {
              direction: 'down',
              duration: 400,
              // slowdownfactor: -1,
              iosdelay: 50
             };
            this.nativePageTransitions.flip(options);
            this.navCtrl.navigateRoot(['order-history']);

          }
        }
      ]
    });
    await alert.present();
  }

  //------- This func shows err msg upon server error --------//
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3500,
      translucent: true,
    });
    toast.present();
  }
}