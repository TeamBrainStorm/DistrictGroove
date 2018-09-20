import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

/**
 * Generated class for the YoutubePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-youtube",
  templateUrl: "youtube.html"
})
export class YoutubePage {
  portfolio: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.portfolio = this.navParams.get("portfolio");
  }

  ionViewDidLoad() {}
}
