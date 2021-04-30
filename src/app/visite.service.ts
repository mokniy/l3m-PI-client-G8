import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NouvelleVisite, Question, Indice, Defi, MotClef, Arret } from './AllDefinitions';

@Injectable({
  providedIn: 'root'
})
export class VisiteService {

  private visiteEnCour = new BehaviorSubject<NouvelleVisite | undefined>(undefined);
  readonly obsVisiteEnCour = this.visiteEnCour.asObservable();

constructor() { }

async newVisite(id:string) {
  const responseDefi = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/defis/'+id);
  const dataDefi = await responseDefi.json() as Defi

  const responseIndice = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/indice/allindice/'+id);
  const dataIndice = await responseIndice.json() as Indice[]

  const responseQuestion = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/question/allquestion/'+id);
  const dataQuestion = await responseQuestion.json() as Question[];

  const responseMotClef = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/chercher/allmc/'+id);
  const dataMotClef = await responseMotClef.json() as MotClef[];

  const responseArret = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/arret/"+dataDefi.code_arret);
  const dataArret = await responseArret.json() as Arret;

  const v:NouvelleVisite = {
    leDefi:dataDefi,
    lArret:dataArret,
    lesIndices:dataIndice,
    lesMotsClefs:dataMotClef,
    lesQuestions:dataQuestion
  }
  console.log(v);
  this.visiteEnCour.next(v)
}

closeNewVisite() {
  this.visiteEnCour.next(undefined)
}


}
