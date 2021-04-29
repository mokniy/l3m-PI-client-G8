import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest, merge, timer } from 'rxjs';
import { multicast, refCount, mergeMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Chami, User } from "./AllDefinitions";


@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private allchamisSubj = new BehaviorSubject<Chami[]>( [] );
  readonly chamisObs = this.allchamisSubj.asObservable();

    //REALISATION MERGE ET COMBINELATEST
  //private oneChami = new Subject<Chami | undefined>();
  //private readonly  oneChamiObs = this.oneChami.asObservable();

  readonly userObs: Observable<User | undefined>;

  private chamiSubj = new Subject<Chami>();
  readonly chamiObs = this.chamiSubj.asObservable();

  private newRegisteredChamiSubj = new Subject<Chami>();
  readonly  newRegisteredChamiObs = this.newRegisteredChamiSubj.asObservable();

  constructor(public auth: AngularFireAuth) {
    this.userObs = this.auth.user.pipe(
      mergeMap( async U => {
        if (!!U) {
          const chami = await this.getChami( U.email ?? '' );
          this.chamiSubj.next(chami)
          //REALISATION MERGE ET COMBINELATEST
          //this.oneChami.next(chami)
          return {
            chami,
            oauthUser: U
          };
        } else {
          return undefined;
        }
      }), // Fin map
      multicast( () => new BehaviorSubject<User | undefined>( undefined ) ),
      refCount(),
     // combineLatest(x => merge(this.newRegisteredChamiObs,this.userObs),this.userObs)
    );

    //TST1
    //const testMerge = this.newRegisteredChamiObs
    //  .pipe(() => merge(this.chamiObs, this.newRegisteredChamiObs))
    //  .pipe((x) => combineLatest(x, this.userObs));


     //TST2
     // this.userObs = combineLatest(merge(this.newRegisteredChamiObs,this.userObs),this.userObs)

    //REALISATION MERGE ET COMBINELATEST
    //const test = merge(this.newRegisteredChamiObs,this.userObs).pipe()
    //let tst = combineLatest(this.userObs,test)
    //console.log(test)
    //const tst2 = combineLatest()
  }

  //TEST MERGE
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
    this.allchamisSubj.next( data as Chami[] );
  }

  async getChami(email:string): Promise<Chami | undefined> {
    const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/chamis/' + email);
    if (response.status === 200) {
      return await response.json() as Chami;
    } else {
      return undefined;
    }
  }

  async getChamiWithPseudo(pseudo:string): Promise<Chami | undefined> {
    const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/chamis/pseudo/' + pseudo);
    if (response.status === 200) {
      return await response.json() as Chami;
    } else {
      return undefined;
    }
  }

  async postUser(user: Chami): Promise<void> {
    if(await this.getChamiWithPseudo(user.pseudo) === undefined) {
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
    }
  }

  async putUser(user: Chami): Promise<Response | undefined> {
    if(await this.getChamiWithPseudo(user.pseudo) === undefined) {
      console.log(JSON.stringify(user));
      console.log(user.description);
    const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/chamis/"+user.email,
    {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    });
    this.newRegisteredChamiSubj.next(user)
    console.log("finito"+ res)
    return res;
  }
  return undefined;
}

}
