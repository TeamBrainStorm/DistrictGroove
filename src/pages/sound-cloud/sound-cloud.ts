import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import {
  ThemeableBrowser,
  ThemeableBrowserObject,
  ThemeableBrowserOptions
} from "@ionic-native/themeable-browser";

/**
 * Generated class for the SoundCloudPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-sound-cloud",
  templateUrl: "sound-cloud.html"
})
export class SoundCloudPage {
  portfolio: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private themeableBrowser: ThemeableBrowser
  ) {
    this.portfolio = this.navParams.get("portfolio");
    this.openBrowser();
  }

  openBrowser() {
    const options: ThemeableBrowserOptions = {
      toolbar: {
        height: 56,
        color: "#ffffff"
      },
      title: {
        color: "#000000",
        showPageTitle: true,
        staticText: this.portfolio.attributes.artistInfo.name
      },
      backButton: {
        wwwImage: "assets/imgs/back.png",
        align: "left",
        event: "backPressed"
      },
      forwardButton: {
        wwwImage: "assets/imgs/forward.png",
        align: "left",
        event: "forwardPressed"
      },
      closeButton: {
        wwwImage: "assets/imgs/close.png",
        align: "left",
        event: "closePressed"
      }
    };

    const browser: ThemeableBrowserObject = this.themeableBrowser.create(
      this.portfolio.attributes.url,
      "_blank",
      options
    );

    browser.on("closePressed").subscribe(data => {
      browser.close();
      this.navCtrl.pop();
    });
  }

  ionViewDidLoad() {}
}
