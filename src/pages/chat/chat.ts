import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Content } from "ionic-angular";
import { MessageProvider } from "../../providers/message/message";
import { Message } from "../../models/message";
import { ChatProvider } from "../../providers/chat/chat";
import { UserProvider } from "../../providers/user/user";
import { HomePage } from "../home/home";

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-chat",
  templateUrl: "chat.html"
})
export class ChatPage {
  @ViewChild(Content)
  content: Content;
  messages: Array<Message>;
  thread: any;
  userId: string;
  userRole: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public messageProvider: MessageProvider,
    private chatProvider: ChatProvider,
    private userProvider: UserProvider
  ) {
    this.thread = navParams.get("item");
    console.log(this.thread);
    this.userProvider
      .getCurrentUser()
      .then((user: any) => {
        this.userRole = user.className;
        if (this.userRole === "Customer") {
          this.userId = this.thread.attributes.customerInfo.id;
        } else if (this.userRole === "Artist") {
          this.userId = this.thread.attributes.artistInfo.id;
        }
      })
      .catch(err => {
        console.log(err);
        this.navCtrl.pop();
      });
  }

  ionViewDidLoad() {
    console.log(this.thread.id);
    this.messageProvider.getMessages(this.thread.id).then(results => {
      this.messages = [];
      results.forEach((message: any) => {
        this.messages.push({
          createdAt: message.attributes.createdAt,
          createdDate: message.attributes.createdDate,
          message: message.attributes.message,
          threadId: message.attributes.threadId,
          updatedAt: message.attributes.updatedAt,
          userId: message.attributes.userId
        });
        this.scrollToBottom();
      });
    });
  }

  sendMessage(newMessage) {
    if (newMessage.trim() == "") {
      return;
    }
    this.messageProvider
      .sendMessage(newMessage, this.thread.id, this.userId)
      .then(result => {
        this.messages.push({
          createdAt: result.attributes.createdAt,
          createdDate: result.attributes.createdDate,
          message: result.attributes.message,
          threadId: result.attributes.threadId,
          updatedAt: result.attributes.updatedAt,
          userId: result.attributes.userId
        });
        this.scrollToBottom();
        this.createChat(newMessage, this.thread.id);
      });
  }

  private createChat(newMessage, chatId) {
    this.chatProvider.createChat(newMessage, chatId).then(result => {
      console.log(result);
    });
  }

  private scrollToBottom(duration?: number): void {
    setTimeout(() => {
      if (this != null && this.content && this.content != null) {
        // se já tiver carregado o this.content (não ser undefined)
        this.content.scrollToBottom(duration || 300);
      }
    }, 50);
  }

  openArtist() {
    this.navCtrl.push(HomePage);
  }
}
