import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { flatMap, combineLatest, map, multicast, refCount,merge, mergeMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { coerceStringArray } from '@angular/cdk/coercion';
import { Chami, User } from "./AllDefinitions";
import { Subject } from 'rxjs';
import { CombineLatestOperator } from 'rxjs/internal/observable/combineLatest';


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

  constructor(public auth: AngularFireAuth) {
    this.userObs = this.auth.user.pipe(
      mergeMap( async U => {
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
      refCount()//,
      //merge(this.newRegisteredChamiObs)
    );


        /*
      this.newRegisteredChamiObs.subscribe(x =>
        console.log("obs chami"+x)
        )

      merge(this.newRegisteredChamiObs,this.userObs);
      let x = combineLatest(this.userObs, this.newRegisteredChamiObs)
      console.log('On est dans le combinelatest ici '+x)
      */
  }

  tst(): void {
    this.newRegisteredChamiSubj.next({
      pseudo: "up",
      age: 12,
      ville:'',
      description:'',
      email:''
    })
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

  async putUser(user: Chami): Promise<Chami> {
    console.log(JSON.stringify(user));
    console.log(user.description);
    const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/chamis/"+user.pseudo,
    {
        method: "PUT",
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
