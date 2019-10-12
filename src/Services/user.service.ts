import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { DataService } from 'src/Services/data.service';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(
    public httpNative: HTTP,
    private dataUser: DataService
  ) {
  }

  //--------------SignIn and SignUp APIs ---------//
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
  //-------------- Customer issue APIs-------------//
  supportForm(supportFormData: any, message: any, platform: any) {
    var data = {
      subject: supportFormData.subject,
      name: supportFormData.name,
      phone: supportFormData.phone,
      email: supportFormData.email,
      message: supportFormData.message,
      platform: platform,
    };
    var link = this.dataUser.baseUrl + 'inquiry';
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

  //------------------- User Address's APIs------------------//
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

  getAddress() {
    var data = { customer_id: this.dataUser.customerId ,venue_id:this.dataUser.venueId};
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

  //------------ Change user profile Info APIs--------------//
  updatePhoneNumber(mobileNumber: any) {
    var data = { mobile_number: mobileNumber, customer_id: 304 };
    var link = this.dataUser.baseUrl + 'verify_update_phone';
    return this.httpNative.post(link, data, {})
      .then((response) => {
        console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });
  }

  updatePhone(mobileNumber: any) {
    var data = { mobile_number: mobileNumber, };
    var link = this.dataUser.baseUrl + 'update_phone';
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

  changeProfile(changeData: any) {
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

  //-------------- Verification and resend code  APIs-------------//
  resendCode(mobileNumber: any) {
    var data = { mobile_number: mobileNumber };
    var link = this.dataUser.baseUrl + 'resend_verification_code';
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

  verificationCode(verification: any, customerId: any) {
    var data = { verification_code: verification.code, customer_id: customerId };
    var link = this.dataUser.baseUrl + 'account_verification';
    return this.httpNative.post(link, data, {})
      .then((response) => {
        console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });
  }


}