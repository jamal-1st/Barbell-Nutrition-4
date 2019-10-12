import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HTTP } from '@ionic-native/http/ngx';
import { DataService } from 'src/Services/data.service';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  menuItemPassToNextPage: any = [];

  constructor(
    private http: Http,
    public httpNative: HTTP,
    private dataUser: DataService
  ) {
  }

  addAddress(addAddress: any) {

    var data = { customer_id: this.dataUser.customerId, county: addAddress.country, town: addAddress.town, title: addAddress.description, addressLine1: addAddress.address, postal_code: addAddress.postCode };
    var link = this.dataUser.baseUrl + 'customer_address';
    return this.httpNative.post(link, data, {})
      .then((response) => {
        console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });

  }

  avaliablityOfResturent() {

    var link = this.dataUser.baseUrl + 'availability?venue_id=' + this.dataUser.venueId;
    return this.httpNative.get(link, {}, {})
      .then((response) => {
        console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });

  }

  checkVersion() {
    var link = this.dataUser.baseUrl + 'check_version?venue_id=' + this.dataUser.venueId;
    return this.httpNative.get(link, {}, {})
      .then((response) => {
        console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });
  }

  getAddress() {

    var data = { customer_id: this.dataUser.customerId };
    var link = this.dataUser.baseUrl + 'get_customer_all_address?customer_id=' + this.dataUser.customerId + '&venue_id=' + this.dataUser.venueId;
    return this.httpNative.get(link, {}, {})
      .then((response) => {
        console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });

  }

  deleteAddress(deleteAddress: any) {

    var data = { address_id: deleteAddress };
    var link = this.dataUser.baseUrl + 'delete_customer_address';
    return this.httpNative.post(link, data, {})
      .then((response) => {
        console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });

  }

  creditCard(creditCard: any, total: any, transaction_fee: any) {

    var data = {
      card_no: creditCard.cardNumber,
      ccExpiryMonth: creditCard.expMonth,
      ccExpiryYear: creditCard.expYear,
      cvvNumber: creditCard.cvvNumber,
      transaction_fee: transaction_fee,
      amount: total
    };
    var link = this.dataUser.baseUrl + 'addmoney/stripe';
    console.log("credit card services data", data);
    return this.httpNative.post(link, data, {})
      .then((response) => {
        console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });

  }

  orderPlace(orderData: any, basket: any, addresId: any, paymentMethod: any, platform: any, addInstruction: any, transaction_fee: any) {


    var data = {
      venue_id: this.dataUser.venueId,
      customer_id: this.dataUser.customerId,
      payment_method: paymentMethod,
      order_type: 'delivery',
      address_id: addresId,
      sub_total: orderData.subTotal,
      total: orderData.total,
      tax_rate: orderData.taxRate,
      tax: orderData.tax,
      shipping_type: 'delivery',
      shipping_charges: orderData.shippingChr,
      additional_instruction: addInstruction,
      platform: platform,
      basket: basket,
      transaction_fee: transaction_fee
    };
    // var data = JSON.parse(data)
    console.log("order API data", data);
    var link = this.dataUser.baseUrl + 'order';
    console.log('Services orderPlace data---change-->>>>', data);
    return this.httpNative.post(link, data, {})
      .then((response) => {
        console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });

  }

  login(loginData: any, firebaseToken: any, platform: any, uniqueDId: any) {

    var data = {
      email: loginData.email, password: loginData.password,
      venue_id: this.dataUser.venueId,
      token: firebaseToken,
      device_type: platform,
      device_id: uniqueDId
    };
    var link = this.dataUser.baseUrl + 'login';
    console.log("login data before API hit", data);
    return this.httpNative.post(link, data, {})
      .then((response) => {
        console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });

  }

  notification() {

    var link = this.dataUser.baseUrl + 'get_customer_notifications?customer_id=' + this.dataUser.customerId;
    return this.httpNative.get(link, {}, {})
      .then((response) => {
        console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });

  }

  deleteNotification(deleteId: any) {

    var data = { notification_id: deleteId };
    var link = this.dataUser.baseUrl + 'delete_customer_notification';
    return this.httpNative.post(link, data, {})
      .then((response) => {
        console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });
  }

  changePassword(newPassword: any) {

    var data = { new_password: newPassword, customer_id: this.dataUser.customerId };
    var link = this.dataUser.baseUrl + 'change_password';
    //this.httpNative.setDataSerializer('json');
    return this.httpNative.post(link, data, {})
      .then((response) => {
        console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });

  }

  register(registerData: any) {

    var data = {
      venue_id: this.dataUser.venueId,
      mobile_number: registerData.phone,
      last_name: registerData.second,
      first_name: registerData.first,
      email: registerData.email,
      password: registerData.password
    };

    var link = this.dataUser.baseUrl + 'register';
    console.log('services register data', data);
    return this.httpNative.post(link, data, {})
      .then((response) => {
        console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });

  }

  saveOrderTransaction(creditCard: any, total: any, transaction_fee: any, order_id: any, receipt_url: any) {

    var data = {
      receipt_url: receipt_url,
      transaction_fee: transaction_fee,
      order_id: order_id,
      customer_id: this.dataUser.customerId,
      card_no: creditCard.cardNumber,
      ccExpiryMonth: creditCard.expMonth,
      ccExpiryYear: creditCard.expYear,
      cvvNumber: creditCard.cvvNumber,
      amount: total
    };
    var link = this.dataUser.baseUrl + 'save_order_transaction';
    console.log('services saveOrderTransaction data', data);
    return this.httpNative.post(link, data, {})
      .then((response) => {
        console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });

  }

  getOrderHistory() {

    // var data = { customer_id: this.dataUser.customerId };
    // var link = this.dataUser.baseUrl + 'get_customer_orders?customer_id=' + this.dataUser.customerId + '&venue_id=' + this.dataUser.venueId;
    // console.log('services getOrderHistory data', data);
    // return this.http.get(link)
    //   .pipe(map((res: any) => res.json()));

    var data = { customer_id: this.dataUser.customerId };
    var link = this.dataUser.baseUrl + 'get_customer_orders?customer_id=' + this.dataUser.customerId + '&venue_id=' + this.dataUser.venueId;
    //this.httpNative.setDataSerializer('json');
    return this.httpNative.get(link, {}, {})
      .then((response) => {
        console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });
  }

  verificationCode(verification: any, customerId: any) {

    var data = { verification_code: verification.code, customer_id: customerId };
    var link = this.dataUser.baseUrl + 'email_verification';
    return this.httpNative.post(link, data, {})
      .then((response) => {
        console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });

  }

  changeProfile(changeData: any) {

    // var data = { customer_id: this.dataUser.customerId, first_name: changeData.firstName, last_name: changeData.lastName, email: changeData.email, mobile_number: changeData.number };
    // var link = this.dataUser.baseUrl + 'customer_update';
    // console.log('services changeProfile data', data);
    // return this.http.post(link, data)
    //   .pipe(map((res: any) => res.json()));
    var data = { customer_id: this.dataUser.customerId, first_name: changeData.firstName, last_name: changeData.lastName, email: changeData.email, mobile_number: changeData.number };
    var link = this.dataUser.baseUrl + 'customer_update';
    // this.httpNative.setDataSerializer('json');
    return this.httpNative.post(link, data, {})
      .then((response) => {
        console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });

  }

  getMenuItems() {

    var link = this.dataUser.baseUrl + 'get_menu_items?venue_id=' + this.dataUser.venueId;
    // console.log('services verification data', data);
    // return this.http.get(link)
    //   .pipe(map(res => res.json()));
    //this.httpNative.setDataSerializer('json');
    return this.httpNative.get(link, {}, {})
      .then((response) => {
        // console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });

  }

  forgetPassword(todoData: any) {
    var data = { email: todoData.email };
    var link = this.dataUser.baseUrl + 'forgot_password';
    console.log("server data", data);
    return this.httpNative.post(link, data, {})
      .then((response) => {
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });

  }

  handShake() {


    var link = this.dataUser.baseUrl + 'handshake?venue_id=' + this.dataUser.venueId;
    // console.log('services verification data', data);
    // return this.http.get(link)
    //   .pipe(map(res => res.json()));
    //this.httpNative.setDataSerializer('json');
    return this.httpNative.get(link, {}, {})
      .then((response) => {
        console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });

  }

}