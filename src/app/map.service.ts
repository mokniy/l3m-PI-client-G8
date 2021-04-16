import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Arret, rgbToHex } from './AllDefinitions';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private arretsSubj = new BehaviorSubject<GeoJSON.Feature<GeoJSON.Point,any>[]>( [] );
  readonly arretsObs = this.arretsSubj.asObservable();


  private lignesSubj = new BehaviorSubject<GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString,any>[]>( [] );
  readonly lignesObs = this.lignesSubj.asObservable();


  lignes: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString,any>[] = [];
  arrets: GeoJSON.Feature<GeoJSON.Point,any>[] = [];

constructor() {
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
    this.arretsSubj.next(this.arrets)
}

async recupArretAvecDefiAPIMobi(lib: string) {
  const response = await fetch(
    'https://data.mobilites-m.fr/api/findType/json?types=arret&query='+lib
    );
  const data = await response.json();
  const test = JSON.stringify(data);
  const test20 = JSON.parse(test);
  console.log(data)
  this.arrets.push(test20.features[0])
}

displayDefi(i: number) {
  console.log("METHODE DISPLAY DEFI "+this.arrets[i].properties.CODE)
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
