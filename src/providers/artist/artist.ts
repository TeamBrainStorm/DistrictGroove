import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Parse } from "parse";

/*
  Generated class for the ArtistProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ArtistProvider {
  constructor(public http: HttpClient) {}

  getArtist(userLocation) {
    let artistObject = Parse.Object.extend("Artist");
    let query = new Parse.Query(artistObject);
    if (userLocation) {
      query.near("coordinates", userLocation);
    }

    query.limit(50);

    return query.find({
      success: function(results) {
        console.log(results);
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  getReviewsById(id) {
    let ReviewObject = Parse.Object.extend("Review");
    let query = new Parse.Query(ReviewObject);
    if (id) {
      query.equalTo("artistInfo.id", id);
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

  getServiceById(id) {
    let serviceObject = Parse.Object.extend("Service");
    let query = new Parse.Query(serviceObject);
    if (id) {
      query.equalTo("ownerId", id);
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

  getPortfolio(id) {
    let PortfolioObject = Parse.Object.extend("Portfolio");
    let query = new Parse.Query(PortfolioObject);
    if (id) {
      query.equalTo("ownerId", id);
      return query.find({
        success: function(results) {
          console.log(results);
        },
        error: function(error) {
          console.log(error);
        }
      });
    }
  }

  addPortfolio(url, description, type, currentUser) {
    let Portfolio = Parse.Object.extend("Portfolio");
    let portfolio = new Portfolio();
    portfolio.set("url", url);
    portfolio.set("description", description);
    portfolio.set("type", type);
    portfolio.set("ownerId", currentUser.id);
    portfolio.set("artistInfo", {
      name: currentUser.get("firstName") + " " + currentUser.get("lastName"),
      avatar: currentUser.get("avatar"),
      id: currentUser.id
    });

    let promise = new Promise((resolve, reject) => {
      portfolio.save(null, {
        success: function(result) {
          resolve(result);
        },
        error: function(gameScore, error) {
          reject(error);
        }
      });
    });
    return promise;
  }

  addService(id, serviceName, description, price, duration) {
    let Service = Parse.Object.extend("Service");
    let service = new Service();
    service.set("name", serviceName);
    service.set("description", description);
    service.set("price", parseInt(price));
    service.set("duration", parseInt(duration));
    service.set("ownerId", id);
    let promise = new Promise((resolve, reject) => {
      service.save(null, {
        success: function(result) {
          resolve(result);
        },
        error: function(gameScore, error) {
          reject(error);
        }
      });
    });
    return promise;
  }

  removeService(item) {
    let promise = new Promise((resolve, reject) => {
      item.destroy({
        success: function(myObject) {
          resolve(myObject);
        },
        error: function(myObject, error) {
          reject(error);
        }
      });
    });
    return promise;
  }

  removePortfolio(item) {
    let promise = new Promise((resolve, reject) => {
      item.destroy({
        success: function(myObject) {
          resolve(myObject);
        },
        error: function(myObject, error) {
          reject(error);
        }
      });
    });
    return promise;
  }
}
