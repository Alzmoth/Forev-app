import { Component } from '@angular/core';
import {  NavController, NavParams, App,Nav } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import {SiparisListeDetayPage  } from '../siparis-liste-detay/siparis-liste-detay'
/**
 * Generated class for the SiparisListePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-siparis-liste',
  templateUrl: 'siparis-liste.html',
})
export class SiparisListePage {
  public resposeData: any;
  public dataSet: any[] = [];

  stokPostData = {
    "user_id": "",
    "token": "",
    "stok_kayit_id": "",
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: AuthService,
    public app: App,
    public nav:Nav) {

  }

  ionViewDidLoad() {
  
    this.getliste();

  }


  getliste() {
    console.log("asd");
    this.authService.postData(this.stokPostData, "siparis_listesi_getir")
      .then((result) => {
        this.resposeData = result;
        this.dataSet = this.resposeData.feedData;
        console.log(this.dataSet);

      }, (err) => {
        //Connection failed message
      });

  }
  saatCevir(time) {

    let a = new Date(time * 1000);
    return a;
  }

  itemTapped(event, item) {
    this.nav.push(SiparisListeDetayPage, { item: item });
    console.log("gönderilen item", item)
  }

}

