import { FireSQL } from 'firesql';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';

import { config } from '../../utils';

class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.db = firebase.database();
    this.firestore = firebase.firestore();
    this.FireSQL = new FireSQL(firebase.firestore(), { includeId: true});
  }

  playas = () => this.db.ref('/'); // eslint-disable-line

  playasAll = () => this.firestore.collection('playas');

  fireSQL = () => this.FireSQL;
}

export default Firebase;