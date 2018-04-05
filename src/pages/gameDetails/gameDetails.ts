import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import { Game } from '../../shared/game.model';

@Component({
    selector: 'page-game-details',
    templateUrl: 'gameDetails.html'
})
export class GameDetailsPage {

    game: any;
    gameDoc: AngularFirestoreDocument<Game>;

    constructor(
        private navParams: NavParams,
        private afs: AngularFirestore,
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController
    ) {
        this.game = this.navParams.get('game');
        this.gameDoc = this.afs.doc<Game>('games/' + this.game.id);
    }

    delete() {
        let confirm = this.alertCtrl.create({
            title: 'Delete Game?',
            message: 'Are you sure you want to remove ' + this.game.title + ' from the database?',
            buttons: [
            {
                text: 'Cancel'
            },
            {
                text: 'Agree',
                handler: () => {
                    this.gameDoc.delete().then(() => {
                        let toast = this.toastCtrl.create({
                            message: this.game.title + " deleted",
                            duration: 3000
                        });
                        toast.present();
                        this.navCtrl.pop();
                    }, (err) => {
                        let toast = this.toastCtrl.create({
                            message: "Error occured: " + err,
                            duration: 3000
                        });
                        toast.present();
                    });
                }
            }
            ]
        });
        confirm.present();
    }


}