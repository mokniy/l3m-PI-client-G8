import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Defi, Chami, DefiTmp, MotClef, Chercher, MotClefTmp, Indice, IndiceTmp, QuestionTmp, Question } from "./AllDefinitions";

@Injectable({
  providedIn: 'root'
})
export class DefiService {

  private DefisSubj = new BehaviorSubject<Defi[]>( [] );
  readonly obsAllChall = this.DefisSubj.asObservable();

  private DefisOfAnUser = new BehaviorSubject<Defi[]>( [] );
  readonly obsChallUser = this.DefisOfAnUser.asObservable();

constructor() {
  const dateObject = new Date(new Date().getTime())
  const humanDateFormat = dateObject.toLocaleString()
  console.log(humanDateFormat)
 }


async getAllDefi(){
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/defis/');
  const data = await response.json();
  //console.log(data)
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


async postDefi(defi: DefiTmp): Promise<Defi> {
  console.log('Je suis dans la création du défi : '+JSON.stringify(defi));
  console.log(JSON.parse(JSON.stringify(defi)))
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/defis/",
  {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(defi)
  });
  return res.json();
}

async deleteDefi(defi: Defi) {
  console.log('Je suis dans la suppression du défi', defi);
  console.log(JSON.parse(JSON.stringify(defi)))
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/defis/"+defi.defi,
  {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(defi)
  });
}

////////////////////////////////////////TEST MOT CLEF

async postMotClef(mot:MotClefTmp): Promise<MotClef> {
  //Je suis dans la création du mot clef : "{\"mot_mc\":\"beta\"}"
  console.log('Je suis dans la création du mot clef : ', mot);
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/motclef/",
  {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(mot)
  });
  const R =  await res.json();
  console.log(mot, "=>", R);
  return R;
}

async postListMotClef(listMot:MotClefTmp[]): Promise<MotClef[]> {
  console.log('Je suis dans la création des mots clef : ', listMot);
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/motclef/list",
  {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(listMot)
  });
  const R =  await res.json();
  console.log(listMot, "=>", R);
  return R;
}

async postChercher(C: Chercher) {
  console.log('Je suis dans la création du chercher : '+JSON.stringify(C));
  console.log(JSON.parse(JSON.stringify(C)))
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/chercher/"+C.id_defi+"&"+C.id_mc,
  {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(C)
  });
}

async recupererMotClefUnDefi(id:string){
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/chercher/allmc/'+id);
  const data = await response.json();
  console.log(data)
  return data as MotClef[]
}

async postListIndice(listIndice:IndiceTmp[]): Promise<Indice[]> {
  console.log('Je suis dans la création des indices : ', listIndice);
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/indice/list",
  {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(listIndice)
  });
  const R =  await res.json();
  console.log(listIndice, "=>", R);
  return R;
}

async postListQuestion(listQuestion:QuestionTmp[]): Promise<Question[]> {
  console.log('Je suis dans la création des questions : ', listQuestion);
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/question/list",
  {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(listQuestion)
  });
  const R =  await res.json();
  console.log(listQuestion, "=>", R);
  return R;
}

}

