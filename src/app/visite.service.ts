import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NouvelleVisite, Defi, MotClef, Arret, IndiceForVisite, QuestionForVisite, VisiteTmp, Visite, Reponse, ReponseTmp, escape_quote, EvaluationTmp, ArretMap } from './AllDefinitions';

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
  const dataIndice = await responseIndice.json() as IndiceForVisite[]

  const responseQuestion = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/question/allquestion/'+id);
  const dataQuestion = await responseQuestion.json() as QuestionForVisite[];

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
  this.visiteEnCour.next(v)
}

async postVisite(visite: VisiteTmp): Promise<Visite> {
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/visite/",
  {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(visite)
  });
  return res.json();
}

closeNewVisite() {
  this.visiteEnCour.next(undefined)
}

async postListReponse(listReponse:ReponseTmp[]): Promise<Reponse[]> {
  listReponse.forEach(element => {
    element.reponse_rep=escape_quote(element.reponse_rep)
  });
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/reponse/list",
  {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(listReponse)
  });
  const R =  await res.json();
  return R;
}


async postListEvaluation(listEval:EvaluationTmp[]): Promise<void> {
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/evaluation/list",
  {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(listEval)
  });
  const R =  await res.json();
}

  //////////TAB AFFICHAGE VISITE
  private VisiteOfAnArret = new BehaviorSubject<Visite[]>([]);
  readonly obsVisArret = this.VisiteOfAnArret.asObservable();

  //////////TAB AFFICHAGE VISITE
async getAllVisiteOfAnArret(unArret:ArretMap){
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/visite/arret/'+unArret.info_arret.properties.CODE+"/");
  const data = await response.json();
  this.VisiteOfAnArret.next( data as Visite[] );
}

closeAllVisite():void {
  this.VisiteOfAnArret.next([]);
}

}
