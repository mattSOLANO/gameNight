import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BarcodeScanner ,BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Game } from "../../shared/game.model";

@Component({
    selector: 'page-add-game',
    templateUrl: 'addGame.html'
})
export class AddGamePage {
    gameForm: FormGroup;
    scanData: {};
    options: BarcodeScannerOptions;
    gamesCollection: AngularFirestoreCollection<Game>;
    existingGame: Game;
    newGame: Game;

    constructor(
        private fb: FormBuilder,
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        private barcodeScanner: BarcodeScanner, 
        public afs: AngularFirestore
    ) {
        this.gamesCollection = afs.collection<Game>('games');
    }

    ngOnInit() {

        this.gameForm = this.fb.group({
            title: ['', Validators.required],
            minPlayers: ['', Validators.required],
            maxPlayers: ['', Validators.required],
            duration: ['', Validators.required],
            upc: ['', Validators.required]
        });

    }

    scan() {
        this.options = {
            prompt: "Scan the game's barcode"
        }
        this.barcodeScanner.scan(this.options).then((barcodeData) => {
            let gameRef = this.gamesCollection.ref.where('upc', '==', barcodeData.text);
            gameRef.get().then((result) => {
                if (result.size) {
                    result.forEach(game => {
                        this.existingGame = game.data() as Game;
                        let toast = this.toastCtrl.create({
                            message: this.existingGame.title +  " has already been added",
                            duration: 3000
                        });
                        toast.present();
                    });
                } else {
                    this.newGame = {
                        title: '',
                        minPlayers: null,
                        maxPlayers: null,
                        duration: null,
                        upc: barcodeData.text
                    };
                }     
            });
        }, (err) => {
            let toast = this.toastCtrl.create({
                message: "Error occured: " + err,
                duration: 3000
            });
            toast.present();
        });
    }

    save() {
        this.gamesCollection.add(this.newGame).then((reference) => {
            this.newGame = null;
            
            reference.get().then((game) => {

                let toast = this.toastCtrl.create({
                    message: game.data().title + " added successfuly!",
                    duration: 3000
                });
                toast.present(); 
                
            })    

        }, (err) => {
            let toast = this.toastCtrl.create({
                message: "Error occured: " + err,
                duration: 3000
            });
            toast.present();
        });
    }

}