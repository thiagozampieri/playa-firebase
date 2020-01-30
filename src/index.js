import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Firebase, { FirebaseContext, withFirebase } from './components/Firebase';
import * as serviceWorker from './serviceWorker';

const AppWrapper = withFirebase(App);

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <AppWrapper />
  </FirebaseContext.Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
