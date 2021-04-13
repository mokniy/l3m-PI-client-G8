import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChallengeJSON } from "./AllDefinitions";
@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  private challengesSubj = new BehaviorSubject<ChallengeJSON[]>( [] );
  readonly observable = this.challengesSubj.asObservable();

constructor() { }


async getAllChallenge(){
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/defis/');
  const data = await response.json();
  console.log(data)
  this.challengesSubj.next( data as ChallengeJSON[]);
}

}
