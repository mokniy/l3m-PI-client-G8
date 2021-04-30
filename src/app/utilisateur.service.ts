import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest, merge, timer } from 'rxjs';
import { multicast, refCount, mergeMap, map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Chami, User } from "./AllDefinitions";


@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  //TOUT LES CHAMIS
  private allchamisSubj = new BehaviorSubject<Chami[]>( [] );
  readonly chamisObs = this.allchamisSubj.asObservable();

  //CHAMI CONNECTE
  readonly userObs: Observable<User | undefined>;

////POUR LE MERGE
  //CHAMI CONNECTE (JUSTE DONNE BDD)
  private chamiSubj = new Subject<Chami>();
  readonly chamiObs = this.chamiSubj.asObservable();


  constructor(public auth: AngularFireAuth) {
    // Le chami lié retrouvé à partir du compte Google lors de la connexion
    const initialChami: Observable<Chami | undefined> = this.auth.user.pipe(
      mergeMap( async U => !!U ? this.getChami( U.email ?? '' ) : undefined )
    );

    // Le chami en tenant compte des éventuelle mises à jour qui seront publiées via chamiSubj
    const updatedChami: Observable<Chami | undefined> = merge(this.chamiSubj, initialChami);

    // Le User au sens définit par vous même
    this.userObs = combineLatest( [this.auth.user, updatedChami]).pipe(
      map( ([U, C]) => !U ? undefined : {chami: C, oauthUser: U} ), // Fin map
      multicast( () => new BehaviorSubject<User | undefined>( undefined ) ),
      refCount()
    );

    // Normalement si je ne me trompe pas ça code le schéma que je vous avais indiqué
    //Ah d'accord j'y etais un peu loin encore
    // On a tendance à faire trop compliqué au début avec les observables, les schéma peuvent aider à mieux comprendre ce dont on a vraiment besoin
      //Justement oui j'essayais de m'en rapprocher un maximum
      // Indiction
      // Dans le schéma on a 2 "boites" en entrée (auth.user et chamiSubj)
      // On définit trois "boites" (obsChami (chamiInitial)), chami à jour et userObs
      // => On ne doit définir que trois observateurs nouveau
      // Les flêches qui vont vers ces nouveaux observateurs sont les observables à partir desquels on va les construire (d'une façon ou d'un autre)

      //Ah oui non c'est bon enfaite je voyais bien saufque j'avais un obs en trop déjà => oui en effet
      // Bon mais c'est bien d'essayer de faire les choses propremement
      // Je vous propose de bien lire la solution proposé (et pas testée), puis d'essayer de la reproduire vous même
      // Pour bien l'acquérir
      // elle n'est pas très longue
      //Oui c'est clair que je vais bien la relire j'y avais passé pas mal de temps
      // C'est ce qu'il faut, la seule façon de progresser, maintenant les neurones sur mures pour enregistrer la bonne solution et la comprenre mieux
      //En plus c'est le matin donc mon cerveau est totalement present, en fin de journée cest plus dur
      // :D
      // J'ai juste une autre question du côté code
      //PLusieurs fois on a été confronté à des bugs quand on clique sur un défi par exemple, deux cliques sont nécessaires au lieu de un
      //Je pense que c'est simple mais je suis bloqué
      // Ca me semble être un problème de synchronisation des observables au vu de la description que vous en faites
      //je pense, et justement je voulais vous demander si c'est normal d'avoir beaucoup d'obseervable ?
      // Mon conseil c'est d'en avoir 0..2 max pour un même composant
      // Du moins 0..2 qui sont synchro avec la vue
      // En gros il faut plutôt essayer de les aggréger en un seul quand vous en avez plusieurs => c'est l'observable qui publie l'état de la vue, vous synchronisez la vue avec
      // Les opérateurs combineLatest ou du même genre sont alors vos amis
      // montrez moi le composant en question
      //Aie
    }

  //TEST MERGE
  /*
  tst(): void {
    this.newRegisteredChamiSubj.next({
      pseudo: "up",
      age: 12,
      ville:'',
      description:'',
      email:''
    })
  }
*/
  tstMerge(){
    //ah d'accord, j'avasi essaye de le destructurer avant ca et ca marchais pas
    // User peut avoir le type undefined => pas possible d'utiliser la destructuration dans ce cas
    // Il faut utiliser la fonction merge et pas l'opérateur merge je pense
   /*
    const updatedChami: Observable<Chami> = merge(this.chamiSubj, this.newRegisteredChamiObs);

    // Pardon je reprends le schéma que je n'ai plus en tête. On cherche à contruire un observable de l'information à jour du chami
    // 2 sources :
    //   -> Lors de la connexion, on va chercher dans la BDD si on a un chami associé
    //   -> On a un Subject qui va publier les mises à jour du Chami
    // updatedChami est bien cela

    // Ensuite on va fusionner les observateur firebase.User et updatedChami pour avoir le User
    const userObs: Observable<User | undefined> = combineLatest( [this.auth.user, updatedChami]).pipe(
      map( ([U, C]) => !U ? undefined : {chami: C, oauthUser: U} ), // Fin map
      multicast( () => new BehaviorSubject<User | undefined>( undefined ) ),
      refCount()
    );
*/
      //l'observable this.userObs on doit donc lui associer un subject ? Pour pouvoir faire le next
      // Non il va produire des valeur "tout seul" à partir des "sources" que sont this.auth.user et updatedChami
      // Par contre c'est un observable froid et sans état, il faut le rendre chaud avec état.
      // Voilà
      //cetait avec ca non ?

      // et du coup pour le "readonly userObs: Observable<User | undefined>;" qu'on observe dans le html,
      //On a pas besoin de republier ?
      // On va mettre l code là où il doit être
      //ah oui ca sera mieu :) merci

    //return this.newRegisteredChamiObs
    //  .pipe(() => merge(this.userObs, this.newRegisteredChamiObs))
     // .pipe(([U, C]) => ({ ...U, chami: C }));

     //TST2
     // this.userObs = combineLatest(merge(this.newRegisteredChamiObs,this.userObs),this.userObs)

    //REALISATION MERGE ET COMBINELATEST
    //const test = merge(this.newRegisteredChamiObs,this.userObs).pipe()
    //let tst = combineLatest(this.userObs,test)
    //console.log(test)
    //const tst2 = combineLatest()
  }
  //FIN TEST MERGE

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
      this.chamiSubj.next(user)
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
    this.chamiSubj.next(user)
    console.log("finchamiSubjito"+ res)
    return res;
  }
  return undefined;
}

}
