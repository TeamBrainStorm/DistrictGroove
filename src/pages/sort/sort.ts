import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Events } from "ionic-angular";
import { Filter } from "../../models/filter";

/**
 * Generated class for the SortPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-sort",
  templateUrl: "sort.html"
})
export class SortPage {
  mode: string;
  filter = {} as Filter;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events
  ) {
    this.mode = navParams.get("mode");
    this.filter = navParams.get("filter");
  }

  ionViewDidLoad() {}

  apply() {
    this.events.publish("filterAndSort", this.filter);
    this.navCtrl.pop();
  }
}
