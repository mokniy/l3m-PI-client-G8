import firebase from 'firebase/app';

export interface Chami {
  readonly pseudo: string;
  readonly age:   number;
  ville: string;
  description: string;
  email: string;
}

export interface Challenge {
  readonly id:    string;
  readonly titre:     string;
  readonly dateDeCreation:     string;
  readonly description:     string;
  readonly auteur:     string;
}

export interface User {
  chami: Chami | undefined;
  oauthUser: firebase.User;
}
