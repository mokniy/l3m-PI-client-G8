import { Chami, current_date, DefiTmp, escape_quote, MotClefTmp } from './../AllDefinitions';
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Arret, Defi, Indice, IndiceTmp, QuestionTmp } from '../AllDefinitions';
import { MapService } from '../map.service';
import { DefiService } from './../defi.service';

@Component({
  selector: 'app-crea-defi',
  templateUrl: './crea-defi.component.html',
  styleUrls: ['./crea-defi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Pour minimiser les rendus et les évaluations
})
export class CreaDefiComponent implements OnInit {

  @ViewChild('indice') indiceSaisie!: ElementRef;
  @ViewChild('points') indicePointsSaisie!: ElementRef;

  @ViewChild('question') questionSaisie!: ElementRef;
  @ViewChild('secret') secretSaisie!: ElementRef;
  @ViewChild('pointsQuestion') questionPointsSaisie!: ElementRef;

  public createDefi=false;
  public createArret=false;
  public editArret=false;
  public labelEdited:string="";
  public indices: IndiceTmp[]=[];
  public questions: QuestionTmp[]=[];
  public labelEditedQuestion:string="";

  public indispo:boolean=false;

  //INPUT USER AUTH
  constructor(private MapService : MapService, private defiService : DefiService) {

  }

  @Input() userConnected!: Chami;

  ngOnInit() {
  }

  get obsArretInBDD(): Observable<GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString, any>[]> {
    return this.MapService.obsArretInBDD;
  }

  get obsArretInAPI(): Observable<GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString, any>[]> {
    return this.MapService.obsArretInAPI;
  }

  async recupLibIn(s:string){
    this.indispo = await this.MapService.recupWithLibelleInBDD(s);
  }

  setView() {
    let el = document.getElementById("defiCreated") as HTMLElement
    el.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  ngAfterViewInit() {

  }

  async recupLibNotIn(s:string){
    await this.MapService.recupWithLibelleNotInBDD(s)
  }

  closeChoiceArretInBDD() {
    this.MapService.closeChoiceArretInBDD()
  }

  closeChoiceArretInAPI() {
    this.MapService.closeChoiceArretInAPI()
  }

  closeChoiceArret() {
    this.createArret= false;
    this.createDefi=false;
    this.editArret=false;
    this.indispo=false;
  }

  modeEditArret(){
    this.createArret= false;
    this.createDefi=false;
    this.editArret=true;
    this.closeChoiceArretInBDD();
    this.indices=[];
    this.questions = [];
    this.indispo=false;
  }

  modeCreateArret(){
    this.createArret= true;
    this.createDefi=false;
    this.editArret=false;
    this.closeChoiceArretInBDD();
    this.indices=[];
    this.questions = [];
    this.indispo=false;
  }

  modeCreateDefi(){
    this.createDefi= true;
    this.createArret=false;
    this.editArret=false;
    this.closeChoiceArretInAPI();
    this.indices=[];
    this.questions = [];
    this.indispo=false;
  }

  viderListe():void{
    this.indices = [];
    this.questions = [];
  }

/////QUESTION
  addQuestion(question:string,secret:string,points:string){
    this.questions.push(this.defiService.addQuestionService(question,secret,points,this.questions.length))
    this.questionSaisie.nativeElement.value = '';
    this.questionPointsSaisie.nativeElement.value ='';
    this.secretSaisie.nativeElement.value = '';
  }

  deleteQuestion(index:number){
    this.questions.splice(index,1);
  }

  editQuestion(question:string, index:number) :void{
    this.questions[index]=this.defiService.editQuestionService(question, this.questions[index]);
    this.labelEditedQuestion="";
  }

  editQuestionPoints(points:string, index:number) :void{
    this.questions[index]=this.defiService.editQuestionPointsService(points,this.questions[index]);
    this.labelEditedQuestion="";
  }

  editSecret(secret:string, index:number) :void{
    this.questions[index]=this.defiService.editQuestionSecretService(secret,this.questions[index])
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

  addElement(indice:string, points:string){
    this.indices.push(this.defiService.addIndiceService(indice,points,this.indices.length));
    this.indiceSaisie.nativeElement.value = '';
    this.indicePointsSaisie.nativeElement.value ='';
  }

  deleteElement(index:number){
    this.indices.splice(index,1);
  }

  editIndice(indice:string, index:number) :void{
    this.indices[index]=this.defiService.editIndiceService(indice,this.indices[index]);
    this.labelEdited="";
  }

  editIndicePoints(points:string, index:number) :void{
    this.indices[index]=this.defiService.editIndicePointsService(points,this.indices[index]);
    this.labelEdited="";
  }

  editMode(label:string): void {
    this.labelEdited=label;
  }

  editIndiceAnnule() :void{
    this.labelEdited="";
  }

  /////FIN INDICE

  //METTRE EN PLACE MOT CLEF PUIS METTRE EN PLACE LA CREATION DE QUESTION/INDICE
  async creationDefi(defiTitre:string, defiType : string,arretInfo:string,descriptionSaisie:string, versionSaisie: string, pointsSaisie :string, dureeSaisie: string, prologueSaisie: string, epilogueSaisie: string, commentaireSaisie:string, motClefSaisie:string) {
    const arretInfoSplited = arretInfo.trim().split(",")
    let d : DefiTmp = {
      titre: escape_quote(defiTitre),
      dateDeCreation: current_date().toLocaleString(),
      description:escape_quote(descriptionSaisie),
      auteur:this.userConnected.pseudo,
      code_arret:arretInfoSplited[2].trim(),
      type:escape_quote(defiType),
      dateDeModification: '',
      version: +versionSaisie,
      arret: escape_quote(arretInfoSplited[1].trim()),
      points: +pointsSaisie,
      duree: escape_quote(dureeSaisie),
      prologue: escape_quote(prologueSaisie),
      epilogue: escape_quote(epilogueSaisie),
      commentaire: escape_quote(commentaireSaisie)
    }
    const rep = await this.defiService.postDefi(d);
    this.MapService.recupArretAvecDefiAPIPerso();
    this.createDefi=false;
    this.closeChoiceArretInBDD();

    //ON COUPE LA CHAINE DE CARACT DES MOTS CLEFS
      const lesMotsClefs = this.defiService.decoupeMotClef(motClefSaisie);

        if(lesMotsClefs.length > 1 || (lesMotsClefs.length === 1 && lesMotsClefs[0].mot_mc !== "") ) {
          //GENERATION SYSTEME MOT CLE
          const MotClefInBDD = await this.defiService.postListMotClef(lesMotsClefs)
          MotClefInBDD.forEach(  async element => {
            await this.defiService.postChercher({id_defi:rep.defi,id_mc:element.id_mc})
          });
        }

        if(this.indices.length !== 0) {
          //GENERATION SYSTEME INDICE
          this.indices.forEach(element => {
            element.id_defi=rep.defi
          });
          this.indices.forEach(element => element.label_ind = "I"+(this.indices.indexOf(element)+1))
          await this.defiService.postListIndice(this.indices);
        }

        if(this.questions.length !== 0) {
          //GENERATION SYSTEME QUESTION
          this.questions.forEach(element => {
            element.id_defi=rep.defi
          });
          this.questions.forEach(element => element.label_qst = "Q"+(this.questions.indexOf(element)+1))
          await this.defiService.postListQuestion(this.questions);
        }
        this.viderListe();

  }

  creationArret(streetMapSaisie:string,arretInfo:string) {
    const arretInfoSplited = arretInfo.trim().split(",")
    let a : Arret = {
      code: arretInfoSplited[2].trim(),
      lib_arret: arretInfoSplited[1].trim().replace(/'/g,"''"),
      streetMap: streetMapSaisie
    }
    this.MapService.postArret(a);
    this.createArret=false;
    this.closeChoiceArretInAPI();
  }

  updateArret(arretInfo:string,streetMapSaisie:string) {
    const arretInfoSplited = arretInfo.trim().split(",")
    let a : Arret = {
      code: arretInfoSplited[2].trim(),
      lib_arret: arretInfoSplited[1].trim().replace(/'/g,"''"),
      streetMap: streetMapSaisie
    }
    this.MapService.putArret(a);
    this.editArret=false;
    this.closeChoiceArretInBDD();

  }
}
