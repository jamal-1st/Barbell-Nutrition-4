import { Component, ViewChild } from '@angular/core';
import { LoadingController, ToastController, MenuController } from '@ionic/angular';
import { UserService } from 'src/Services/user.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { DataService } from 'src/Services/data.service';
import { OrderService } from 'src/Services/order.service';
import { IonInfiniteScroll } from '@ionic/angular';


@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.page.html',
  styleUrls: ['./order-history.page.scss'],
})
export class OrderHistoryPage {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  avatarPic = "../assets/img/logo.png";
  orderHistory: any;
  orderStatusData: any;
  dataSkelton = false;
  emptyOrderPic = "../assets/img/orderP.png";
  orderEmpty: boolean = false;
  reOrderReferesh: boolean = false;
  pageNumber = 0;
  availabilityMsg: any;
  availabilityStatus: boolean;

  constructor(
    private services: OrderService,
    private dataServices: DataService,
    private route: ActivatedRoute,
    private loadCtrl: LoadingController,
    private toastController: ToastController,
    private menuCtrl: MenuController,
    private router: Router

  ) {
    this.getOrderHistory();
    this.menuCtrl.enable(true, 'menu');

    //------------------- param geting for refresh order history ---------------------//
    // this.route.queryParams.subscribe(params => {
    //   console.log("param reviced", params.refresh);
    //   this.reOrderReferesh = params.refresh;
    //   if (this.reOrderReferesh) {
    //     this.doRefresh(event);
    //   }
    //   else {
    //     console.log('no need for referesh page');
    //   }
    // });
  }



  // ------------- Pull to refresh ---------//
  doRefresh(event) {
    this.services.getOrderHistory(this.pageNumber).then((Jsonresponse) => {
      let response = JSON.parse(Jsonresponse);
      if (response.status == true) {
        event.target.complete()
        console.log("staus true", response.status);
        console.log("Response Get order data", response.data);
        this.orderHistory = response.data;
        this.availabilityMsg = response.availability_msg;
        this.availabilityStatus = response.availability_status;
        console.log("  this.availabilityStatus", this.availabilityStatus);
      }
      else if (response.status == false) {
        console.log("staus false", response.status);
        console.log("staus false", response);
        event.target.complete();
        let msge = response.msg;
        this.presentToast(msge);
      }
    }).catch(error => {
      event.target.complete();
      console.log("Register Api error", error);
    });

  }


  //----------------- infinite scroll...pagenation..-----------------//
  loadData(event) {
    console.log('loadDatat function');
    this.pageNumber++;
    this.services.getOrderHistory(this.pageNumber).then((Jsonresponse) => {
      let response = JSON.parse(Jsonresponse);
      if (response.status == true) {
        this.dataSkelton = true;
        console.log("staus true", response.status);
        response.data.forEach(element => {
          this.orderHistory.push(element)
        })
        //this.orderHistory = (response.data);
        console.log("Response Get  for infinit scroll order data", this.orderHistory);
        event.target.complete();
      }
      else if (response.status == false) {
        console.log("staus false", response.status);
        console.log("staus false", response);
        // this.orderEmpty = true;
        event.target.complete();
        this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
        // this.dataSkelton = true;
        // let msge = response.msg;
        // this.presentToast(msge);

      }
    }).catch(error => {
      console.log("Register Api error", error);
      this.orderEmpty = true;
      this.dataSkelton = true;
      let msg = "Server Error!";
      this.presentToast(msg);
      event.target.complete();
    });

  }

  ///---------- Get  all order ----------///
  getOrderHistory() {
    this.services.getOrderHistory(this.pageNumber).then((Jsonresponse) => {
      let response = JSON.parse(Jsonresponse);
      if (response.status == true) {
        this.dataSkelton = true;
        console.log("staus true", response.status);
        console.log("Response Get order data", response);
        this.orderHistory = response.data;
        this.availabilityMsg = response.availability_msg;
        this.availabilityStatus = response.availability_status;
        console.log("  this.availabilityStatus", this.availabilityStatus);
      }
      else if (response.status == false) {
        console.log("staus false", response.status);
        console.log("staus false", response);
        this.orderEmpty = true;
        this.dataSkelton = true;
        let msge = response.msg;
        this.presentToast(msge);
      }
    }).catch(error => {
      console.log("Register Api error", error);
      this.orderEmpty = true;
      this.dataSkelton = true;
      let msg = "Server Error!";
      this.presentToast(msg);
    });
  }

  //------------ order status  move to order detail page --------//
  orderStatus(orderDetail: any) {
    this.orderStatusData = orderDetail;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        order: JSON.stringify(this.orderStatusData),
        availabilityMsg: this.availabilityMsg,
        availabilityStatus: this.availabilityStatus

      }
    };
    this.dataServices.restuarantClosed = this.availabilityStatus;
    console.log(' this.dataServices.restuarantClosed', this.dataServices.restuarantClosed);
    this.router.navigate(['order-status'], navigationExtras);
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
}