import { Chami, DefiTmp, MotClefTmp } from './../AllDefinitions';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Arret, Defi } from '../AllDefinitions';
import { MapService } from '../map.service';
import { DefiService } from './../defi.service';

@Component({
  selector: 'app-crea-defi',
  templateUrl: './crea-defi.component.html',
  styleUrls: ['./crea-defi.component.scss']
})
export class CreaDefiComponent implements OnInit {

  public createDefi=false;
  public createArret=false;
  public editArret=false;

  modeEditArret(){
    this.createArret= false;
    this.createDefi=false;
    this.editArret=true;
    this.closeChoiceArretInBDD();
  }

  modeCreateArret(){
    this.createArret= true;
    this.createDefi=false;
    this.editArret=false;
    this.closeChoiceArretInBDD();
  }

  modeCreateDefi(){
    this.createDefi= true;
    this.createArret=false;
    this.editArret=false;
    this.closeChoiceArretInAPI();
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
      const lesMotsClefs = motClefSaisie.trim().toLowerCase().replace("'","''").split(" ").filter(function(elem, index, self) {
        return index === self.indexOf(elem);
    })
    console.log(lesMotsClefs);
    //AJOUT MOT CLEF DANS BDD
    console.log("debut")
    const MotClefInBDD = await Promise.all(
      lesMotsClefs.map(async x => await this.defiService.postMotClef({mot_mc : x}))
    );
    console.log("fin");
    console.log(MotClefInBDD);

    //AVEC LE RETOUR ON INSERE DANS CHERCHER => CREER CHERCHER
    MotClefInBDD.forEach(  async element => {
      await this.defiService.postChercher({id_defi:rep.defi,id_mc:element.id_mc})
    });
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
