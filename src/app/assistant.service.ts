import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Defi } from './AllDefinitions';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {

constructor() { }

private DefisSubj = new Subject<Defi[]>();
readonly obsAllChall = this.DefisSubj.asObservable();

async getRechercheDefiId(content:string, type:string):Promise<Defi[]>{
  let data;
  if(content === "") {
    if(type === 'Enigme') {
      const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/defis/enigme/');
      data = await response.json();
    } else if (type === 'Challenge') {
      const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/defis/challenge/');
      data = await response.json();
    } else {
      const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/defis/');
      data = await response.json();
    }
  } else {
    const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/defis/type/'+content+'&'+type);
    data = [await response.json() as Defi]
  }
  this.DefisSubj.next( data as Defi[] );
  return data as Defi[];
}

async getRechercheDefiTitre(content:string, type:string):Promise<Defi[]>{
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/defis/titre/'+content+'&'+type);
  const data = await response.json();
  this.DefisSubj.next( data as Defi[] );
  return data as Defi[];
}

async getRechercheDefiMc(content:string, type:string):Promise<Defi[]>{
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/chercher/alldefis/type/'+content+'&'+type);
  const data = await response.json();
  this.DefisSubj.next( data as Defi[] );
  return data as Defi[];
}

close() {
  this.DefisSubj.next([])
}

aucuneSaisie() {
  this.DefisSubj.next([])
}

}


