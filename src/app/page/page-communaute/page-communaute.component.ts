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


  get obsChamis(): Observable<Chami[]> {
    return this.userService.chamisObs;
  }

  recupUser() {
    this.userService.getAllUsers();
  }
}
