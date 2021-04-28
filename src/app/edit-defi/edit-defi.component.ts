import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Defi } from '../AllDefinitions';
import { DefiService } from '../defi.service';
import { UtilisateurService } from '../utilisateur.service';

@Component({
  selector: 'app-edit-defi',
  templateUrl: './edit-defi.component.html',
  styleUrls: ['./edit-defi.component.scss']
})
export class EditDefiComponent implements OnInit {
  defi_edited : Defi | null = null;

  constructor(private UserService: UtilisateurService,private defiService: DefiService) {
    this.recupDefiUnUser();
  }

  ngOnInit() {
  }

  get obsChallUser(): Observable<Defi[]> {
    return this.defiService.obsChallUser;
  }

  editedModeForDefi(defi:Defi) {
    this.defi_edited = defi;
  }

  async updateDefi(defiSaisiedefi:string, defiSaisietitre: string, defiSaisiedateDeCreation: string, defiSaisiedescription: string, defiSaisieauteur: string, defiSaisiecode_arret: string, defiSaisietype :string, defiSaisieversion: string, defiSaisiearret: string, defiSaisiepoints: string, defiSaisieduree: string, defiSaisieprologue: string, defiSaisieepilogue: string, defiSaisiecommentaire: string) {
    const dateObject = new Date(new Date().getTime())
      let d : Defi = {
        defi:defiSaisiedefi,
        titre:defiSaisietitre.replace("'","''"),
        dateDeCreation:defiSaisiedateDeCreation,
        description:defiSaisiedescription.replace("'","''"),
        auteur:defiSaisieauteur,
        code_arret:defiSaisiecode_arret,
        type: defiSaisietype,
        dateDeModification: dateObject.toLocaleString(),
        version: +defiSaisieversion,
        arret: defiSaisiearret.replace("'","''"),
        points: +defiSaisiepoints,
        duree: defiSaisieduree.replace("'","''"),
        prologue: defiSaisieprologue.replace("'","''"),
        epilogue: defiSaisieepilogue.replace("'","''"),
        commentaire: defiSaisiecommentaire.replace("'","''")
      }
      console.log("modification defi"+d.defi);
      await this.defiService.putDefi(d);
      this.defi_edited = null;
      this.recupDefiUnUser();
    }

  async deleteDefi(d:Defi) {
    await this.defiService.deleteDefi(d);
    this.defi_edited = null;
    this.recupDefiUnUser();
  }

  recupDefiUnUser() {
    this.UserService.userObs.subscribe((x) => {
      if (!!x) {
        if (!!x.chami) {
          this.defiService.getAllDefiOfAnUsers(x.chami);
        }
      }
    });
  }
}
