import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Parse } from "parse";

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider {
  chats: any;

  constructor(public http: HttpClient) {}

  getChats(userRole) {
    let id = Parse.User.current().get("profileId");
    let ServiceObject = Parse.Object.extend("Thread");
    let query = new Parse.Query(ServiceObject);
    if (id) {
      if (userRole === "Customer") {
        query.equalTo("customerInfo.id", id);
      } else {
        query.equalTo("artistInfo.id", id);
      }
      query.descending("updatedAt");
    }

    return query.find({
      success: function(results) {
        this.chats = results;
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  isThreadExist(artistId) {
    let customerId = Parse.User.current().get("profileId");
    let ServiceObject = Parse.Object.extend("Thread");
    let query = new Parse.Query(ServiceObject);
    if (customerId && artistId) {
      query.equalTo("customerInfo.id", customerId);
      query.equalTo("artistInfo.id", artistId);
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

  createChat(newMessage, chatId) {
    let Thread = Parse.Object.extend("Thread");
    let thread = new Thread();
    thread.id = chatId;
    thread.set("lastMessage", newMessage);
    thread.set("isNewMessageArtist", true);
    thread.set("isArtistThreadDeleted", false);
    thread.set("messageFrom", "customer");
    return thread.save(null, {
      success: function(result) {
        console.log(result);
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  createNewThread(artist, customerProfile) {
    let Thread = Parse.Object.extend("Thread");
    let thread = new Thread();

    thread.set("lastMessage", "");
    thread.set("messages", []);
    thread.set("artistInfo", {
      id: artist.id,
      firstName: artist.attributes.firstName,
      lastName: artist.attributes.lastName,
      avatar: artist.attributes.avatar
    });

    thread.set("customerInfo", {
      id: customerProfile.id,
      firstName: customerProfile.get("firstName"),
      lastName: customerProfile.get("lastName"),
      avatar: customerProfile.get("avatar") || "assets/imgs/placeholder.png"
    });

    return thread.save(null, {
      success: function(result) {
        console.log(result);
      },
      error: function(gameScore, error) {
        console.log(error);
        console.log(gameScore);
      }
    });
  }
}
