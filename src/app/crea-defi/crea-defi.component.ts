import { Chami } from './../AllDefinitions';
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

  modeCreateArret(){
    this.createArret= true;
    this.createDefi=false;
    this.closeChoiceArretInBDD();
  }

  modeCreateDefi(){
    this.createDefi= true;
    this.createArret=false;
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
  async creationDefi(defiID:string,defiTitre:string, defiType : string,arretInfo:string,descriptionSaisie:string, versionSaisie: string, pointsSaisie :string, dureeSaisie: string, prologueSaisie: string, epilogueSaisie: string, commentaireSaisie:string, motClefSaisie:string) {
    const arretInfoSplited = arretInfo.trim().split(",")
    const dateObject = new Date(new Date().getTime())
    let d : Defi = {
      defi: defiID,
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
    this.createDefi=false
    this.closeChoiceArretInBDD();

    //AJOUT MOT CLEF DANS BDD
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
}
