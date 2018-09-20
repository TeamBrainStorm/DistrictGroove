import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  AlertController
} from "ionic-angular";
import { Register } from "../../models/register";
import { UserProvider } from "../../providers/user/user";
import { PerformerRegisterPage } from "../performer-register/performer-register";

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-register",
  templateUrl: "register.html"
})
export class RegisterPage {
  register = {} as Register;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public events: Events,
    public alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {}

  ionViewWillEnter() {
    this.events.subscribe("register:failed", err => {
      let alert = this.alertCtrl.create({
        title: "Error",
        subTitle: err.message,
        buttons: ["Dismiss"]
      });
      alert.present();
    });
  }

  ionViewDidLeave() {
    this.events.unsubscribe("register:failed");
  }

  doRegister() {
    if (this.register.password == this.register.confirmPassword) {
      if (this.register.password == "") {
        let alert = this.alertCtrl.create({
          title: "Warning!",
          subTitle: "Password is empty!",
          buttons: ["Dismiss"]
        });
        alert.present();
        return;
      } else {
        this.register.userType = "customer";
        this.userProvider.register(this.register).then(result => {
          this.navCtrl.pop();
        });
      }
    } else {
      let alert = this.alertCtrl.create({
        title: "Warning!",
        subTitle: "Password is mismatch!",
        buttons: ["Dismiss"]
      });
      alert.present();
      return;
    }
  }

  openPerformerRegisterPage() {
    this.navCtrl.pop();
    this.navCtrl.push(PerformerRegisterPage);
  }
}
