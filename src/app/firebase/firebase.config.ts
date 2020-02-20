import { IfirebaseConfig } from './firebase.interface';

export const firebaseConfigDev: IfirebaseConfig = {
  apiKey: 'AIzaSyACKzmyQVwDpckw9qd0BRdXR8u0VN_pfJY',
  authDomain: 'hooks-news-9c4b2.firebaseapp.com',
  databaseURL: 'https://hooks-news-9c4b2.firebaseio.com',
  projectId: 'hooks-news-9c4b2',
  storageBucket: 'hooks-news-9c4b2.appspot.com',
  messagingSenderId: '1064362918401',
  appId: '1:1064362918401:web:08d63baba9e2f8e2'
};

const firebaseConfigProd: IfirebaseConfig = {
  apiKey: 'AIzaSyD13IKSZIl7OwD9RE9pJUECq258pX4i_Z4',
  authDomain: 'hooks-news-ba59c.firebaseapp.com',
  databaseURL: 'https://hooks-news-ba59c.firebaseio.com',
  projectId: 'hooks-news-ba59c',
  storageBucket: 'hooks-news-ba59c.appspot.com',
  messagingSenderId: '337765109166',
  appId: '1:337765109166:web:1f1d5b572f913bb090cc3f',
  measurementId: 'G-9XC2XFXR37'
};

export const firebaseRoutes: any = {
  localhost: firebaseConfigDev,
  'hooks-news-9c4b2.firebaseapp.com': firebaseConfigDev,
  'hooks-news-9c4b2.web.app': firebaseConfigDev,
  'hooks-news-ba59c.firebaseapp.com': firebaseConfigProd,
  'hooks-news-ba59c.web.app': firebaseConfigProd
};
