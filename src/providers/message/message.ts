import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Parse } from "parse";

/*
  Generated class for the MessageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageProvider {
  constructor(public http: HttpClient) {}

  getMessages(id) {
    let ServiceObject = Parse.Object.extend("Message");
    let query = new Parse.Query(ServiceObject);

    if (id) {
      query.equalTo("threadId", id);
      query.ascending("createdAt");
      query.limit(100);
    }
    return query.find({
      success: function(results) {
        console.log(results);
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  sendMessage(text, chatId, userId) {
    let Message = Parse.Object.extend("Message");
    let message = new Message();
    message.set("threadId", chatId);
    message.set("message", text);
    message.set("userId", userId);
    message.set("createdDate", new Date());
    return message.save(null, {
      success: function(result) {
        console.log(result);
      },
      error: function(error) {
        console.log(error);
      }
    });
  }
}
