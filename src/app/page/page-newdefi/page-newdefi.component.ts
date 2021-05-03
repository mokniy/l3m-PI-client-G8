import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../../utilisateur.service';
import { Observable } from 'rxjs';
import { User } from "../../AllDefinitions";
@Component({
  selector: 'app-page-newdefi',
  templateUrl: './page-newdefi.component.html',
  styleUrls: ['./page-newdefi.component.scss']
})
export class PageNewdefiComponent implements OnInit {

  constructor(private UserService: UtilisateurService) {
  }

  ngOnInit() {
  }

  get obsUser(): Observable<User | undefined> {
    return this.UserService.userObs;
  }
}

