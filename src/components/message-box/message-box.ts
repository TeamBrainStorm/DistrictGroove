import { Component, Input } from "@angular/core";
import { Message } from "../../models/message";

/**
 * Generated class for the MessageBoxComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "message-box",
  templateUrl: "message-box.html"
})
export class MessageBoxComponent {
  text: string;
  @Input()
  message: Message;
  @Input()
  isFromSender: boolean;
  @Input()
  photo: any;
  profilePicTemp = "assets/imgs/placeholder.png";

  constructor() {}
}
