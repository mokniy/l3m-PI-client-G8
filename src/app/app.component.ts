import { element } from 'protractor';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OSM_TILE_LAYER_URL } from '@yaga/leaflet-ng2';
export type MenuSelected  = 'menuConnect' | 'menuDisconnect';
import {UtilisateurService} from './utilisateur.service';
import {ChallengeService} from './challenge.service';
import { Observable } from 'rxjs';
import { UserJSON, ChallengeJSON } from "./AllDefinitions";
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
  }

  get obsUsers(): Observable<UserJSON[]> {
    return this.UserService.observable;
  }

  get obsChallenges(): Observable<ChallengeJSON[]> {
    return this.ChallengeService.observable;
  }

  get obsLogin(): Observable<firebase.User | null> {
    return this.UserService.auth.user;
  }

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

  createUser(a:string) {
    this.UserService.postUser({
      login: "test",
      age: +a
    })
  }


}


