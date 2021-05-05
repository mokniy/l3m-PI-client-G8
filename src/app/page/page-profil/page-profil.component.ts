import { Component } from '@angular/core';
import { UtilisateurService } from '../../utilisateur.service';
import { Observable } from 'rxjs';
import { User } from "../../AllDefinitions";
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-page-profil',
  templateUrl: './page-profil.component.html',
  styleUrls: ['./page-profil.component.scss']
})
export class PageProfilComponent implements OnInit {

  constructor(private UserService: UtilisateurService) {
    }

    ngOnInit(): void {
    }

  get obsUser(): Observable<User | undefined> {
    return this.UserService.userObs;
  }
}
