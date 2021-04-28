import { MotClef, MotClefTmp } from './../AllDefinitions';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Defi, IndiceTmp, Indice, QuestionTmp, Question } from '../AllDefinitions';
import { DefiService } from '../defi.service';
import { UtilisateurService } from '../utilisateur.service';

@Component({
  selector: 'app-edit-defi',
  templateUrl: './edit-defi.component.html',
  styleUrls: ['./edit-defi.component.scss']
})
export class EditDefiComponent implements OnInit {
  defi_edited : Defi | null = null;
  public labelEdited:string="";
  public indicesInit: IndiceTmp[]=[];
  public indicesEdit: IndiceTmp[]=[];
  public questionsInit: QuestionTmp[]=[];
  public questionsEdit: QuestionTmp[]=[];
  public labelEditedQuestion:string="";
  public lesMotsClefsInit: MotClefTmp[]=[];
  public lesMotsClefsEdit: MotClefTmp[]=[];

  @ViewChild('indice') indiceSaisie!: ElementRef;
  @ViewChild('points') indicePointsSaisie!: ElementRef;

  @ViewChild('question') questionSaisie!: ElementRef;
  @ViewChild('secret') secretSaisie!: ElementRef;
  @ViewChild('pointsQuestion') questionPointsSaisie!: ElementRef;

  constructor(private UserService: UtilisateurService,private defiService: DefiService) {
    this.recupDefiUnUser();

    this.defiService.obsQuestions.subscribe((x) => {
      x.forEach(element => {
        this.questionsInit.push(
          {
            label_qst: element.label_qst,
            description_qst: element.description_qst,
            secret_qst: element.secret_qst,
            points_qst: element.points_qst,
            id_defi: this.defi_edited?.defi
          }
        ),
        this.questionsEdit.push(
          {
            label_qst: element.label_qst,
            description_qst: element.description_qst,
            secret_qst: element.secret_qst,
            points_qst: element.points_qst,
            id_defi: this.defi_edited?.defi
          }
        )
      })
    });

    this.defiService.obsIndices.subscribe((x) => {
      x.forEach(element => {
        this.indicesInit.push({
            label_ind: element.label_ind,
            description_ind: element.description_ind,
            points_ind: element.points_ind,
            id_defi : this.defi_edited?.defi
          }
        ),
        this.indicesEdit.push(
          {
            label_ind: element.label_ind,
            description_ind: element.description_ind,
            points_ind: element.points_ind,
            id_defi : this.defi_edited?.defi
          }
        )
      })
    });
  }

  ngOnInit() {
  }

  get obsChallUser(): Observable<Defi[]> {
    return this.defiService.obsChallUser;
  }

  get obsIndice(): Observable<Indice[]> {
    return this.defiService.obsIndices;
  }

  get obsQuestion(): Observable<Question[]> {
    return this.defiService.obsQuestions;
  }

  get obsMotClef(): Observable<MotClef[]> {
    return this.defiService.obsMotClefs;
  }

  async editedModeForDefi(defi:Defi) {
    this.clearTab();
    this.defi_edited = defi;
    await this.recupIndicesUnDefi(defi);
    await this.recupQuestionsUnDefi(defi);
    await this.recupMotClef(defi);
  }

  clearTab(){
    this.indicesInit=[];
    this.indicesEdit=[];
    this.questionsEdit=[];
    this.questionsInit=[];
  }

  async deleteDefi(d:Defi) {
    await this.defiService.deleteDefi(d);
    this.defi_edited = null;
    this.recupDefiUnUser();
  }

  recupDefiUnUser() {
    this.UserService.userObs.subscribe((x) => {
      if (!!x) {
        if (!!x.chami) {
          this.defiService.getAllDefiOfAnUsers(x.chami);
        }
      }
    });
  }

    async recupMotClef(defi:Defi){
      this.lesMotsClefsInit = await this.defiService.getAllMotClefsOfDefi(defi);
  }

  getMotClef():string {
  let str="";
  this.lesMotsClefsInit.forEach(element => {
    str += element.mot_mc+" "
  });
  return str
}
  async recupIndicesUnDefi(defi:Defi){
    await this.defiService.getAllIndicesOfDefi(defi);
}

  async recupQuestionsUnDefi(defi:Defi){
  await this.defiService.getAllQuestionsOfDefi(defi);
}

  addQuestion(question:string,secret:string,points:string){
  this.questionsEdit.push({
    label_qst:"Q"+(this.questionsEdit.length+1),
    description_qst: question,
    secret_qst:secret,
    points_qst:+points,
    id_defi: this.defi_edited?.defi
    })
  this.questionSaisie.nativeElement.value = '';
  this.questionPointsSaisie.nativeElement.value ='';
  this.secretSaisie.nativeElement.value = '';
  }

  deleteQuestion(index:number){
    this.questionsEdit.splice(index,1);
  }

  editModeQuestion(label:string): void {
    this.labelEditedQuestion=label;
  }
  editQuestionAnnule() :void{
    this.labelEditedQuestion="";
  }

  editQuestion(question:string, index:number) :void{
    this.questionsEdit[index]={
      label_qst:"Q"+(index+1),
      description_qst: question,
      secret_qst: this.questionsEdit[index].secret_qst,
      points_qst: this.questionsEdit[index].points_qst,
      id_defi: this.defi_edited?.defi
    };
    this.labelEditedQuestion="";
  }

