import { UtilisateurService } from 'src/app/utilisateur.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-co-necessaire',
  templateUrl: './alert-co-necessaire.component.html',
  styleUrls: ['./alert-co-necessaire.component.scss']
})
export class AlertCoNecessaireComponent implements OnInit {

  constructor(private userService: UtilisateurService) { }

  ngOnInit() {
  }

  login() {
    this.userService.login();
  }

}
