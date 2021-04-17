import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Arret, rgbToHex, ArretMap} from './AllDefinitions';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private arretsSubj = new BehaviorSubject<ArretMap[]>( [] );
  readonly arretsObs = this.arretsSubj.asObservable();


  private lignesSubj = new BehaviorSubject<GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString,any>[]>( [] );
  readonly lignesObs = this.lignesSubj.asObservable();

  /*
  private arretsSubj = new BehaviorSubject<GeoJSON.Feature<GeoJSON.Point,any>[]>( [] );
  readonly arretsObs = this.arretsSubj.asObservable();
*/

  lignes: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString,any>[] = [];
  arrets: ArretMap[] = [];

constructor() {
  //this.recupArretAvecDefiAPIPerso()
  this.recupArretAvecDefiAPIPerso()
  this.recupAllLinesSEMITAG()
}

///////////////////////////////////////////ARRET///////////////////////////////////////////


async recupArretAvecDefiAPIPerso() {

  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/arret/defi')
  const dataAPISpringBoot = await response.json();

  const tabOfAllArret:Arret[] = dataAPISpringBoot as Arret[]
  tabOfAllArret.map(
    x => {
       this.recupArretAvecDefiAPIMobi(x.lib_arret)
    })
    console.log("avant next"+this.arrets)
    this.arretsSubj.next(this.arrets)
}

async recupArretAvecDefiAPIMobi(lib: string) {
  const response = await fetch(
    'https://data.mobilites-m.fr/api/findType/json?types=arret&query='+lib
    );
  const data = await response.json();
  const test = JSON.stringify(data);
  const test20 = JSON.parse(test);
  ////FIN RECUPERATION DU POINT SUR API MOBILITE////
  console.log(data)

  //console.log("arret :::::::::::: "+test20.features[0].properties.CODE)
  const responseAPIPerso = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/arret/nb_defi/'+test20.features[0].properties.CODE);
  let nombre_defi = await responseAPIPerso.text()
  //console.log("nb defi "+ nombre_defi)

  ///FIN RECUPERATION DU NB DE DEFI POUR UN ARRET///

  this.arrets.push({
    nb_defi : +nombre_defi,
    info_arret :test20.features[0]
  })
}

displayDefi(i: number) {
  console.log("METHODE DISPLAY DEFI "+this.arrets[i].info_arret.properties.CODE)
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



}
