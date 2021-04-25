import { Component, OnInit } from '@angular/core';
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
  constructor(private MapService : MapService, private defiService : DefiService) { }

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

  async creationDefi(defiID:string,defiTitre:string,arretInfo:string,descriptionSaisie:string) {
    const arretInfoSplited = arretInfo.trim().split(",")
    let d : Defi = {
      defi: defiID,
      titre: defiTitre.replace("'","''"),
      dateDeCreation:'',
      description:descriptionSaisie.replace("'","''"),
      auteur:'yanis.mokni@gmail.com',
      code_arret:arretInfoSplited[2].trim(),
      type: 'enigme',
      dateDeModification: '',
      version: 1,
      arret: '',
      points: 15,
      duree: '',
      prologue: '',
      epilogue: '',
      commentaire: ''
    }
    await this.defiService.postDefi(d);
    this.MapService.recupArretAvecDefiAPIPerso();
    this.createDefi=false
    this.closeChoiceArretInBDD();
  }

  creationArret(streetmap:string,arretInfo:string) {
    const arretInfoSplited = arretInfo.trim().split(",")
    let a : Arret = {
      code: arretInfoSplited[2].trim(),
      lib_arret:arretInfoSplited[1].trim().replace("'","''"),
      streetmap:streetmap
    }
    this.MapService.postArret(a)
    this.createArret=false
    this.closeChoiceArretInAPI();
  }
}
