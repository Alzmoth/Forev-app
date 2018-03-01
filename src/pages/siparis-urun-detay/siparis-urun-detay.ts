import { Component } from '@angular/core';

import {  NavController, NavParams,ToastController } from 'ionic-angular';

import { Urun} from '../../entities/urunler'
import { AuthService } from "../../providers/auth-service";
import {SiparisSepetProvider} from '../../providers/siparis-sepet'
/**
 * Generated class for the SiparisUrunDetayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-siparis-urun-detay',
  templateUrl: 'siparis-urun-detay.html',
})
export class SiparisUrunDetayPage {

  public resposeData: any;
  public gonderilen:any;
  public userDetails:any;
  public userdata = {
    "user_id": "",
    "token": "",
 
  };
  public dataSet: any[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public siparisSepetProvider: SiparisSepetProvider,
    public toastController: ToastController,
    public authService: AuthService,
    ) {
    this.selectedUrun = navParams.get('item');
    console.log(this.selectedUrun)
    
    if (this.selectedUrun.olcu_birim=="DZ") {
      this.selectedUrun.olcu_birim="Düzine"    
    }
    if (this.selectedUrun.olcu_birim == "AD") {
      this.selectedUrun.olcu_birim = "Adet"
    }
    if (this.selectedUrun.olcu_birim == "TK") {
      this.selectedUrun.olcu_birim = "Takım"
    }
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails=data.userData;
    this.userdata.user_id=this.userDetails.user_id;
    this.userdata.token=this.userDetails.token;
    console.log(this.userdata)

  }
  selectedUrun: Urun;



  ionViewDidLoad() {

  }


  addToCart(urun: Urun) { //yeni addtocard eklenecek satış için

    this.siparisSepetProvider.addToCart(urun);
    this.showToast();
    this.gonderilen=urun;
    this.gonderilen.user_id=this.userdata.user_id;
    this.gonderilen.token=this.userdata.token;

    
    
    console.log("sepettt", this.gonderilen)
    this.authService.postData(this.gonderilen, "siparis_sepet_kaydet")
      .then((result) => {
        this.resposeData = result;
        

      }, (err) => {
        //Connection failed message
      });
    this.navCtrl.pop();
 
  }
  showToast() {
    let toast = this.toastController.create({
      message: 'Urun Sayim Listesine Eklendi',
      duration: 50,
      position: 'bottom'
    });
    toast.present();
  }


}
