import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { UserJSON } from "./AllDefinitions";

@Injectable({
  providedIn: 'root'
})

export class UtilisateurService {

  private usersSubj = new BehaviorSubject<UserJSON[]>( [] );
  readonly observable = this.usersSubj.asObservable();

constructor(public auth: AngularFireAuth) { }


  login(): void {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      this.auth.signInWithPopup(provider);
  /*
    let s : string|null|undefined = "";
      this.auth.currentUser.then(
        function(res){
          s = res?.email
      })
*/
      //this.userExistant(s);
    }

    logout(): void {
      this.auth.signOut();
    }


  async getAllUsers(){
    const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/chamis/');
    const data = await response.json();
    this.usersSubj.next( data as UserJSON[] );
  }

  async getOneUsers(login:string){
    const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/chamis/'+login);
    const data = await response.json();
    return data as UserJSON;
  }

  postUser(user : UserJSON){
    console.log(JSON.stringify(user));
    fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/chamis/"+user.login,
    {
        method: "POST",
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    })
    .then(function(res){
        console.log("finito"+ res)
        return res.json();
      })
  }

  async userExistant(login: string){
    let u: UserJSON ;
    u = {
      login : "null",
      age : -1
    }
    u = await this.getOneUsers(login);
    if(login===u.login){
      console.log("utilisateur existant")
      console.log('='+ login)
    } else{
      console.log("utilisateur non existant")
      console.log('='+ u.login)
    }
  }

}
