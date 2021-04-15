import { element } from 'protractor';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OSM_TILE_LAYER_URL } from '@yaga/leaflet-ng2';
export type MenuSelected  = 'menuConnect' | 'menuDisconnect';
import {UtilisateurService} from './utilisateur.service';
import {ChallengeService} from './challenge.service';
import { Observable } from 'rxjs';
import { Chami, Challenge, User } from "./AllDefinitions";
import firebase from 'firebase/app';
import * as GeoJSON from 'geojson';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent {
  lignes:GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString, any>[] = [];
  dataIconGoogle = 'assets/images/iconGoogle.png';
  iconMarker = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Map_marker.svg/585px-Map_marker.svg.png';
  tileLayerUrl = OSM_TILE_LAYER_URL;
  public menuSelected!: MenuSelected;

  constructor(private UserService: UtilisateurService, private ChallengeService: ChallengeService) {
    this.recupUser();
    this.recupDefi();
    this.recupDefiUnUser()
    //this.getlignes();
    this.tstgetlignes();
    //this.testcolor();
  }

  get obsChamis(): Observable<Chami[]> {
    return this.UserService.chamisObs;
  }

  get obsChallenges(): Observable<Challenge[]> {
    return this.ChallengeService.obsAllChall;
  }

  get obsChallUser(): Observable<Challenge[]> {
    return this.ChallengeService.obsChallUser;
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
    this.ChallengeService.getAllChallenge();
  }

  recupDefiUnUser() {
    if(this.UserService.userObs !== undefined) {
      //this.ChallengeService.getAllChallengeOfAnUsers(this.UserService.userObs.chami);
    }
  }

  createUserV2(name:string,a:string) {
    console.log(name,a);
    this.UserService.postUser({
      pseudo: name,
      age: +a,
      ville:'',
      description:'',
      email:''
    })
  }

  updateUser(age:string,ville:string,description:string,mail:string) {
      this.UserService.putUser({
        pseudo: mail,
        age: +age,
        ville: ville,
        description:description,
        email:mail
      })
  }

  get tst(): Observable<Chami> {
    return this.UserService.newRegisteredChamiObs;
  }
  tstv2() {
    this.UserService.tst();
  }

  async tstgetlignes(){
    const response = await fetch('https://data.mobilites-m.fr/api/lines/json?types=ligne&reseaux=SEM');
    const data = await response.json();
    const test = JSON.stringify(data)
    const test20 = JSON.parse(test)
    this.lignes = test20.features
    console.log(this.lignes[0].properties.COULEUR)
    console.log(test20)
    console.log(this.rgbToHex(this.lignes[0].properties.COULEUR));
  }

  testcolor(i: number):string|undefined {
    console.log(this.lignes[i].properties.COULEUR)
    console.log(this.rgbToHex(this.lignes[i].properties.COULEUR))
    return this.rgbToHex(this.lignes[i].properties.COULEUR)
  }

  componentToHex(c:number) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  rgbToHex(str :string) {
    let splitted = str.split(",", 3);
    let r:number = +splitted[0]
    let g:number = +splitted[1]
    let b:number = +splitted[2]
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b)+"";
  }

}
