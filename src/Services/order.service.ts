import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { DataService } from 'src/Services/data.service';
import 'rxjs/add/operator/map';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  menuItemPassToNextPage: any = [];

  constructor(
    public httpNative: HTTP,
    private dataUser: DataService
  ) {
  }

  //--------------SignIn and SignUp APIs ---------//
  creditCard(creditCard: any, total: any, transaction_fee: any, orderStatus: any, orderId: any) {

    var data = {
      card_no: creditCard.cardNumber,
      ccExpiryMonth: creditCard.expMonth,
      ccExpiryYear: creditCard.expYear,
      cvvNumber: creditCard.cvvNumber,
      transaction_fee: transaction_fee,
      amount: total,
      order_status: orderStatus,
      order_id: orderId
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

  getIndentID(amountGet: any, transactionFeeGet: any) {
    var data = { amount: amountGet, transactionFee: transactionFeeGet };
    var link = this.dataUser.baseUrl + 'payment_intent';
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

  orderPlace(orderData: any, basket: any, addresId: any, paymentMethod: any, platform: any, addInstruction: any, transaction_fee: any, paymentIntentID: any) {

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
      transaction_fee: transaction_fee,
      paymentIntentID: paymentIntentID
    };

    console.log("order API data", data);
    var link = this.dataUser.baseUrl + 'save_order';
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

  reOrder(orderId: any, paymentMethod: any, platformDev: any, addInstruction: any) {
    var data = {
      order_id: orderId,
      platform: platformDev,
      payment_method: paymentMethod,
      additional_instruction: addInstruction,
    };
    var link = this.dataUser.baseUrl + 'save_reorder';
    return this.httpNative.post(link, data, {})
      .then((response) => {
        console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });

  }


  creditCardReorder(creditCard: any) {

    var data = {
      card_no: creditCard.cardNumber,
      ccExpiryMonth: creditCard.expMonth,
      ccExpiryYear: creditCard.expYear,
      cvvNumber: creditCard.cvvNumber,
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

  getOrderHistory(pageNumber: any) {

    var data = { customer_id: this.dataUser.customerId };
    console.log('this.pageNumber', pageNumber);
    var link = this.dataUser.baseUrl + 'get_customer_orders?customer_id=' + this.dataUser.customerId + '&venue_id=' + this.dataUser.venueId + '&page=' + pageNumber;
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