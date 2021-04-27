import { DefiService } from './../defi.service';
import { Component, Input, OnInit } from '@angular/core';
import { Defi, DefiAffichage } from '../AllDefinitions';

@Component({
  selector: 'app-fiche-defi',
  templateUrl: './fiche-defi.component.html',
  styleUrls: ['./fiche-defi.component.scss']
})
export class FicheDefiComponent implements OnInit {

  public motsClefs:string="ezaeza";


  @Input() defiRecu: Defi = {
    defi: "-1",
    titre: "",
    dateDeCreation: "",
    description: "",
    auteur: "",
    code_arret: "",
    type: "",
    dateDeModification: "",
    version: -1,
    arret: "",
    points: -1,
    duree: "",
    prologue: "",
    epilogue: "",
    commentaire: ""
  }

  public defiAffiche:DefiAffichage = {
    defi:this.defiRecu,
    motsClefs:[]
  };

  constructor(private defiService : DefiService) {
  }

  ngOnInit() {
  }

  async recupMotClef() {
      this.defiAffiche.motsClefs =  await this.defiService.recupererMotClefUnDefi(this.defiRecu.defi);
  }

}