  editQuestionPoints(points:string, index:number) :void{
    this.questionsEdit[index]={
      label_qst:"Q"+(index+1),
      description_qst: this.questionsEdit[index].description_qst,
      secret_qst: this.questionsEdit[index].secret_qst,
      points_qst: +points,
      id_defi: this.defi_edited?.defi
    };
    this.labelEditedQuestion="";

  }

  editSecret(secret:string, index:number) :void{
    this.questionsEdit[index]={
      label_qst:"Q"+(index+1),
      description_qst: this.questionsEdit[index].description_qst,
      secret_qst: secret,
      points_qst: this.questionsEdit[index].points_qst,
      id_defi: this.defi_edited?.defi
    };
    this.labelEditedQuestion="";

  }

  addElement(element:string, points:string){
    this.indicesEdit.push({
      label_ind:"I"+(this.indicesEdit.length+1),
      description_ind: element,
      points_ind: +points,
      id_defi: this.defi_edited?.defi
    });
    this.indiceSaisie.nativeElement.value = '';
    this.indicePointsSaisie.nativeElement.value ='';
      }

  deleteElement(index:number){
    this.indicesEdit.splice(index,1);
  }

  editMode(label:string): void {
    this.labelEdited=label;
  }

  editIndiceAnnule() :void{
    this.labelEdited="";
  }

  editIndice(indice:string, index:number) :void{
    this.indicesEdit[index]={
      label_ind:"I"+(index+1),
      description_ind: indice,
      points_ind: this.indicesEdit[index].points_ind,
      id_defi: this.defi_edited?.defi
    };
    this.labelEdited="";

  }

  editIndicePoints(points:string, index:number) :void{
    this.indicesEdit[index]={
      label_ind:"I"+(index+1),
      description_ind: this.indicesEdit[index].description_ind,
      points_ind: +points,
      id_defi: this.defi_edited?.defi
    };
    this.labelEdited="";

  }

  async updateDefi(defiSaisiedefi:string, defiSaisietitre: string, defiSaisiedateDeCreation: string, defiSaisiedescription: string, defiSaisieauteur: string, defiSaisiecode_arret: string, defiSaisietype :string, defiSaisieversion: string, defiSaisiearret: string, defiSaisiepoints: string, defiSaisieduree: string, defiSaisieprologue: string, defiSaisieepilogue: string, defiSaisiecommentaire: string, motClefSaisie:string) {
    const dateObject = new Date(new Date().getTime())
      let d : Defi = {
        defi:defiSaisiedefi,
        titre:defiSaisietitre.replace("'","''"),
        dateDeCreation:defiSaisiedateDeCreation,
        description:defiSaisiedescription.replace("'","''"),
        auteur:defiSaisieauteur,
        code_arret:defiSaisiecode_arret,
        type: defiSaisietype,
        dateDeModification: dateObject.toLocaleString(),
        version: +defiSaisieversion,
        arret: defiSaisiearret.replace("'","''"),
        points: +defiSaisiepoints,
        duree: defiSaisieduree.replace("'","''"),
        prologue: defiSaisieprologue.replace("'","''"),
        epilogue: defiSaisieepilogue.replace("'","''"),
        commentaire: defiSaisiecommentaire.replace("'","''")
      }
      console.log("Modification du défi effectué"+d.defi);
      await this.defiService.putDefi(d);


      if(JSON.stringify(this.indicesEdit) !== JSON.stringify(this.indicesInit)){
        await this.defiService.deleteIndicesOfDefi(d.defi);
        this.defiService.postListIndice(this.indicesEdit);
      }

      if(JSON.stringify(this.questionsEdit)!==JSON.stringify(this.questionsInit)){
        await this.defiService.deleteQuestionsOfDefi(d.defi);
        this.defiService.postListQuestion(this.questionsEdit);
      }

      //VERIFIER SI MOT CLEF ON CHANGE

      //ON COUPE LA CHAINE DE CARACT DES MOTS CLEFS
        this.lesMotsClefsEdit = motClefSaisie.trim().toLowerCase().replace("'","''").split(" ").filter(
          function(elem, index, self) {
          return index === self.indexOf(elem);
        }).map( x =>
          this.createMotClefTmp(x)
          )

          if(JSON.stringify(this.lesMotsClefsEdit) !== JSON.stringify(this.lesMotsClefsInit)  )
          {
            await this.defiService.deleteMotsClefsOfDefi(d.defi)
            if(this.lesMotsClefsEdit.length > 1 || (this.lesMotsClefsEdit.length === 1 && this.lesMotsClefsEdit[0].mot_mc !== "") ) {
              console.log(this.lesMotsClefsEdit);
              console.log("Liste mot clef : "+this.lesMotsClefsEdit+" size : "+this.lesMotsClefsEdit.length);
              //GENERATION SYSTEME MOT CLE
              console.log("debut")
              const MotClefInBDD = await this.defiService.postListMotClef(this.lesMotsClefsEdit)
              console.log("fin");
              console.log(this.lesMotsClefsEdit, "et", MotClefInBDD, ".");
              MotClefInBDD.forEach(  async element => {
                await this.defiService.postChercher({id_defi:d.defi,id_mc:element.id_mc})
              });
            }
          }


      this.defi_edited = null;
      this.recupDefiUnUser();
      this.defiService.closeEditDefi();
      this.clearTab();
    }



  createMotClefTmp(s:string):MotClefTmp {
    return {mot_mc:s}
  }
}
