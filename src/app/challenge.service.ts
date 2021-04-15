import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Challenge, Chami } from "./AllDefinitions";
@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  private challengesSubj = new BehaviorSubject<Challenge[]>( [] );
  readonly obsAllChall = this.challengesSubj.asObservable();

  private challengesOfAnUser = new BehaviorSubject<Challenge[]>( [] );
  readonly obsChallUser = this.challengesSubj.asObservable();

constructor() { }


async getAllChallenge(){
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/defis/');
  const data = await response.json();
  //console.log(data)
  this.challengesSubj.next( data as Challenge[]);
}

async getAllChallengeOfAnUsers(user:Chami){
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/defis/'+user.pseudo);
  const data = await response.json();
  console.log(data)
  this.challengesOfAnUser.next( data as Challenge[] );
}

}
