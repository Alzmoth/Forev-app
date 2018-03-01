import { Component } from '@angular/core';
import {  NavController, App, AlertController } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import { Common } from "../../providers/common";
import { SiparisUrunDetayPage} from '../siparis-urun-detay/siparis-urun-detay'
import { SiparisSepetProvider } from '../../providers/siparis-sepet'


/**
 * Generated class for the SiparisSatisPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-siparis-satis',
  templateUrl: 'siparis-satis.html',
})
export class SiparisSatisPage {
  public resposeData: any;
  public resposeData2: any;
  public resposeData3: any;
  public dataSet: any[] = [];
  public dataSet1: any[] = [];
  public dataSet2: any[] = [];
  public kategori: any[] = [];
  public userDetails: any;
  queryText: any;
  secilenKategori: string;
  stokPostData = {
    "kategori": "",
    "search": ""
  };
  userPostData = {
    "user_id": "",
    "token": ""
  };

  constructor(public common: Common, 
    public navCtrl: NavController, public app: App,
    public authService: AuthService,
    public siparisSepetProvider: SiparisSepetProvider,
    public alertCtrl: AlertController) {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;
    this.userPostData.user_id = this.userDetails.user_id;
    this.userPostData.token = this.userDetails.token;

  }

  ionViewDidLoad() {
    //this.getFeed();
    this.getkategori();
    this.getstok();
    this.getsepet();
  }

  getkategori() {
    this.common.presentLoading();
    this.authService.postData(this.stokPostData, "siparis_kategori")
      .then((result) => {
        this.resposeData = result;
        this.common.closeLoading();
        this.kategori = this.resposeData.feedData;
        console.log("kategori",this.kategori);


      }, (err) => {
        //Connection failed message
      });

  }
  getstok() {

    this.authService.postData(this.stokPostData, "siparis_satis")
      .then((result) => {
        this.resposeData2 = result;
        this.dataSet = this.resposeData2.feedData;
        console.log(this.dataSet);



      }, (err) => {
        //Connection failed message
      });

  }
  
  getsepet() {
    this.authService.postData(this.userPostData, "siparis_sepet_getir")
      .then((result) => {
        this.resposeData3 = result;
        this.dataSet2 = this.resposeData3.feedData;
        console.log(this.dataSet2)
        if (this.dataSet2.length!=0) {
          let alert = this.alertCtrl.create({
            title: 'Sepette urun var',
            message: 'Sepette run var devam edilsin mi?',
            buttons: [
            
              {
                text: 'Devam Et',
                handler: () => {

                }
              }
            ]
          });
          alert.present();
          this.dataSet2.forEach(element => {
            this.siparisSepetProvider.addToCart(element);
          });
        }

      }, (err) => {
        //Connection failed message
      });

  }

  public search(queryText) {
    if (this.queryText.length >= 3) {
      this.stokPostData.search = this.queryText;
      this.getstok()
    } else if (this.queryText.length == 0){
      this.stokPostData.search="";
     this.getstok();
    }
    else{
      this.stokPostData.search = "";
    }

  }
  public kat() {

    this.stokPostData.kategori = this.secilenKategori;
    console.log(this.stokPostData);
    this.getstok()


  }


  itemTapped(event, urun) {
    this.authService.postData(urun, "detay_katagori")
      .then((result) => {
        this.resposeData = result;
        this.dataSet1 = this.resposeData.feedData;

        urun.firma_adi = this.dataSet1[0].firma_adi;
        
      }, (err) => {
        //Connection failed message
      });
    this.navCtrl.push(SiparisUrunDetayPage, { item: urun });

  }




}
