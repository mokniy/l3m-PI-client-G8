import { ChamiEvolve } from './../../AllDefinitions';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Chami } from 'src/app/AllDefinitions';
import { UtilisateurService } from 'src/app/utilisateur.service';

@Component({
  selector: 'app-page-communaute',
  templateUrl: './page-communaute.component.html',
  styleUrls: ['./page-communaute.component.scss']
})
export class PageCommunauteComponent implements OnInit {

  constructor(private userService: UtilisateurService) {
    this.recupUser();
  }

  ngOnInit() {
  }


  get obsChamis(): Observable<ChamiEvolve[]> {
    return this.userService.chamisObs;
  }

  async recupUser() {
    this.userService.getAllUsers();
  }
}
