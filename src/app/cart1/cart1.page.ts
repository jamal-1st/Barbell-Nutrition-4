import { Component } from '@angular/core';
import { AlertController,NavController,MenuController } from '@ionic/angular';
import { DataService } from 'src/Services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { empty } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart1.page.html',
  styleUrls: ['./cart1.page.scss'],
})

export class Cart1Page {

  qty: number = 1;
  cartDataArray: any = [];
  storeItem: any = [];
  subTotal: any = 0;
  total: any;
  tax: number = 0;
  subTotalNumber = 0;
  totalSum: any;
  additionalIntruction: any;
  cartEmpty: boolean;
  emptyCart: any = '../assets/img/emptyCart.png';
  finalTime:any;
  currentMinutes:any;

  constructor(
    private alertCtrl: AlertController,
    private dataServices: DataService,
    private router: Router,
    private navCtrl:NavController,
    private menuCtrl:MenuController,
  ) {
    //this.menuCtrl.enable(false);
    console.log("cart array data", this.cartDataArray);
  }

  ionViewDidEnter() {
    this.updatePriceAndQty();
    this.clearAllCart();
  }
  backArrow() {
    this.navCtrl.back();
  }

  /*
          Name:        --incrementQty
          Description: --Decrease quantity number
          Params:      --index,qty
 */
  incrementQty(qty: any, index: any) {
    console.log(this.qty + 1);
    qty += 1
    this.increaseQuantity(index, qty);
  }

  /*
       Name:        --decrementQty
       Description: --Decrease quantity number
       Params:      --index,qty
   */
  decrementQty(qty: any, index: any) {
    if (qty - 1 < 1) {
      qty = 1
      this.decreaseQuantity(index, qty);
    } else {
      qty -= 1;
      this.decreaseQuantity(index, qty);
    }
  }

  /*
      Name:        --increaseQuantity
      Description: Increase quantity and price when user click on plus button 
      Params: index,qty
  */
  increaseQuantity(index: number, qty: number) {
    var updatedCart = [];
    var updatedIndex = 0;
    this.storeItem = JSON.parse(localStorage.getItem("cart"));
    console.log("native storage data before update", this.storeItem);
    let i = 0;
    for (i; i < this.storeItem.length; i++) {
      if (i == index) {
        var price = this.storeItem[i].alltemSum;
        this.storeItem[i].quantity = qty;
        var priceUpdate = price * qty;
        this.storeItem[i].qtyAndItemSum = priceUpdate;
        updatedCart[updatedIndex] = this.storeItem[i];
        updatedIndex++;
      }
      else {
        updatedCart[updatedIndex] = this.storeItem[i];
        updatedIndex++;
      }
    }
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    var data = JSON.parse((localStorage.getItem('cart')));
    console.log("native storage data update", data);
    this.updatePriceAndQty();
  }

  /*
      Name:        ---decreseQuantity
      Description: -Increase quantity and price when user click on plus button 
      Params:      -index:number ,qty:number
  */
  decreaseQuantity(index: number, qty: number) {
    var updatedCart = [];
    var updatedIndex = 0;
    this.storeItem = JSON.parse(localStorage.getItem("cart"));
    console.log("native storage data before update", this.storeItem);
    let i = 0;
    for (i; i < this.storeItem.length; i++) {
      if (i == index) {
        var price = this.storeItem[i].alltemSum;
        this.storeItem[i].quantity = qty;
        var priceUpdate = price * qty;
        this.storeItem[i].qtyAndItemSum = priceUpdate;
        updatedCart[updatedIndex] = this.storeItem[i];
        updatedIndex++;
      }
      else {
        updatedCart[updatedIndex] = this.storeItem[i];
        updatedIndex++;
      }
    }
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    var data = JSON.parse((localStorage.getItem('cart')));
    console.log("native storage data update", data);
    this.updatePriceAndQty();
  }

  /*
      Name:        --deleteItem()
      Description: Delete item when user click on cross button 
      Params: Inex:number
  */
  deleteItem(index: number) {
    var updatedCart = [];
    var updatedIndex = 0;
    this.storeItem = JSON.parse(localStorage.getItem("cart"));
    console.log("native storage data before update", this.storeItem);
    let i = 0;
    for (i; i < this.storeItem.length; i++) {
      if (i != index) {
        updatedCart[updatedIndex] = this.storeItem[i];
        updatedIndex++;
      }
    }
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    var data = JSON.parse((localStorage.getItem('cart')));
    console.log("native storage data update", data);
    this.updatePriceAndQty();
  }

