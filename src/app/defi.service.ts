import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Defi, Chami } from "./AllDefinitions";

@Injectable({
  providedIn: 'root'
})
export class DefiService {

  private DefisSubj = new BehaviorSubject<Defi[]>( [] );
  readonly obsAllChall = this.DefisSubj.asObservable();

  private DefisOfAnUser = new BehaviorSubject<Defi[]>( [] );
  readonly obsChallUser = this.DefisOfAnUser.asObservable();

constructor() { }


async getAllDefi(){
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/defis/');
  const data = await response.json();
    console.log(data)
  this.DefisSubj.next( data as Defi[]);
}

async getAllDefiOfAnUsers(user:Chami){
  //console.log(user.pseudo)
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/defis/auteur/'+user.pseudo);
  const data = await response.json();
  //console.log(data)
  this.DefisOfAnUser.next( data as Defi[] );
}

async putDefi(defi: Defi): Promise<Defi> {
  console.log(JSON.stringify(defi));
  console.log(defi.description);
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/defis/"+defi.defi,
  {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(defi)
  });
  console.log("Update DEFI réalisé: "+ res)
  return res.json();
}


async postDefi(defi: Defi): Promise<Defi> {
  console.log('Je suis dans la création du défi'+JSON.stringify(defi));
  console.log(JSON.parse(JSON.stringify(defi)))
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/defis/"+defi.defi,
  {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(defi)
  });
  return res.json();
}

}

