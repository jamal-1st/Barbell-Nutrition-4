import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  menuDetailToNextPage: any = [];
  menuItemPassToNextPage: any = [];
  tax: any;
  menuChange: any = 'true';
  delvieryCharges: any;
  transactionFee: any;
  setting: any;
  customerId: any;
  liveUrl: boolean = false;
  venueId: any = 1;
  baseUrl: any;
  checkVersionRes: any;
  androidAppVersion: string = '2.0.0';
  iosAppVersion: string = '2.0.0';
  restuarantClosed: boolean = false;
  restuarantOpeningClosingApiResponse: any;

  constructor() {

    if (this.liveUrl == true) {

      this.baseUrl = "https://barbellnutrition.uk/admin/api/customer/";

    }
    else {
     // this.baseUrl = 'https://barbell2.mynewdesign.co.uk/barbell_new_app_api/api/customer_new/';
      this.baseUrl = 'https://barbell2.mynewdesign.co.uk/barbell_20190925/api/customer_new/';
    }
  }
  restuarantClosedOrOpen() {

  }
}