  /*
      Name:         --totalPrice()
      Description:  --Calculate items total price and adjust tax rate
  */
  totalPrice() {
    var taxValue = this.dataServices.setting.tax;
    console.log("tax", taxValue);
    this.subTotalNumber = 0;
    for (let i = 0; i < this.cartDataArray.length; i++) {
      this.subTotalNumber = this.subTotalNumber + parseFloat(this.cartDataArray[i].qtyAndItemSum);
      console.log("subTotal in loop", this.subTotalNumber);
    }
    this.subTotal = this.subTotalNumber.toFixed(2);
    var subTotalCal = parseFloat(this.subTotal);
    console.log("subTotal", this.subTotal);
    var taxCal = this.subTotalNumber.toFixed(2);
    var tax = (parseFloat(taxCal) * taxValue / 100).toFixed(2);
    console.log("tax", tax);
    this.tax = parseFloat(tax);
    var total = (this.tax + subTotalCal);
    this.totalSum = total;
    this.total = this.totalSum.toFixed(2);
    console.log("total", total);
  }

  /////---------- Alert For Delete Item ----------//////
  async alertDelteForItem(index: any, deletItemName: any) {
    const alert = await this.alertCtrl.create({
      header: 'Remove Basket Item',
      message: "Are you sure you want to delete  " + deletItemName + ".",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'OK',
          handler: () => {
            this.deleteItem(index);
          }
        }
      ]
    });
    await alert.present();
  }

  //////----  updatePriceAndQty---/////

  updatePriceAndQty() {
    this.cartDataArray = JSON.parse((localStorage.getItem('cart')));
    if (this.cartDataArray == null || this.cartDataArray.length == 0) {
      this.cartEmpty = true;
    }
    else {
      this.cartEmpty = false;
      this.totalPrice();
    }
  }

  //////---- Move to address page ---/////
  deliveryAddress() {
    var storeItem = JSON.parse(localStorage.getItem('profile'));
    console.log("store item length!!", storeItem);
    if (storeItem == null) {
      console.log("alert");
      this.alertForLogin();
    }
    else {
      var data = {
        'total': this.total,
        'subTotal': this.subTotal,
        'tax': this.tax,
        'additionalInst': this.additionalIntruction
      };
      localStorage.setItem('Price', JSON.stringify(data));
      this.router.navigate(['address']);

    }
  }

  /////---------- Alert ForalertForLogin----------//////
  async alertForLogin() {
    const alert = await this.alertCtrl.create({
      message: "Sign In or Sign Up for further process",
      buttons: [
        {
          text: 'Sign In',
          cssClass: 'secondary',
          handler: () => {
            this.router.navigate(['login']);
          }
        }, {
          text: 'Sign Up',
          handler: () => {
            this.router.navigate(['register']);
          }
        }
      ]
    });
    await alert.present();
  }

   ////---------clear all cart -----------////
   clearAllCart() {
    var timeOfUpdate = new Date();
    this.currentMinutes = timeOfUpdate.getTime();
    var timerForCart = JSON.parse(localStorage.getItem('time'));
    console.log('currentMinutes get', this.currentMinutes);
    console.log('timerForCart get', timerForCart);
  
    if (timerForCart == null || timerForCart.length == 0) {
      console.log("empty cart for time if")
      JSON.stringify(localStorage.setItem('time', this.currentMinutes));
    }
    else {
      this.finalTime = this.currentMinutes - timerForCart;
      console.log("final time", this.finalTime);
      var minutes =  1000 * 60;
      let minutesCheck = this.finalTime/minutes;
      if (minutesCheck>= 90) {
        localStorage.removeItem('time');
        localStorage.removeItem('cart');
        this.cartEmpty = true
        this.alertFor("Your session has expired", 'Please re-select your items.');
      }
      else {
        JSON.stringify(localStorage.setItem('time', this.currentMinutes));
      }
    }

  }

  clearAllCartCclickOnBtn() {
    var timeOfUpdate = new Date();
    this.currentMinutes = timeOfUpdate.getTime();
    var timerForCart = JSON.parse(localStorage.getItem('time'));
    console.log('currentMinutes get', this.currentMinutes);
    console.log('timerForCart get', timerForCart);
    if (timerForCart == null || timerForCart.length == 0) {
      console.log("empty cart for time if")
      JSON.stringify(localStorage.setItem('time', this.currentMinutes));
      this.deliveryAddress();
    }
    else {
      this.finalTime = this.currentMinutes - timerForCart;
      console.log("final time", this.finalTime);
      var minutes =  1000 * 60;
      let minutesCheck = this.finalTime/minutes;
      if (minutesCheck>= 90) {
        localStorage.removeItem('time');
        localStorage.removeItem('cart');
        this.cartEmpty = true
       this.alertFor("Your session has expired", 'Please re-select your items.');
      }
      else {
        JSON.stringify(localStorage.setItem('time', this.currentMinutes));
        this.deliveryAddress();
      }
    }

  }
    /////---------- Alert For time expire  ----------//////
    async alertFor(headerMsg:any,message:any) {
      const alert = await this.alertCtrl.create({
        header: headerMsg,
        message: message,
        backdropDismiss:false,
        buttons: [
        {
            text: 'OK',
            handler: () => {
              this.router.navigate(['menu']);
            }
          }
        ]
      });
      await alert.present();
    }

}
