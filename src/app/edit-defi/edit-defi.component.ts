import { current_date, escape_quote, MotClef, MotClefTmp } from './../AllDefinitions';
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


  ngOnInit() {
  }

  constructor(private UserService: UtilisateurService,private defiService: DefiService) {
    this.recupDefiUnUser();
    this.defiService.obsQuestions.subscribe((x) => {
      x.forEach(element => {
        this.questionsInit.push(
          {
            ...element,
            id_defi: this.defi_edited?.defi
          }
        ),
        this.questionsEdit.push(
          {
            ...element,
            id_defi: this.defi_edited?.defi
          }
        )
      })
    });
    this.defiService.obsIndices.subscribe((x) => {
      x.forEach(element => {
        this.indicesInit.push({
            ...element,
            id_defi : this.defi_edited?.defi
          }
        ),
        this.indicesEdit.push(
          {
            ...element,
            id_defi : this.defi_edited?.defi
          }
        )
      })
    });
    this.defiService.obsMotClefs.subscribe((x) => {
      x.forEach(element => {
        this.lesMotsClefsInit.push({
            mot_mc:element.mot_mc
          }
        ),
        this.lesMotsClefsEdit.push(
          {
            mot_mc:element.mot_mc
          }
        )
      })
    });
  }

  async editedModeForDefi(defi:Defi) {
    this.clearTab();
    this.defi_edited = defi;
    await this.recupIndicesUnDefi(defi);
    await this.recupQuestionsUnDefi(defi);
    await this.recupMotClef(defi);
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

  clearTab(){
    this.indicesInit=[];
    this.indicesEdit=[];
    this.questionsEdit=[];
    this.questionsInit=[];
    this.lesMotsClefsEdit=[];
    this.lesMotsClefsInit=[];
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

  getMotClef():string {
  let str="";
  this.lesMotsClefsInit.forEach(element => {
    str += element.mot_mc+" "
  });
  return str
}

  async recupMotClef(defi:Defi){
    await this.defiService.getAllMotClefsOfDefi(defi);
  }

/////QUESTION
    async recupQuestionsUnDefi(defi:Defi){
      await this.defiService.getAllQuestionsOfDefi(defi);
    }

  addQuestion(question:string,secret:string,points:string){
  this.questionsEdit.push({
    ...this.defiService.addQuestionService(question,secret,points,this.questionsEdit.length),
    id_defi: this.defi_edited?.defi
    })
  this.questionSaisie.nativeElement.value = '';
  this.questionPointsSaisie.nativeElement.value ='';
  this.secretSaisie.nativeElement.value = '';
  }

  deleteQuestion(index:number){
    this.questionsEdit.splice(index,1);
  }

  editQuestion(question:string, index:number) :void{
    this.questionsEdit[index]={
      ...this.defiService.editQuestionService(question, this.questionsEdit[index]),
      id_defi: this.defi_edited?.defi
    };
    this.labelEditedQuestion="";
  }

  editQuestionPoints(points:string, index:number) :void{
    this.questionsEdit[index]={
      ...this.defiService.editQuestionPointsService(points,this.questionsEdit[index]),
      id_defi: this.defi_edited?.defi
    };
    this.labelEditedQuestion="";
  }

  editSecret(secret:string, index:number) :void{
    this.questionsEdit[index]={
      ...this.defiService.editQuestionSecretService(secret,this.questionsEdit[index]),
      id_defi: this.defi_edited?.defi
    };
    this.labelEditedQuestion="";
  }

  editModeQuestion(label:string): void {
    this.labelEditedQuestion=label;
  }

  editQuestionAnnule() :void{
    this.labelEditedQuestion="";
  }
  ///// FIN QUESTION

/////INDICE
  async recupIndicesUnDefi(defi:Defi){
    await this.defiService.getAllIndicesOfDefi(defi);
  }

  addElement(indice:string, points:string){
    this.indicesEdit.push({
      ...this.defiService.addIndiceService(indice,points,this.indicesEdit.length),
      id_defi: this.defi_edited?.defi
    });
    this.indiceSaisie.nativeElement.value = '';
    this.indicePointsSaisie.nativeElement.value ='';
  }

  deleteElement(index:number){
    this.indicesEdit.splice(index,1);
  }

  editIndice(indice:string, index:number) :void{
    this.indicesEdit[index]={
      ...this.defiService.editIndiceService(indice,this.indicesEdit[index]),
      id_defi: this.defi_edited?.defi
    };
    this.labelEdited="";
  }

  editIndicePoints(points:string, index:number) :void{
    this.indicesEdit[index]={
      ...this.defiService.editIndicePointsService(points,this.indicesEdit[index]),
      id_defi: this.defi_edited?.defi
    };
    this.labelEdited="";
  }

  editMode(label:string): void {
    this.labelEdited=label;
  }

  editIndiceAnnule() :void{
    this.labelEdited="";
  }
  /////FIN INDICE

  async updateDefi(defiSaisiedefi:string, defiSaisietitre: string, defiSaisiedateDeCreation: string, defiSaisiedescription: string, defiSaisieauteur: string, defiSaisiecode_arret: string, defiSaisietype :string, defiSaisieversion: string, defiSaisiearret: string, defiSaisiepoints: string, defiSaisieduree: string, defiSaisieprologue: string, defiSaisieepilogue: string, defiSaisiecommentaire: string, motClefSaisie:string) {
        let d : Defi = {
        defi:defiSaisiedefi,
        titre:escape_quote(defiSaisietitre),
        dateDeCreation:defiSaisiedateDeCreation,
        description: escape_quote(defiSaisiedescription),
        auteur:defiSaisieauteur,
        code_arret:defiSaisiecode_arret,
        type: defiSaisietype,
        dateDeModification: current_date().toLocaleString(),
        version: +defiSaisieversion,
        arret: escape_quote(defiSaisiearret),
        points: +defiSaisiepoints,
        duree: escape_quote(defiSaisieduree),
        prologue: escape_quote(defiSaisieprologue),
        epilogue: escape_quote(defiSaisieepilogue),
        commentaire: escape_quote(defiSaisiecommentaire)
      }
      await this.defiService.putDefi(d);


      if(JSON.stringify(this.indicesEdit) !== JSON.stringify(this.indicesInit)){
        const resIND = await this.defiService.deleteIndicesOfDefi(d.defi);
        this.indicesEdit.forEach(element => element.label_ind = "I"+(this.indicesEdit.indexOf(element)+1))
        this.defiService.postListIndice(this.indicesEdit);

        if(resIND.status === 404) {
          console.log("Aucun indice dans la BDD.")
        }
      }

      if(JSON.stringify(this.questionsEdit)!==JSON.stringify(this.questionsInit)){
        this.questionsEdit.forEach(element => element.label_qst = "Q"+(this.questionsEdit.indexOf(element)+1))
        const resQST = await this.defiService.deleteQuestionsOfDefi(d.defi);
        this.defiService.postListQuestion(this.questionsEdit);

        if(resQST.status === 404) {
          console.log("Aucune question dans la BDD.")
        }
      }

      //VERIFIER SI MOT CLEF ON CHANGE

      //ON COUPE LA CHAINE DE CARACT DES MOTS CLEFS
        this.lesMotsClefsEdit = this.defiService.decoupeMotClef(motClefSaisie)

          console.log("MOT CLEF : !!!"+JSON.stringify(this.lesMotsClefsEdit) + JSON.stringify(this.lesMotsClefsInit)  )
          if(JSON.stringify(this.lesMotsClefsEdit) !== JSON.stringify(this.lesMotsClefsInit)  )
          {
            const resMC = await this.defiService.deleteMotsClefsOfDefi(d.defi)
            if(resMC.status === 404) {
              console.log("Aucun mot-clef dans la BDD.")
            }
            if(this.lesMotsClefsEdit.length > 1 || (this.lesMotsClefsEdit.length === 1 && this.lesMotsClefsEdit[0].mot_mc !== "") ) {
              const MotClefInBDD = await this.defiService.postListMotClef(this.lesMotsClefsEdit)
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
}
