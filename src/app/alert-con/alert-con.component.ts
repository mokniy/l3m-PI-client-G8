import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { escape_quote, User } from '../AllDefinitions';
import { UtilisateurService } from '../utilisateur.service';

@Component({
  selector: 'app-alert-con',
  templateUrl: './alert-con.component.html',
  styleUrls: ['./alert-con.component.scss']
})
export class AlertConComponent implements OnInit {

  constructor(private UserService: UtilisateurService) { }

  @Input() userRecu !: User;

  ngOnInit() {
  }

  get obsUsed(): Observable<boolean> {
    return this.UserService.alReadyUseSubjObs;
  }

  createUser(name: string, a: string, ville: string, description: string, pseudo:string) {
    this.UserService.postUser({
      pseudo: escape_quote(pseudo).trim(),
      age: +a,
      ville: escape_quote(ville),
      description: escape_quote(description),
      email: name,
    });
  }

}
