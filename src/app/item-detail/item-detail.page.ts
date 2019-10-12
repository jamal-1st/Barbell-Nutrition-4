import { Component,ViewChild } from '@angular/core';
import { LoadingController, NavController, Platform,MenuController ,IonRadioGroup} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/Services/data.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
})

export class ItemDetailPage {

  @ViewChild('radioGroup')radioGroup: IonRadioGroup

  menuItenDetail: any;
  selectedRadioGroup: any;
  selectedRadioItem: any;
  menuOption: any;
  qty: any;
  totalPrices: any;
  itemPrice: any;
  itemPrice_id: any;
  optionPrice: any;
  radioOptionPrice: any;
  checkBoxPrice: number = 0;
  checkNumber: any = 0;
  checkBoxItemArray: any = [];
  radioItemArray: any = [];
  menuOptionRadio: any = [];
  radioMenuCheck: any = [];
  radioNumber: any = 0;
  radioPrice: any = 0;
  radioOptionArray: any = [];
  checkBoxArray: any = [];
  radio: any = [];
  radioMenu: any = [];
  checkBox: any = [];
  basket: any = {};
  storeItem: any = [];
  cart: any = [];

  ////////////////////////////////////////////////////

  categoryId: any;

  categoryName: any;
  title: any;
  menuItemName: any;
  menuItemId: any;
  typeOfOrder: any;
  servingSize: any;
  platformIsIOS: boolean;
  menuCheckBoxUncheck: any;
  selectedCheckBox: any;
  isChecked=false;

  constructor(
    private route: ActivatedRoute,
    private platform: Platform,
    private router: Router,
    private dataServices: DataService,
    private navCtrl: NavController,
    private loadCtrl: LoadingController,
    private menuCtrl:MenuController
  ) {

    //this.menuCtrl.enable(false);
    if (this.platform.is('ios')) {
      this.platformIsIOS = true;
    }
    else {
      this.platformIsIOS = false;
    }
    this.menuItenDetail = this.dataServices.menuDetailToNextPage;
    console.log("received menu data in constructor", this.menuItenDetail);
    this.categoryId = this.menuItenDetail.category_id;
    this.categoryName = this.menuItenDetail.category_name;
    this.title = this.menuItenDetail.title;
    this.menuItemName = this.menuItenDetail.menu_item_name;
    this.menuItemId = this.menuItenDetail.menu_item_id;
    this.typeOfOrder = this.menuItenDetail.type;

    this.qty = 1;
    //this.radioSelect(event, this.menuItenDetail.prices[0]);
    this.radioSelectStart(event, this.menuItenDetail.prices[0]);
    this.storeItem
  }


  radioGroupChange(event) {
    console.log("radioGroupChange", event.detail);
    this.selectedRadioGroup = event.detail;
  }

  //----------- Call function when click on Option-----------//
  async radioSelectStart(event, menuOptionGet) {

    console.log("radioSelect", event.detail);
    console.log("radioSelect menu option", menuOptionGet);
    this.itemPrice = menuOptionGet.price;
    this.itemPrice_id = menuOptionGet.price_id;
    console.log(" this.item data", this.itemPrice, this.itemPrice_id);
    this.menuOption = this.menuItenDetail.menu_options;
    console.log("this.menuOption", this.menuOption);
    this.selectedRadioItem = event.detail;
    //this.servingSize = 4;
    // this.getRadioTypeOption(loading);
    // this.menuOptionRadio = [];
    // this.checkBoxItemArray = [];

  }

  async radioSelect(event, menuOptionGet) {
    const loading = await this.loadCtrl.create({
    });
    await loading.present();
    console.log("radioSelect", event.detail);
    console.log("radioSelect menu option", menuOptionGet);
    this.itemPrice = menuOptionGet.price;
    this.itemPrice_id = menuOptionGet.price_id;
    console.log(" this.item data", this.itemPrice, this.itemPrice_id);
    this.menuOption = menuOptionGet.menu_options;
    console.log("this.menuOption", this.menuOption);
    this.selectedRadioItem = event.detail;
    this.servingSize = 4;
    this.menuOption = this.menuItenDetail.menu_options;
    // this.getRadioTypeOption(loading);
    // this.menuOptionRadio = [];
    // this.checkBoxItemArray = [];
    loading.dismiss();

  }

  ionViewDidEnter() {
    this.resetAlCheckBox();
    console.log("reset ALl Check")
    this.checkRestuarantAvailabe();
  }

  
  // ----check restuarant cclosed or open------//
  checkRestuarantAvailabe() {
    if (this.dataServices.restuarantClosed == true) {
      this.navCtrl.navigateRoot('restuarant-closed');
    }
    else {
      console.log("Restuarant opem");

    }
  }

  ////--------- Back arrow function--------//////
  backArrow() {
    //this.navCtrl.back();
    this.navCtrl.navigateBack('item-list');
  }


  incrementQty() {
    console.log(this.qty + 1);
    this.qty += 1;
  }

  decrementQty() {
    if (this.qty - 1 < 1) {
      this.qty = 1
    } else {
      this.qty -= 1;
    }
  }

  ///------------- Add to cart function start from here ----------------/// 
  addToCart() {
    let itemTotal = this.qty * this.itemPrice;
    this.addRadioAndCheackBoxArray();
  }

