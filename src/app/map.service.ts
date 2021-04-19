import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Arret, rgbToHex, ArretMap, Defi } from './AllDefinitions';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private arretsSubj = new Subject<ArretMap[]>();
  readonly arretsObs = this.arretsSubj.asObservable();

  private lignesSubj = new Subject<GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString, any>[]>();
  readonly lignesObs = this.lignesSubj.asObservable();

  lignes: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString,any>[] = [];
  arrets: ArretMap[] = [];

  constructor() {
    this.recupAllLinesSEMITAG();
    this.recupArretAvecDefiAPIPerso();
  }

  ///////////////////////////////////////////ARRET///////////////////////////////////////////
  async recupArretAvecDefiAPIPerso() {
    const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/arret/defi');
    const dataAPISpringBoot = await response.json();
    const tabOfAllArret: Arret[] = dataAPISpringBoot as Arret[];
    const L = await Promise.all(
      tabOfAllArret.map(x =>this.recupArretAvecDefiAPIMobi(x.lib_arret))
    );
    this.arretsSubj.next(L)
    this.arrets = L;
  }

  async recupArretAvecDefiAPIMobi(lib: string) : Promise<ArretMap>{
    const response = await fetch('https://data.mobilites-m.fr/api/findType/json?types=arret&query=' + lib);
    const data = await response.json();
    const dataString = JSON.stringify(data);
    const dataJSON = await JSON.parse(dataString);
    ////FIN RECUPERATION DU POINT SUR API MOBILITE////

    const responseAPIPerso = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/arret/nb_defi/' + dataJSON.features[0].properties.CODE);
    let nombre_defi = await responseAPIPerso.text();
    ///FIN RECUPERATION DU NB DE DEFI POUR UN ARRET///

    return {
      nb_defi: +nombre_defi,
      info_arret: dataJSON.features[0]
    }
  }

  displayDefi(i: number) {
    console.log(
      'METHODE DISPLAY DEFI ' + this.arrets[i].info_arret.properties.CODE
    );
    this.getAllDefiOfAnArret(this.arrets[i])
  }

  ///////////////////////////////////////////LIGNE///////////////////////////////////////////
  async recupAllLinesSEMITAG() {
    const response = await fetch(
      'https://data.mobilites-m.fr/api/lines/json?types=ligne&reseaux=SEM'
    );
    const data = await response.json();
    const test = JSON.stringify(data);
    const test20 = JSON.parse(test);
    this.lignes = test20.features;
    this.lignesSubj.next(this.lignes);
  }

  colorationLines(i: number): string | undefined {
    return rgbToHex(this.lignes[i].properties.COULEUR);
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////TAB AFFICHAGE DEFI PTS
  private DefisOfAnArret = new Subject<Defi[]>();
  readonly obsChallArret = this.DefisOfAnArret.asObservable();

  //////////TAB AFFICHAGE DEFI PTS
  /////////METHODE PR PUBLIER NEXT [] et stopper affichage
async getAllDefiOfAnArret(unArret:ArretMap){
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/arret/defi/'+unArret.info_arret.properties.CODE);
  const data = await response.json();
  console.log(data)
  this.DefisOfAnArret.next( data as Defi[] );
}
}
