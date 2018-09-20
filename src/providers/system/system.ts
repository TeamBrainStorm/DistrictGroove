import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Parse } from "parse";

/*
  Generated class for the SystemProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SystemProvider {
  constructor(public http: HttpClient) {}

  getSystemSettings() {
    var SystemObject = Parse.Object.extend("System");
    var query = new Parse.Query(SystemObject);

    query.find({
      success: function(results) {
        console.log(results);
      },
      error: function(error) {
        console.log(error);
      }
    });
  }
}