  //------- Add radioOption and CheckBoxOption array for local storage  ---------//
  addRadioAndCheackBoxArray() {
    this.radio = document.getElementsByClassName('radioValueAdd');
    for (let j = 0; j < this.radio.length; j++) {
      if (this.radio[j].checked) {
        this.radioOptionArray.push(this.radio[j].value)
      }
    }
    this.radioMenu = document.getElementsByClassName('radioValueMenu');
    for (let k = 0; k < this.radioMenu.length; k++) {
      console.log("radio menu")
      if (this.radioMenu[k].checked) {
        console.log("radio menu checked")
        this.radioMenuCheck.push(this.radioMenu[k].value);
      }
    }
    this.checkBox = document.getElementsByClassName('chaeckBoxValueAdd');
    for (var i = 0; i < this.checkBox.length; i++) {
      if (this.checkBox[i].checked) {
        this.checkBoxArray.push(this.checkBox[i].value);
      }
    }
    this.selectedCheckBox = document.getElementsByClassName('chaeckBoxValueAddSelectedByDefualt');
    for (var i = 0; i < this.selectedCheckBox.length; i++) {
      if (this.selectedCheckBox[i].checked) {
        this.checkBoxArray.push(this.selectedCheckBox[i].value);
      }
    }
    console.log("radio selected itme", this.radioOptionArray);
    console.log("checkBox selected itme", this.checkBoxArray);
    console.log("radio menu selected itme!!!!!!!!!!!!!!!!", this.radioMenuCheck);
    this.menuOptionItemPrice();
  }

  ///----------  Calculate price of menu option item-----------//
  menuOptionItemPrice() {
    let checkBox = 0;;
    let radio = 0;
    let checkBoxTotal = 0;
    let radioToatal = 0;
    for (let i = 0; i < this.radioOptionArray.length; i++) {
      radio = radio + parseFloat(this.radioOptionArray[i].item_price);
    }
    for (let i = 0; i < this.checkBoxArray.length; i++) {
      checkBox = checkBox + parseFloat(this.checkBoxArray[i].item_price);
    }
    checkBoxTotal = parseFloat((checkBox).toFixed(2));
    radioToatal = parseFloat((radio).toFixed(2));
    console.log("optionSum of radioToatal", radioToatal);
    console.log("optionSum if checkBoxTotal ", checkBoxTotal);
    let optionSum = (radio + checkBox).toFixed(2);
    let optionSumFloat = parseFloat(optionSum);
    console.log("optionSum ", optionSum);
    let itemPrice = parseFloat(this.itemPrice);
    var optionAndQtySum = (itemPrice) + (optionSumFloat);
    var qtyAndItem = (this.qty * (optionAndQtySum));
    var qtySumConvertIntoNumber = qtyAndItem.toFixed(2);
    var qtyAndItemSum = parseFloat(qtySumConvertIntoNumber);
    console.log("optionAndQtySum ", optionAndQtySum);
    console.log("qtyAndItemSum ", qtyAndItemSum);
    this.dataSavedInCard(optionAndQtySum, optionSumFloat, qtyAndItemSum);
  }

  /////-------- Reset all check box value -------/////
  resetAlCheckBox() {

    this.checkBox = document.getElementsByClassName('chaeckBoxValueAdd');
    for (var i = 0; i < this.checkBox.length; i++) {
      if (this.checkBox[i].checked) {
        this.checkBox[i].checked = false;
      }
    }
    this.selectedCheckBox = document.getElementsByClassName('chaeckBoxValueAddSelectedByDefualt');
    for (var i = 0; i < this.selectedCheckBox.length; i++) {
      if (!this.selectedCheckBox[i].checked) {
        this.selectedCheckBox[i].checked = true;
      }
    }
  }

  ///---------- Save data in Local Storge-----------//////
  dataSavedInCard(optionAndQtySum: any, optionSumFloat: any, qtyAndItemSum: any) {
    var cart = [];
    var basket = {
      'radioOptionArray': this.radioOptionArray, "checkBoxOptionArray": this.checkBoxArray, 'quantity': this.qty,
      'itemPrice': this.itemPrice, 'categoryId': this.categoryId, 'categoryName': this.categoryName, "menuItemName": this.menuItemName,
      'alltemSum': optionAndQtySum, "optionSum": optionSumFloat,
      'qtyAndItemSum': qtyAndItemSum,
      "menuItemId": this.menuItemId, "type": this.typeOfOrder,
      'radioMenuItemArray': this.radioMenuCheck
    };
    this.storeItem = JSON.parse(localStorage.getItem("cart"));
    console.log("native storage data basket before if", this.storeItem);
    if (this.storeItem == null) {
      // Add new data to localStorage Array
      var cartIf = [];
      cartIf[0] = basket;
      localStorage.setItem('cart', JSON.stringify(cartIf));
      this.storeItem = JSON.parse(localStorage.getItem('cart'));
      console.log("native storage data set data if ", this.storeItem);
      console.log("native storage data set data if length ", this.storeItem.length);
    }
    else {
      let i = 0;
      for (i; i < this.storeItem.length; i++) {
        cart[i] = this.storeItem[i];
      }
      cart[i] = basket;
      localStorage.setItem('cart', JSON.stringify(cart));
      var data = JSON.parse((localStorage.getItem('cart')));
      console.log("native storage data set data else", data);
    }
    //this.navCtrl.back();
    this.navCtrl.navigateRoot('item-list');
  }
}