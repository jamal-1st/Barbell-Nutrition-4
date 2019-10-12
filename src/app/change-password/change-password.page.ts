import { Component } from '@angular/core';
import { LoadingController, ToastController, AlertController, NavController,MenuController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/Services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage {

  public todo: FormGroup;
  submitAttempt: boolean = false;
  // loginData: any;

  constructor(
    private formBuilder: FormBuilder,
    private loadCtrl: LoadingController,
    private services: UserService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private router: Router,
    private toastController: ToastController,
    private menuCtrl:MenuController,
  ) {
   //sionic this.menuCtrl.enable(false);
    this.todo = this.formBuilder.group({
      // oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    });

  }
  //--------- Back arrow function--------//
  backArrow() {
    this.navCtrl.back();
  }

  //--------- Fucntion call  when change password button click -----------//
  async changePassword() {
    if (!this.todo.valid) {
      this.submitAttempt = true;
      let msg = "Invalid fields!"
      this.presentToast(msg);
    }
    else {
      if (this.todo.value.newPassword == this.todo.value.confirmPassword) {
        const loading = await this.loadCtrl.create({
        });
        await loading.present();
        this.services.changePassword(this.todo.value.newPassword).then((Jsonresponse) => {
          loading.dismiss();
          let response = JSON.parse(Jsonresponse);
          if (response.status == true) {
            console.log("staus true", response.status);
            console.log("login response data", response.data);
            this.alertForPasswordChange();
          }
          else {
            console.log("staus false", response.status);
            loading.dismiss();
            let msg = response.msg;
            this.presentToast(msg);
          }
        }).catch(error => {
          console.log("Chnage Password Api error", error);
          loading.dismiss();
        });
      } 
      else {
        let msg = 'New password does not match with confirm password! ';
        this.presentToast(msg);
      }
    }
  }

  /////---------- Alert For password change ----------//////
  async alertForPasswordChange() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: "Your password has been changed successfully!!",
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['account']);
          }
        }
      ]
    });
    await alert.present();
  }

  //------- This func call to show  toast for error  --------//
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3500,
      translucent: true,
    });
    toast.present();
  }
}