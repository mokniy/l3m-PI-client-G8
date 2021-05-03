import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UtilisateurService } from './utilisateur.service';
import { Observable } from 'rxjs';
import { User } from "./AllDefinitions";
import firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent {
  dataIconGoogle = 'assets/images/iconGoogle.png';

  constructor(private UserService: UtilisateurService) {
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
}
