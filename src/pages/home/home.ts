import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner ,BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from "rxjs/Observable";

import { Game } from "../../shared/game.model";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    scanData: {};
    options: BarcodeScannerOptions;

    gamesCollection: AngularFirestoreCollection<Game>;
    games: Observable<Game[]>;

    constructor(
        public navCtrl: NavController, 
        private barcodeScanner: BarcodeScanner, 
        public afs: AngularFirestore
    ) {}

    scan() {
        this.options = {
            prompt: "Scan the game's barcode"
        }
        this.barcodeScanner.scan(this.options).then((barcodeData) => {
            
            this.gamesCollection = this.afs.collection('games', ref => {
                return ref.where('upc', '==', barcodeData.text);
            });
            
            this.games = this.gamesCollection.valueChanges();
            this.scanData = barcodeData;

        }, (err) => {
            console.log("Error occured: " + err);
        })
    }

}
