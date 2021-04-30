import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
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
  private DefisOfAnArret = new BehaviorSubject<Defi[]>([]);
  readonly obsChallArret = this.DefisOfAnArret.asObservable();

  //////////TAB AFFICHAGE DEFI PTS
async getAllDefiOfAnArret(unArret:ArretMap){
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/arret/defi/'+unArret.info_arret.properties.CODE);
  const data = await response.json();
  console.log(data)
  this.DefisOfAnArret.next( data as Defi[] );
}

closeDefi():void {
  this.DefisOfAnArret.next([]);
  this.stopAffDefi();
}

////////////////////RECUPERATION ARRET AVEC UN LIBELLE DANS BDD
private ArretForALibelleInBDD = new Subject<GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString, any>[]>();
readonly obsArretInBDD = this.ArretForALibelleInBDD.asObservable();

async recupWithLibelleInBDD(s: string):Promise<boolean> {
  //PRESENT BDD
  const responseBDD = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/arret/');
  const dataAPISpringBoot = await responseBDD.json();
  const tabOfAllArret: Arret[] = dataAPISpringBoot as Arret[];

  //RECUPERE INTO API MOBILITE
  const responseAPI = await fetch('https://data.mobilites-m.fr/api/findType/json?types=arret&query='+s);
  const data:GeoJSON.FeatureCollection<GeoJSON.LineString | GeoJSON.MultiLineString, any> = await responseAPI.json();
  const regexp = new RegExp('SEM_*')
  let tmp = data.features.filter(elt => regexp.test(elt.properties.CODE) && tabOfAllArret.find(newElt => newElt.code === elt.properties.CODE))
  console.log("RES RECUP BDD => "+tmp)
  this.ArretForALibelleInBDD.next(tmp);
  if(tmp.length===0) {
    return true;
  } else {
    return false;
  }
}

closeChoiceArretInBDD():void {
  this.ArretForALibelleInBDD.next([])
}

////////////////////RECUPERATION ARRET AVEC UN LIBELLE PAS DANS BDD

private ArretForALibelleInAPI = new Subject<GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString, any>[]>();
readonly obsArretInAPI = this.ArretForALibelleInAPI.asObservable();

async recupWithLibelleNotInBDD(s: string) {
  //PRESENT BDD
  const responseBDD = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/arret/');
  const dataAPISpringBoot = await responseBDD.json();
  const tabOfAllArret: Arret[] = dataAPISpringBoot as Arret[];

  //RECUPERE INTO API MOBILITE
  console.log(s)
  const responseAPI = await fetch('https://data.mobilites-m.fr/api/findType/json?types=arret&query='+s);
  const data:GeoJSON.FeatureCollection<GeoJSON.LineString | GeoJSON.MultiLineString, any> = await responseAPI.json();
  const regexp = new RegExp('SEM_*')
  let tmp = data.features.filter(elt => regexp.test(elt.properties.CODE) && tabOfAllArret.find(newElt => newElt.code === elt.properties.CODE)===undefined)
  this.ArretForALibelleInAPI.next(tmp);
}

closeChoiceArretInAPI():void {
  this.ArretForALibelleInAPI.next([])
}
///////////////////CREATION ARRET

async postArret(arret: Arret): Promise<Defi> {
  console.log(JSON.parse(JSON.stringify(arret)))
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/arret/"+arret.code,
  {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(arret)
  });
  return res.json();
}

/////////MODIFICATION ARRET

async putArret(arret: Arret): Promise<Arret> {
  console.log(JSON.stringify(arret));
  console.log(arret.code);
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/arret/"+arret.code,
  {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(arret)
  });
  console.log("Update ARRET réalisé: "+ res)
  return res.json();
}

/////////RECUPERATION UN ARRET

async recupUnArret(code_arret: string): Promise<Arret> {
  console.log(code_arret);
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/arret/"+code_arret);
  console.log(res.json);
  return res.json();
}

/////////////////////////////////////////FICHE

private defiAfficheSubj = new Subject<Defi>();
readonly obsDefiAffiche = this.defiAfficheSubj.asObservable();

newDefiAffiche(d:Defi) {
  this.defiAfficheSubj.next(d)
}

stopAffDefi() {
  this.defiAfficheSubj.next(undefined)
}
}
