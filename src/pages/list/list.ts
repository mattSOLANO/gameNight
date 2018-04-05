import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from "rxjs/Observable";

import { Game } from "../../shared/game.model";
import { GameDetailsPage } from '../gameDetails/gameDetails';

@Component({
    selector: 'page-list',
    templateUrl: 'list.html'
})
export class ListPage {
    selectedGame: any;
    gamesCollection: AngularFirestoreCollection<Game>;
    games: Observable<Game[]>;

    constructor(
        public navCtrl: NavController,
        public afs: AngularFirestore
    ) {

        this.gamesCollection = afs.collection('games');
        this.games = this.gamesCollection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as Game;
                const id = a.payload.doc.id;
                return {id, ...data};
            });
        });

    }

    selectGame(event, item) {
        this.navCtrl.push(GameDetailsPage, {
            game: item
        });
    }
}
