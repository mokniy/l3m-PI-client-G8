import { MapService } from './../map.service';
import { DefiService } from './../defi.service';
import { Component, Input, OnInit } from '@angular/core';
import { AffichageDefi, Defi, MotClef, Arret } from '../AllDefinitions';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-fiche-defi',
  templateUrl: './fiche-defi.component.html',
  styleUrls: ['./fiche-defi.component.scss']
})
export class FicheDefiComponent implements OnInit {


  private defiAfficheSubj = new Subject<AffichageDefi>();
  readonly defiAfficheObs = this.defiAfficheSubj.asObservable();

  private affichageDuDefi!:AffichageDefi

  @Input() defiRecu !: Defi;

  constructor(private defiService : DefiService, private mapService : MapService) {
  }

  ngOnInit() {
    this.initFiche()
  }

  async recupMotClef():Promise<MotClef[]>{
    const lesMotsClefs = await this.defiService.recupererMotClefUnDefi(this.defiRecu.defi);
    return lesMotsClefs
  }

  async recupArret():Promise<Arret>{
    const arret = await this.mapService.recupUnArret(this.defiRecu.code_arret);
    return arret
  }

  async initFiche() {
    const arret = await this.recupArret()
    const motClef = await this.recupMotClef()
    this.affichageDuDefi = {
      lArret : arret,
      leDefi : this.defiRecu,
      lesMotsClefs : motClef
    }
    this.defiAfficheSubj.next(this.affichageDuDefi);
  }
}
