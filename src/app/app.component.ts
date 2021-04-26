import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OSM_TILE_LAYER_URL } from '@yaga/leaflet-ng2';
import { UtilisateurService } from './utilisateur.service';
import { DefiService } from './defi.service';
import { Observable } from 'rxjs';
import { Chami, Defi, User } from "./AllDefinitions";
import firebase from 'firebase/app';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
  defi_edited : Defi | null = null;

  constructor(private UserService: UtilisateurService,private defiService: DefiService) {
    this.recupUser();
    this.recupDefi();
    this.recupDefiUnUser();
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

  editedModeForDefi(defi:Defi) {
    this.defi_edited = defi;
  }

  async updateDefi(defiSaisiedefi:string, defiSaisietitre: string, defiSaisiedateDeCreation: string, defiSaisiedescription: string, defiSaisieauteur: string, defiSaisiecode_arret: string, defiSaisietype :string, defiSaisieversion: string, defiSaisiearret: string, defiSaisiepoints: string, defiSaisieduree: string, defiSaisieprologue: string, defiSaisieepilogue: string, defiSaisiecommentaire: string) {
  const dateObject = new Date(new Date().getTime())
    let d : Defi = {
      defi:defiSaisiedefi,
      titre:defiSaisietitre.replace("'","''"),
      dateDeCreation:defiSaisiedateDeCreation,
      description:defiSaisiedescription.replace("'","''"),
      auteur:defiSaisieauteur,
      code_arret:defiSaisiecode_arret,
      type: defiSaisietype,
      dateDeModification: dateObject.toLocaleString(),
      version: +defiSaisieversion,
      arret: defiSaisiearret.replace("'","''"),
      points: +defiSaisiepoints,
      duree: defiSaisieduree.replace("'","''"),
      prologue: defiSaisieprologue.replace("'","''"),
      epilogue: defiSaisieepilogue.replace("'","''"),
      commentaire: defiSaisiecommentaire.replace("'","''")
    }
    console.log("modification defi"+d.defi);
    await this.defiService.putDefi(d);
    this.defi_edited = null;
    this.recupDefiUnUser();
  }

  async deleteDefi(d:Defi) {
    await this.defiService.deleteDefi(d);
    this.defi_edited = null;
    this.recupDefiUnUser();
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
