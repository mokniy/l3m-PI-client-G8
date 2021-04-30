import { MapService } from './../map.service';
import { DefiService } from './../defi.service';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AffichageDefi, Defi, MotClef, Arret } from '../AllDefinitions';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-fiche-defi',
  templateUrl: './fiche-defi.component.html',
  styleUrls: ['./fiche-defi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Pour minimiser les rendus et les évaluations
})
export class FicheDefiComponent implements OnInit {
  //avec le constructeur ca se declenchais qu'une fois non , ça s'abonnait bien
  // ça se déclanchait du coup à chaque fois
  // MAIS
  // la vue n'était pas synchro avec un observable
  // Angular tâtonnait un peu pour savoir quand il fallait la rafraichir
  // Comme on avait des appels asynchrone (avec des promesses), il ne s'en sortait pas vraiment
  // Dans un cas comme ça (appels asynchrones) il faut effectivement passer par un observable pour gérer la vue
  //ok tres bien on a le modéle au moin si on est amené à devoir faire la même on va bien le regarder maintenant
  // Oui, pour vos composants :
  //   1) Si possible, un composant "pur" juste avec des @Input
  //   2) Si besoin de récupérer des données asynchrone (Promesses ou Observable) dans le composant, sans pouvoir passer par les @Input
  //      alors faire une synchro de la vue avec un observable
  //Ok tres bien je garde ces notes de côte merci
  private _defi: Defi | null = null;
  @Input() // On passe par un attribut calculé pour pouvoir déclancher les calculs
  get defi(): Defi | null {return this._defi;}
  set defi(leDefi: Defi | null) {
    this._defi = leDefi;
    if (leDefi) {
      const P = Promise.all([this.recupArret(leDefi.code_arret), this.recupMotClef(leDefi.defi)]);
      P.then( ([lArret, lesMotsClefs]) => this.defiSubj.next({leDefi, lArret, lesMotsClefs}) );
    } else {
      this.defiSubj.next(null);
    }
  }

  private defiSubj = new Subject<AffichageDefi | null>();
  readonly affichageDuDefi: Observable<AffichageDefi | null> = this.defiSubj.asObservable();

  constructor(private defiService : DefiService, private mapService : MapService) {
  }

  ngOnInit() {
  }

  /*get obsDefiAffiche(): Observable<Defi> {
    return this.mapService.obsDefiAffiche;
  }*/

  private async recupMotClef(id_defi:string):Promise<MotClef[]>{
    const lesMotsClefs = await this.defiService.recupererMotClefUnDefi(id_defi);
    return lesMotsClefs
  }

  private async recupArret(code_arret:string):Promise<Arret>{
    const arret = await this.mapService.recupUnArret(code_arret);
    return arret
  }

}
