import { Component } from '@angular/core';
import { ToastController, LoadingController, NavController,MenuController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/Services/data.service';
import { NativePageTransitions,NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.page.html',
  styleUrls: ['./item-list.page.scss'],
})

export class ItemListPage {
  menuItem: any = [];
  menuName: any;
  totalQty: number = 0;

  constructor(
    private router: Router, private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastController: ToastController,
    private loadCtrl: LoadingController,
    private dataServices: DataService,
    private nativePageTransitions:NativePageTransitions,
    private menuCtrl:MenuController,
  ) {
   
    // param recived data from menu page
    this.route.queryParams.subscribe(params => {
      console.log("param data reviced", params.menuItems);
    });

    this.menuItem = this.dataServices.menuDetailToNextPage
    console.log("data received", this.menuItem);
    this.menuName = this.menuItem[0].category_name;
  }

  //--------- Back arrow function--------//
  backArrow() {
    //this.navCtrl.back();
    this.navCtrl.navigateBack('menu');
  }

  //-------- ion view did load ------//
  ionViewDidEnter() {
    this.totalQuantity();
    this.checkRestuarantAvailabe();
    // this.menuCtrl.enable(false);
  }

  // ----check restuarant cclosed or open------//
  checkRestuarantAvailabe() {
    if (this.dataServices.restuarantClosed == true) {
      this.navCtrl.navigateRoot('restuarant-closed');
    }
    else  {
      console.log("Restuarant opem");

    }
  }
  //------------- Move to item detail page----------//
  async itemDetail(item: any) {
    const loading = await this.loadCtrl.create({
    });
    await loading.present();
    this.dataServices.menuDetailToNextPage = item;
    loading.dismiss();
    this.router.navigate(['item-detail']);

  }

  //------------- Open cart----------//
  cartOpen() {
    var storeItem = JSON.parse(localStorage.getItem("cart"));
    if (storeItem == null || storeItem.length == 0) {
      var msg = 'Your cart is empty';
      console.log("if storeitem", storeItem);
      this.presentToast(msg);
    }
    else {
      let options: NativeTransitionOptions = {
        direction: 'down',
        duration: 600
       };
      this.nativePageTransitions.flip(options);
      console.log("else storeitem");
      this.router.navigate(['cart1']);
    }
  }

  //------------ calculate quantity of cart local storage--------//
  totalQuantity() {
    this.totalQty = 0;
    var storeItem = JSON.parse(localStorage.getItem("cart"));
    if (storeItem == null || storeItem.length == 0) {
      console.log("cart is empty");
    }
    else {
      for (let i = 0; i < storeItem.length; i++) {
        console.log("quantity ", storeItem[i].quantity);
        this.totalQty = this.totalQty + storeItem[i].quantity;
      }
    }
  }
  //----------- Toast when api hit error ------//
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'middle',
      duration: 3500,
      translucent: true,
    });
    toast.present();
  }
}
