import { Injectable } from '@angular/core';
import { Events, Platform,ToastController } from "ionic-angular";



@Injectable()
export class BackButtonEventHandlerProvider {

  public backButtonPressedTimer: any;
  public backButtonPressed = false;

  // Unregister when entering other pages. I register another one later somewhere else for different callback.
  public unregisterBackButtonAction: any = null;

  constructor(public platform: Platform,
    public events: Events,
    public toastCtrl: ToastController) {
  }

  // call this method when you want to register the event
  // pick anoterh name
  registerPressToFlipCard(cb) {

    if (!cb) {
      return;
    }

    // the 101 priority number does not seem to work at all, ignore it
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(cb, 101);
  }

  // register double press event
  registerDoublePressToExitApp(page) {

    if (this.unregisterBackButtonAction) {
      return;
    }

    console.log('register double press to exit app');

    let cb = (page) => {
      return () => {

        // when users press back button on the root page of a `stacked`(tabbar root page) pages, show exit app
        if (['NotificationListPage', 'TargetPage', 'ProfilePage'].indexOf(page) !== -1) {
          this.events.publish('tabbar.tabs.select', 0);
          return;
        } else {
          this.showExit();
        }
      }
    };

    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(cb(page), 101);
  }

  // show the message toast
  showExit() {
    if (this.backButtonPressed) {
      this.platform.exitApp();
    } else {
      this.present();
      this.backButtonPressed = true;
      if (this.backButtonPressedTimer) {
        clearTimeout(this.backButtonPressedTimer);
      }
      this.backButtonPressedTimer = setTimeout(() => {
        this.backButtonPressed = false
      }, 2000);
    }
  }
  present() {
    let toast = this.toastCtrl.create({
      message: 'Çıkmak için tekrar basın',
      duration: 2000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
     
    });

    toast.present();
  }

  // unregister the double press to exit app event 
  unregister() {

    if (typeof this.unregisterBackButtonAction == 'function') {

      this.unregisterBackButtonAction();

      this.unregisterBackButtonAction = null;

      console.log('unregister double press to exit app');
    }
  }
}