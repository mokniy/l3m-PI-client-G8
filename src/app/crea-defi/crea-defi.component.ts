import { Chami, DefiTmp, MotClefTmp } from './../AllDefinitions';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Arret, Defi, Indice, IndiceTmp } from '../AllDefinitions';
import { MapService } from '../map.service';
import { DefiService } from './../defi.service';

@Component({
  selector: 'app-crea-defi',
  templateUrl: './crea-defi.component.html',
  styleUrls: ['./crea-defi.component.scss']
})
export class CreaDefiComponent implements OnInit {

  @ViewChild('indice') indiceSaisie!: ElementRef;
  @ViewChild('points') indicePointsSaisie!: ElementRef;

  public createDefi=false;
  public createArret=false;
  public editArret=false;
  public labelEdited:string="";
  public indices: IndiceTmp[]=[];

  viderListe():void{
    this.indices = [];
  }

  addElement(element:string, points:string){

    this.indices.push({
      label_ind:"I"+(this.indices.length+1),
      description_ind: element,
      points_ind: +points
    });
    console.log(this.indices)
    this.indiceSaisie.nativeElement.value = '';
    this.indicePointsSaisie.nativeElement.value ='';
      }

  deleteElement(index:number){
    this.indices.splice(index,1);
  }

  editMode(label:string): void {
    this.labelEdited=label;
  }

  editIndiceAnnule() :void{
    this.labelEdited="";
  }

  editIndice(indice:string, index:number) :void{
    this.indices[index]={
      label_ind:"I"+(index+1),
      description_ind: indice,
      points_ind: this.indices[index].points_ind,
    };
    this.labelEdited="";

    console.log(this.indices);
  }

  editIndicePoints(points:string, index:number) :void{
    this.indices[index]={
      label_ind:"I"+(index+1),
      description_ind: this.indices[index].description_ind,
      points_ind: +points,
    };
    this.labelEdited="";

    console.log(this.indices);
  }


  modeEditArret(){
    this.createArret= false;
    this.createDefi=false;
    this.editArret=true;
    this.closeChoiceArretInBDD();
    this.indices=[];
  }

  modeCreateArret(){
    this.createArret= true;
    this.createDefi=false;
    this.editArret=false;
    this.closeChoiceArretInBDD();
    this.indices=[];
  }

  modeCreateDefi(){
    this.createDefi= true;
    this.createArret=false;
    this.editArret=false;
    this.closeChoiceArretInAPI();
    this.indices=[];
  }

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
    await this.MapService.recupWithLibelleInBDD(s)
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

  //METTRE EN PLACE MOT CLEF PUIS METTRE EN PLACE LA CREATION DE QUESTION/INDICE
  async creationDefi(defiTitre:string, defiType : string,arretInfo:string,descriptionSaisie:string, versionSaisie: string, pointsSaisie :string, dureeSaisie: string, prologueSaisie: string, epilogueSaisie: string, commentaireSaisie:string, motClefSaisie:string) {
    console.log("rezrzerze")
    const arretInfoSplited = arretInfo.trim().split(",")
    const dateObject = new Date(new Date().getTime())
    let d : DefiTmp = {
      titre: defiTitre.replace("'","''"),
      dateDeCreation: dateObject.toLocaleString(),
      description:descriptionSaisie.replace("'","''"),
      auteur:this.userConnected.pseudo,
      code_arret:arretInfoSplited[2].trim(),
      type:defiType.replace("'","''"),
      dateDeModification: '',
      version: +versionSaisie,
      arret: arretInfoSplited[2].trim().replace("'","''"),
      points: +pointsSaisie,
      duree: dureeSaisie.replace("'","''"),
      prologue: prologueSaisie.replace("'","''"),
      epilogue: epilogueSaisie.replace("'","''"),
      commentaire: commentaireSaisie.replace("'","''")
    }
    const rep = await this.defiService.postDefi(d);
    this.MapService.recupArretAvecDefiAPIPerso();
    this.createDefi=false;
    this.closeChoiceArretInBDD();

    console.log("ID CREER : "+rep.defi);

    //ON COUPE LA CHAINE DE CARACT DES MOTS CLEFS
      const lesMotsClefs = motClefSaisie.trim().toLowerCase().replace("'","''").split(" ").filter(
        function(elem, index, self) {
        return index === self.indexOf(elem);
       }).map( x =>
        this.createMotClefTmp(x)
        )

        if(lesMotsClefs.length > 1 || (lesMotsClefs.length === 1 && lesMotsClefs[0].mot_mc !== "") ) {
          console.log(lesMotsClefs);
          console.log("Liste mot clef : "+lesMotsClefs+" size : "+lesMotsClefs.length);
          //GENERATION SYSTEME MOT CLE
          console.log("debut")
          const MotClefInBDD = await this.defiService.postListMotClef(lesMotsClefs)
          console.log("fin");
          console.log(lesMotsClefs, "et", MotClefInBDD, ".");
          MotClefInBDD.forEach(  async element => {
            await this.defiService.postChercher({id_defi:rep.defi,id_mc:element.id_mc})
          });
        }

        if(this.indices.length !== 0) {
          //GENERATION SYSTEME INDICE
          this.indices.forEach(element => {
            element.id_defi=rep.defi
          });
          await this.defiService.postListIndice(this.indices);
          this.viderListe();
        }

  }

  createMotClefTmp(s:string):MotClefTmp {
    return {mot_mc:s}
  }

  creationArret(streetMapSaisie:string,arretInfo:string) {
    const arretInfoSplited = arretInfo.trim().split(",")
    let a : Arret = {
      code: arretInfoSplited[2].trim(),
      lib_arret: arretInfoSplited[1].trim().replace("'","''"),
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
      lib_arret: arretInfoSplited[1].trim().replace("'","''"),
      streetMap: streetMapSaisie
    }
    this.MapService.putArret(a);
    this.editArret=false;
    this.closeChoiceArretInBDD();

  }
}
