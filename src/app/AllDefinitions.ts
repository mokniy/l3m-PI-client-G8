import firebase from 'firebase/app';

export interface Chami {
  readonly pseudo: string;
  readonly age:   number;
  readonly ville: string;
  readonly description: string;
  readonly email: string;
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
