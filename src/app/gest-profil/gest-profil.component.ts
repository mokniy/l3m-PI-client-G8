import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { escape_quote, User } from '../AllDefinitions';
import { UtilisateurService } from '../utilisateur.service';

@Component({
  selector: 'app-gest-profil',
  templateUrl: './gest-profil.component.html',
  styleUrls: ['./gest-profil.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GestProfilComponent implements OnInit {

  constructor(private UserService: UtilisateurService) { }

  @Input() userRecu !: User;

  ngOnInit() {
  }

  get obsUsed(): Observable<boolean> {
    return this.UserService.alReadyUseSubjObs;
  }

  async updateUser(age: string, ville: string, description: string, mail: string,pseudo: string) {
    await this.UserService.putUser({
      pseudo: escape_quote(pseudo),
      age: +age,
      ville: escape_quote(ville),
      description: escape_quote(description),
      email: mail
    });
  }
}
