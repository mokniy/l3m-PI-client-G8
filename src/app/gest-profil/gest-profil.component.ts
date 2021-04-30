import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { escape_quote, User } from '../AllDefinitions';
import { UtilisateurService } from '../utilisateur.service';

@Component({
  selector: 'app-gest-profil',
  templateUrl: './gest-profil.component.html',
  styleUrls: ['./gest-profil.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GestProfilComponent implements OnInit {

  public pseudoUsed = false;

  constructor(private UserService: UtilisateurService) { }

  @Input() userRecu !: User;

  ngOnInit() {
  }

  async updateUser(age: string, ville: string, description: string, mail: string,pseudo: string) {
    const res = await this.UserService.putUser({
      pseudo: pseudo,
      age: +age,
      ville: escape_quote(ville),
      description: escape_quote(description),
      email: mail
    });
    if(res === undefined) {
      this.pseudoUsed = true
      console.log("IMPOSSIBLE")
    } else {
      this.pseudoUsed = false
    }
  }
}
