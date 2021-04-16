import { element } from 'protractor';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OSM_TILE_LAYER_URL } from '@yaga/leaflet-ng2';
import { UtilisateurService } from './utilisateur.service';
import { DefiService } from './defi.service';
import { Observable } from 'rxjs';
import { Chami, Defi, User, rgbToHex, Arret } from "./AllDefinitions";
import firebase from 'firebase/app';
import * as GeoJSON from 'geojson';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent {
  lignes: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString,any>[] = [];
  arrets: GeoJSON.Feature<GeoJSON.Point,any>[] = [];
  dataIconGoogle = 'assets/images/iconGoogle.png';
  iconMarker ='https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Map_marker.svg/585px-Map_marker.svg.png';
  tileLayerUrl = OSM_TILE_LAYER_URL;
  defi_edited : Defi | null = null;

  constructor(private UserService: UtilisateurService,private defiService: DefiService) {
    this.recupUser();
    this.recupDefi();
    this.recupDefiUnUser();
    this.recupAllLinesSEMITAG();
    this.recupArretAvecDefiAPIPerso();
    //this.createDefi();
  }

  get obsChamis(): Observable<Chami[]> {
    return this.UserService.chamisObs;
  }

  get obsDefis(): Observable<Defi[]> {
    return this.defiService.obsAllChall;
  }

  get obsChallUser(): Observable<Defi[]> {
    return this.defiService.obsChallUser;
  }

  get obsLogin(): Observable<firebase.User | null> {
    return this.UserService.auth.user;
  }

  get obsUser(): Observable<User | undefined> {
    return this.UserService.userObs;
  }

  //get tst(): Observable<Chami | User | undefined> | undefined{
  //return this.UserService.merged;
  //}

  login() {
    this.UserService.login();
  }

  logout() {
    this.UserService.logout();
  }

  recupUser() {
    this.UserService.getAllUsers();
  }

  recupDefi() {
    this.defiService.getAllDefi();
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

  createUser(name: string, a: string, ville: string, description: string) {
    console.log(name, a);
    this.UserService.postUser({
      pseudo: name,
      age: +a,
      ville: ville,
      description: description,
      email: name,
    });
  }

  updateUser(age: string, ville: string, description: string, mail: string) {
    this.UserService.putUser({
      pseudo: mail,
      age: +age,
      ville: ville,
      description: description,
      email: mail,
    });
  }

  get tst(): Observable<Chami> {
    return this.UserService.newRegisteredChamiObs;
  }
  tstv2() {
    this.UserService.tst();
  }

  editedModeForDefi(defi:Defi) {
    this.defi_edited = defi;
  }

  updateDefi(defi:Defi) {
    console.log("modification defi"+defi.defi);
    this.defiService.putDefi(defi);
    this.defi_edited = null;
  }

  ////////////////////AFFICHAGE LIGNE
  async recupAllLinesSEMITAG() {
    const response = await fetch(
      'https://data.mobilites-m.fr/api/lines/json?types=ligne&reseaux=SEM'
    );
    const data = await response.json();
    const test = JSON.stringify(data);
    const test20 = JSON.parse(test);
    this.lignes = test20.features;
    //console.log(this.lignes[0].properties.COULEUR);
    //console.log(test20);
    //console.log(rgbToHex(this.lignes[0].properties.COULEUR));
  }

  colorationLines(i: number): string | undefined {
    return rgbToHex(this.lignes[i].properties.COULEUR);
  }
  ////////////////////FIN AFFICHAGE LIGNE

  //CREER METHODE QUI POUR CHAQUE ARRET UTILISE DANS UN DEFI LE FAIT APPARAITE SUR LA CARTE
  //@TODO
  async recupArretAvecDefiAPIPerso() {
    const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/arret/defi')
    const dataAPISpringBoot = await response.json();
    const tabOfAllArret:Arret[] = dataAPISpringBoot as Arret[]
    tabOfAllArret.map(
      x => {
        //console.log(x.arret),
        this.recupArretAvecDefiAPIMobi(x.lib_arret)
      })
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

  createDefi() {
    let d : Defi = {
      defi:'teeest',
      titre:'LE defi TEST',
      dateDeCreation:'',
      description:'letest',
      auteur:'briancon.guillaume8@gmail.com',
      code_arret:'SEM_GENCHAVANT',
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
    this.defiService.postDefi(d);
  }





}
