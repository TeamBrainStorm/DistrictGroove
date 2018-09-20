import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  AlertController
} from "ionic-angular";
import { Crendential } from "../../models/credential";
import { UserProvider } from "../../providers/user/user";
import { RegisterPage } from "../register/register";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  loginData = {} as Crendential;
  isLoginLoading = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public events: Events,
    public alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {}

  ionViewWillEnter() {
    this.events.subscribe("login:failed", err => {
      this.isLoginLoading = false;
      let alert = this.alertCtrl.create({
        title: "Error",
        subTitle: err.message,
        buttons: ["Dismiss"]
      });
      alert.present();
    });
  }

  ionViewDidLeave() {
    this.events.unsubscribe("login:failed");
  }

  doLogin() {
    if (this.loginData.userName && this.loginData.password) {
      this.isLoginLoading = true;
      this.userProvider.login(this.loginData).then(result => {
        this.isLoginLoading = false;
        this.navCtrl.pop();
      });
    }
  }

  forgotPassword() {
    if (this.loginData.userName == "") {
      let alert = this.alertCtrl.create({
        title: "Warning",
        subTitle: "Please input email address to reset password!",
        buttons: ["Dismiss"]
      });
      alert.present();
      return;
    }
    this.userProvider.forgotPassword(this.loginData.userName).then(result => {
      let alert = this.alertCtrl.create({
        title: "Password",
        subTitle:
          "Password reset request sent. Please check your email for further instructions.",
        buttons: ["Dismiss"]
      });
      alert.present();
    });
  }

  showRegisterForm() {
    this.navCtrl.push(RegisterPage);
  }
}
