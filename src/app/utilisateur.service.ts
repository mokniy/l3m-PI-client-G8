import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { flatMap, combineLatest, map, multicast, refCount } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { coerceStringArray } from '@angular/cdk/coercion';
import { Chami, User } from "./AllDefinitions";
import { Subject } from 'rxjs';
import { merge } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private chamisSubj = new BehaviorSubject<Chami[]>( [] );
  readonly chamisObs = this.chamisSubj.asObservable();

  // private userSubj = new BehaviorSubject<User | undefined>( undefined );
  readonly userObs: Observable<User | undefined>;

  private newRegisteredChamiSubj = new Subject<Chami>();
  readonly  newRegisteredChamiObs = this.newRegisteredChamiSubj.asObservable();

  merged?: any;

  constructor(public auth: AngularFireAuth) {
    this.userObs = this.auth.user.pipe(
      flatMap( async U => {
        if (!!U) {
          const chami = await this.getChami( U.email ?? '' );
          return {
            chami,
            oauthUser: U
          };
        } else {
          return undefined;
        }
      }), // Fin map
      multicast( () => new BehaviorSubject<User | undefined>( undefined ) ),
      refCount()
    );

    /*
    const user = {
      pseudo: "up",
      age: 12,
      ville:'',
      description:'',
      email:''
    }

    this.newRegisteredChamiSubj.next(user)
    this.newRegisteredChamiObs = this.newRegisteredChamiSubj.asObservable()

      this.merged = merge(this.userObs,this.newRegisteredChamiObs);

      this.merged = combineLatest(this.userObs, this.newRegisteredChamiObs)

    console.log(this.merged)
    */
  }

  login(): void {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      this.auth.signInWithPopup(provider);
  }

  logout(): void {
    this.auth.signOut();
  }

  isLoggedIn() {

  }

  async getAllUsers(){
    const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/chamis/');
    const data = await response.json();
    this.chamisSubj.next( data as Chami[] );
  }

  async getChami(login:string): Promise<Chami | undefined> {
    const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/chamis/' + login);
    if (response.status === 200) {
      return await response.json() as Chami;
    } else {
      return undefined;
    }
  }

  async postUser(user: Chami): Promise<Chami> {
    console.log(JSON.stringify(user));
    const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/chamis/"+user.pseudo,
    {
        method: "POST",
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    });
    this.newRegisteredChamiSubj.next(user)
    console.log("finito"+ res)
    return res.json();
  }


}
