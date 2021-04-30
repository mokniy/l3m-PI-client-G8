import { current_date, VisiteTmp } from './../AllDefinitions';
import { UtilisateurService } from './../utilisateur.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NouvelleVisite, User } from '../AllDefinitions';
import { VisiteService } from '../visite.service';

@Component({
  selector: 'app-new-visite',
  templateUrl: './new-visite.component.html',
  styleUrls: ['./new-visite.component.scss']
})
export class NewVisiteComponent implements OnInit {

  constructor(private userService: UtilisateurService,private visiteService: VisiteService) {
  }

  ngOnInit() {
  }

  get obsUser(): Observable<User | undefined> {
    return this.userService.userObs;
  }

  get obsVisite(): Observable<NouvelleVisite | undefined> {
    return this.visiteService.obsVisiteEnCour;
  }

  createVisite(visiteEnCrea:NouvelleVisite,pseudo:string, comSaisie:string, staSaisie:string, modSaisie:string, temSaisie:string) {
    const visite:VisiteTmp = {
      id_defis:visiteEnCrea.leDefi.defi,
      id_visiteur:pseudo,
      pts_vis:-1,
      score_vis:-1,
      date_vis:current_date().toLocaleString(),
      temps_vis:temSaisie,
      mode_vis: modSaisie,
      statut_vis: staSaisie,
      commentaire: comSaisie
    }
    console.log(visite)
  }

}
