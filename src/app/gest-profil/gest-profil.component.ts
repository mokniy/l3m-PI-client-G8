import { Component, Input, OnInit } from '@angular/core';
import { User } from '../AllDefinitions';
import { UtilisateurService } from '../utilisateur.service';

@Component({
  selector: 'app-gest-profil',
  templateUrl: './gest-profil.component.html',
  styleUrls: ['./gest-profil.component.scss']
})
export class GestProfilComponent implements OnInit {

  constructor(private UserService: UtilisateurService) { }

  @Input() userRecu !: User;

  ngOnInit() {
  }

  updateUser(age: string, ville: string, description: string, mail: string) {
    this.UserService.putUser({
      pseudo: mail,
      age: +age,
      ville: ville.replace("'","''"),
      description: description.trim().replace("'","''"),
      email: mail,
    });
  }
}
