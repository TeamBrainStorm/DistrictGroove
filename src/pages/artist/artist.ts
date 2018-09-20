import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  AlertController
} from "ionic-angular";
import { ArtistProvider } from "../../providers/artist/artist";
import { BookPage } from "../book/book";
import { Profile } from "../../models/profile";
import { ChatProvider } from "../../providers/chat/chat";
import { ChatPage } from "../chat/chat";
import { UserProvider } from "../../providers/user/user";
import { LoginPage } from "../login/login";
import { RegisterPage } from "../register/register";
import {
  ThemeableBrowserOptions,
  ThemeableBrowserObject,
  ThemeableBrowser
} from "@ionic-native/themeable-browser";
import { InboxPage } from "../inbox/inbox";
/**
 * Generated class for the ArtistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-artist",
  templateUrl: "artist.html"
})
export class ArtistPage {
  artist: any;
  services: any;
  segment: string = "services";
  totalBill: any = 0;
  profile = {} as Profile;
  artistPortfolio: any;
  artistReviews: any;
  profilePicTemp = "assets/imgs/placeholder.png";
  customerProfile: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private artistProvider: ArtistProvider,
    private chatProvider: ChatProvider,
    private userProvider: UserProvider,
    private actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    private themeableBrowser: ThemeableBrowser
  ) {
    this.artist = navParams.get("artist");
    this.getServices(this.artist.id);
    this.getPortfolioById(this.artist.id);
    this.getReviewsById(this.artist.id);
  }

  ionViewDidLoad() {}

  getReviewsById(id) {
    this.artistProvider.getReviewsById(id).then(results => {
      this.artistReviews = results;
      console.log(this.artistReviews);
    });
  }

  getServices(id) {
    this.artistProvider.getServiceById(id).then(results => {
      this.services = [];
      results.forEach(service => {
        this.services.push({
          id: service.id,
          name: service.attributes.name,
          duration: service.attributes.duration,
          ownerId: service.attributes.ownerId,
          price: service.attributes.price,
          descriptioin: service.attributes.name,
          checked: false
        });
      });
    });
  }

  getPortfolioById(id) {
    this.artistProvider.getPortfolio(id).then(results => {
      this.artistPortfolio = results;
    });
  }

  messageArtist() {
    if (!this.userProvider.hasLoggedIn()) {
      this.showMessageProfileOption();
      return;
    }
    let currentUser;
    this.userProvider
      .getCurrentUser()
      .then((user: any) => {
        let userRole = user.className;
        if (userRole === "Customer") {
          currentUser = user;
          this.chatProvider.isThreadExist(this.artist.id).then(results => {
            if (results.length == 0) {
              this.chatProvider
                .createNewThread(this.artist, currentUser)
                .then(result => {
                  this.navCtrl.push(ChatPage, {
                    item: result
                  });
                });
            } else {
              this.navCtrl.push(ChatPage, {
                item: results[0]
              });
            }
          });
        } else {
          let alert = this.alertCtrl.create({
            title: "Message",
            subTitle:
              "You are not allowed to send message.  Please login as customer account.",
            buttons: ["Dismiss"]
          });
          alert.present();
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  showMessageProfileOption() {
    let actionSheet = this.actionSheetCtrl.create({
      enableBackdropDismiss: true,
      buttons: [
        {
          text: "Log In",
          handler: () => {
            this.navCtrl.push(LoginPage);
          }
        },
        {
          text: "Register Now!",
          handler: () => {
            this.navCtrl.push(RegisterPage);
          }
        }
      ]
    });
    actionSheet.present();
  }

  showArtistInfo() {
    let alert = this.alertCtrl.create({
      title: "Artist",
      subTitle:
        this.artist.attributes.firstName +
        " is still working on his service information.",
      buttons: ["Dismiss"]
    });
    alert.present();
  }

  book() {
    if (this.userProvider.hasLoggedIn()) {
      this.userProvider
        .getCurrentUser()
        .then((user: any) => {
          let userRole = user.className;
          if (userRole === "Customer") {
            this.customerProfile = user;
            this.profile.id = this.customerProfile.id;
            this.profile.avatar = this.customerProfile.attributes.avatar;
            this.profile.firstName = this.customerProfile.attributes.firstName;
            this.profile.lastName = this.customerProfile.attributes.lastName;
            this.profile.birthDate = this.customerProfile.attributes.birthDate;
            this.profile.gender = this.customerProfile.attributes.gender;
            this.profile.email = this.customerProfile.attributes.email;
            this.profile.contactNumber = this.customerProfile.attributes.contactNumber;
            this.profile.address = this.customerProfile.attributes.address;
            let selectedServices = [];
            this.services.forEach(service => {
              if (service.checked) {
                selectedServices.push({
                  id: service.id,
                  name: service.name
                });
              }
            });
            this.navCtrl.push(BookPage, {
              artist: this.artist,
              amount: this.totalBill,
              account: this.profile,
              services: selectedServices
            });
          } else {
            let alert = this.alertCtrl.create({
              title: "Book",
              subTitle:
                "You are not allowed to make booking. Please login as customer account.",
              buttons: ["Dismiss"]
            });
            alert.present();
          }
        })
        .catch(err => {});
    } else {
      this.showBookingProfileOption();
    }
  }

  showBookingProfileOption() {
    let actionSheet = this.actionSheetCtrl.create({
      enableBackdropDismiss: true,
      buttons: [
        {
          text: "Log In",
          handler: () => {
            this.navCtrl.push(LoginPage);
          }
        },
        {
          text: "Register Now!",
          handler: () => {
            this.navCtrl.push(RegisterPage);
          }
        },
        {
          text: "Continue, Register Later",
          handler: () => {
            let selectedServices = [];
            this.services.forEach(service => {
              if (service.checked) {
                selectedServices.push({
                  id: service.id,
                  name: service.name
                });
              }
            });
            this.navCtrl.push(BookPage, {
              artist: this.artist,
              amount: this.totalBill,
              services: selectedServices
            });
          }
        }
      ]
    });
    actionSheet.present();
  }

  itemTapped(item, checked) {
    let total = 0;
    this.services.forEach(service => {
      if (service.checked) {
        total += item.price;
      }
    });
    this.totalBill = total;
  }

  openPortfolio(portfolio) {
    this.openBrowser(portfolio);
  }

  openBrowser(portfolio) {
    const options: ThemeableBrowserOptions = {
      toolbar: {
        height: 56,
        color: "#ffffff"
      },
      title: {
        color: "#000000",
        showPageTitle: true,
        staticText: portfolio.attributes.artistInfo.name
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
      portfolio.attributes.url,
      "_blank",
      options
    );

    browser.on("closePressed").subscribe(data => {
      browser.close();
    });
  }

  openChat() {
    this.navCtrl.push(InboxPage);
  }
}
