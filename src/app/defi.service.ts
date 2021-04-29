import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Defi, Chami, DefiTmp, MotClef, Chercher, MotClefTmp, Indice, IndiceTmp, QuestionTmp, Question } from "./AllDefinitions";

@Injectable({
  providedIn: 'root'
})
export class DefiService {

  private DefisSubj = new BehaviorSubject<Defi[]>( [] );
  readonly obsAllChall = this.DefisSubj.asObservable();

  private DefisOfAnUser = new BehaviorSubject<Defi[]>( [] );
  readonly obsChallUser = this.DefisOfAnUser.asObservable();

  private IndicesOfDefi = new Subject<Indice[]>();
  readonly obsIndices = this.IndicesOfDefi.asObservable();

  private QuestionsOfDefi = new Subject<Question[]>();
  readonly obsQuestions = this.QuestionsOfDefi.asObservable();

  private MotClefsOfDefi = new BehaviorSubject<MotClef[]>( [] );
  readonly obsMotClefs = this.MotClefsOfDefi.asObservable();

constructor() {
  const dateObject = new Date(new Date().getTime())
  const humanDateFormat = dateObject.toLocaleString()
  console.log(humanDateFormat)
 }


async getAllDefi(){
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/defis/');
  const data = await response.json();
  this.DefisSubj.next( data as Defi[]);
}

async getAllDefiOfAnUsers(user:Chami){
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/defis/auteur/'+user.pseudo);
  const data = await response.json();
  this.DefisOfAnUser.next( data as Defi[] );
}

async getAllIndicesOfDefi(defi:Defi){
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/indice/allindice/'+defi.defi);
  const data = await response.json();
  console.log(data)
  this.IndicesOfDefi.next( data as Indice[] );
}

async getAllQuestionsOfDefi(defi:Defi){
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/question/allquestion/'+defi.defi);
  const data = await response.json();
  this.QuestionsOfDefi.next( data as Question[] );
}

async getAllMotClefsOfDefi(defi:Defi):Promise<MotClefTmp[]>{
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/chercher/allmc/'+defi.defi);
  const data = await response.json();
  this.MotClefsOfDefi.next( data as MotClef[] );
  return data as MotClefTmp[]
}

closeEditDefi() {
  this.MotClefsOfDefi.next( [] );
  this.QuestionsOfDefi.next( [] );
  this.IndicesOfDefi.next( []);
}

async putDefi(defi: Defi): Promise<Defi> {
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

async deleteIndicesOfDefi(idDefi:string) {
  console.log('Je suis dans la suppression des indices de un defi');
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/indice/deleteallindice/"+idDefi,
  {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
  });
  return res;
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

async deleteQuestionsOfDefi(idDefi:string) {
  console.log('Je suis dans la suppression des questions de un defi');
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/question/deleteallquestion/"+idDefi,
  {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body:""
  });
  return res;
}

async deleteMotsClefsOfDefi(idDefi:string) {
  console.log('Je suis dans la suppression des motsClefs de un defi');
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/motclef/deleteallmotclef/"+idDefi,
  {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body:""
  });
  return res;
}

///////////////////CREATION ET MODIFICATION QUESTION
addQuestionService(question:string,secret:string,points:string,length:number):QuestionTmp {
  return {
    label_qst:"Q"+(length+1),
    description_qst: question,
    secret_qst:secret,
    points_qst:+points
    }
}

editQuestionService(question:string,questionOriginal:QuestionTmp):QuestionTmp {
  return {
    ...questionOriginal,
    description_qst: question
    }
}

}
