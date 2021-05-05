import { VisiteEvolve } from './../AllDefinitions';
import { UtilisateurService } from 'src/app/utilisateur.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-affiche-visite',
  templateUrl: './affiche-visite.component.html',
  styleUrls: ['./affiche-visite.component.scss']
})
export class AfficheVisiteComponent implements OnInit {

  constructor(private userService:UtilisateurService) {
    this.recupVisiteUnUser();
  }

  ngOnInit() {
  }

  recupVisiteUnUser() {
    this.userService.userObs.subscribe((x) => {
      if (!!x) {
        if (!!x.chami) {
          this.userService.getAllVisiteOfAnUsers(x.chami);
        }
      }
    });
  }

  get obsVisiteUser(): Observable<VisiteEvolve[]> {
    return this.userService.visiteObs;
  }

}
