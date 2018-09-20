import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { ChatProvider } from "../../providers/chat/chat";
import { ChatPage } from "../chat/chat";
import { UserProvider } from "../../providers/user/user";
import { HomePage } from "../home/home";

/**
 * Generated class for the InboxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-inbox",
  templateUrl: "inbox.html"
})
export class InboxPage {
  chats: any;
  profilePicTemp = "assets/imgs/placeholder.png";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public chatProvider: ChatProvider,
    public userProvider: UserProvider
  ) {}

  ionViewDidLoad() {
    this.userProvider
      .getCurrentUser()
      .then((user: any) => {
        this.chatProvider.getChats(user.className).then(result => {
          this.chats = result;
        });
      })
      .catch(error => {});
  }

  itemTapped(event, item) {
    this.navCtrl.push(ChatPage, {
      item: item
    });
  }

  openArtist() {
    this.navCtrl.push(HomePage);
  }
}
