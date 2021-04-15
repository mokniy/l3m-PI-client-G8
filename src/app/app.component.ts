import { element } from 'protractor';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OSM_TILE_LAYER_URL } from '@yaga/leaflet-ng2';
export type MenuSelected  = 'menuConnect' | 'menuDisconnect';
import {UtilisateurService} from './utilisateur.service';
import {ChallengeService} from './challenge.service';
import { Observable } from 'rxjs';
import { Chami, Challenge, User } from "./AllDefinitions";
import firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  dataIconGoogle = 'assets/images/iconGoogle.png';
  iconMarker = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Map_marker.svg/585px-Map_marker.svg.png';
  tileLayerUrl = OSM_TILE_LAYER_URL;
  public menuSelected!: MenuSelected;

  constructor(private UserService: UtilisateurService, private ChallengeService: ChallengeService) {
    this.recupUser();
    this.recupDefi();
    this.recupDefiUnUser()
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
}


