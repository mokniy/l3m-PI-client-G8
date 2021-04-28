import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OSM_TILE_LAYER_URL } from '@yaga/leaflet-ng2';
import { UtilisateurService } from './utilisateur.service';
import { DefiService } from './defi.service';
import { Observable } from 'rxjs';
import { Chami, Defi, User } from "./AllDefinitions";
import firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent {
  dataIconGoogle = 'assets/images/iconGoogle.png';
  iconMarker ='https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Map_marker.svg/585px-Map_marker.svg.png';
  tileLayerUrl = OSM_TILE_LAYER_URL;

  constructor(private UserService: UtilisateurService,private defiService: DefiService) {
    this.recupUser();
    this.recupDefi();
  }

  get obsChamis(): Observable<Chami[]> {
    return this.UserService.chamisObs;
  }

  get obsDefis(): Observable<Defi[]> {
    return this.defiService.obsAllChall;
  }

  get obsLogin(): Observable<firebase.User | null> {
    return this.UserService.auth.user;
  }

  get obsUser(): Observable<User | undefined> {
    return this.UserService.userObs;
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
    this.defiService.getAllDefi();
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

  //TESTMERGE//
  get tst(): Observable<Chami> {
    return this.UserService.newRegisteredChamiObs;
  }
  tstv2() {
    this.UserService.tst();
  }

  //get tst(): Observable<Chami | User | undefined> | undefined{
  //return this.UserService.merged;
  //}

  //TESTMERGE//
}
