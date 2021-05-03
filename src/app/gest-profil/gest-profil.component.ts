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

  constructor(private userService: UtilisateurService) {
    this.userService.resetUsedObs();
  }

  @Input() userRecu !: User;

  ngOnInit() {
  }

  get obsUsed(): Observable<boolean> {
    return this.userService.alReadyUseSubjObs;
  }

  async updateUser(age: string, ville: string, description: string, mail: string,pseudo: string) {
    await this.userService.putUser({
      pseudo: escape_quote(pseudo).trim(),
      age: +age,
      ville: escape_quote(ville),
      description: escape_quote(description),
      email: mail
    },this.userRecu);
  }
}
