import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageProfilComponent } from './page/page-profil/page-profil.component'
import { PageNewdefiComponent } from './page/page-newdefi/page-newdefi.component'
import { PageCommunauteComponent } from './page/page-communaute/page-communaute.component'
import { PageAccueilComponent } from './page/page-accueil/page-accueil.component'
import { PageJeuComponent } from './page/page-jeu/page-jeu.component'
import { PageAssistantComponent } from './page/page-assistant/page-assistant.component'

const routes: Routes = [{path: 'gestion_profil', component: PageProfilComponent},
{path: 'creer_defi', component: PageNewdefiComponent},
{path: 'communaute', component: PageCommunauteComponent},
{path: 'accueil', component: PageAccueilComponent},
{path: 'jouer', component: PageJeuComponent},
{path: 'assistant', component: PageAssistantComponent},
{ path: '',   redirectTo: '/accueil', pathMatch: 'full' }]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
