import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { DataService } from 'src/Services/data.service';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class BarbellInfoService {

  constructor(
    public httpNative: HTTP,
    private dataUser: DataService,
  ) {
  }

  getMenuItems() {
    var link = this.dataUser.baseUrl + 'get_menu_items?venue_id=' + this.dataUser.venueId;
    return this.httpNative.get(link, {}, {})
      .then((response) => {
        // console.log("Response Data: ", response.data);
        return response.data;
      }).catch(error => {
        console.log("Error: ", error);
        return error;
      });
  }

  aboutUs() {
    var link = this.dataUser.baseUrl + 'about?venue_id=' + this.dataUser.venueId;
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

  notification(pageNumber: any) {
    var link = this.dataUser.baseUrl + 'get_customer_notifications?customer_id=' + this.dataUser.customerId + '&page=' + pageNumber;
    console.log("server data pageNumber", pageNumber);
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
}