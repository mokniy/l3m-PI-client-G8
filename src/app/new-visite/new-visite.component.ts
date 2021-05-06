import { current_date, VisiteTmp, ReponseTmp, Visite, Reponse, EvaluationTmp } from './../AllDefinitions';
import { UtilisateurService } from './../utilisateur.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { NouvelleVisite, User } from '../AllDefinitions';
import { VisiteService } from '../visite.service';
import { StringUtils } from 'turbocommons-ts';


@Component({
  selector: 'app-new-visite',
  templateUrl: './new-visite.component.html',
  styleUrls: ['./new-visite.component.scss']
})
export class NewVisiteComponent implements OnInit {

  @Output() Visitedone= new EventEmitter<boolean>();

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

  async createVisite(visiteEnCrea:NouvelleVisite,pseudo:string, comSaisie:string, staSaisie:string, modSaisie:string, temSaisie:string) {

    //disparition formulaire

      let ptsGagne:number = 0;
      visiteEnCrea.lesQuestions.forEach(elt => {
        if(elt.reponse) {
          if(elt.secret_qst.length >12) {
            if(StringUtils.compareByLevenshtein(elt.secret_qst.toLowerCase(), elt.reponse.toLowerCase()) <= 6) {
              ptsGagne+=elt.points_qst;
            }
          }else if(elt.secret_qst.length >6) {
            if(StringUtils.compareByLevenshtein(elt.secret_qst.toLowerCase(), elt.reponse.toLowerCase()) <= 3) {
              ptsGagne+=elt.points_qst;
            }
          } else if (elt.secret_qst.length >2) {
            if(StringUtils.compareByLevenshtein(elt.secret_qst.toLowerCase(), elt.reponse.toLowerCase()) <= 1) {
              ptsGagne+=elt.points_qst;
            }
          } else {
            if(StringUtils.compareByLevenshtein(elt.secret_qst.toLowerCase(), elt.reponse.toLowerCase()) == 0) {
              ptsGagne+=elt.points_qst;
            }
          }
        }
      })

    let ptsRetirer: number = 0;
    let ind_used: string = "";
    if(visiteEnCrea.lesIndices.length > 0) {
      visiteEnCrea.lesIndices.forEach( elt => {
        if(elt.usedInd === true) {
          ptsRetirer += elt.points_ind;
          ind_used += elt.label_ind+" "
        }
      })
    }

    let ptsResultat:number = 0;
    if(ptsRetirer>ptsGagne) {
      ptsResultat=0
    } else {
      ptsResultat = ptsGagne-ptsRetirer
    }

    const visite:VisiteTmp = {
      id_defi:visiteEnCrea.leDefi.defi,
      id_visiteur:pseudo,
      pts_vis: ptsResultat,
      score_vis: visiteEnCrea.leDefi.points,
      date_vis:current_date().toLocaleString(),
      temps_vis:temSaisie,
      mode_vis: modSaisie,
      statut_vis: staSaisie,
      commentaire: comSaisie,
      indice_utilise_vis : ind_used
    }
    const laVisiteCree: Visite = await this.visiteService.postVisite(visite)

    let reponseToUpload : ReponseTmp[]= [];
    visiteEnCrea.lesQuestions.forEach(element => {
        if(element.reponse !==undefined && element.reponse !== "") {
          reponseToUpload.push({
            reponse_rep: element.reponse,
            id_qst: element.id_qst
          })
        }
    });

    const lesReponsesCree: Reponse[] = await this.visiteService.postListReponse(reponseToUpload)

    let evalToUpload : EvaluationTmp[]= [];
    lesReponsesCree.forEach(elt => {
      evalToUpload.push({
        id_rep:elt.id_rep,
        id_vis:laVisiteCree.id_vis
      })
    })

    await this.visiteService.postListEvaluation(evalToUpload);

    this.Visitedone.emit(false);
  }

}
