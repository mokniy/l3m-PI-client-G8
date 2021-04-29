import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Defi, Visite } from '../AllDefinitions';
import { VisiteService } from '../visite.service';

@Component({
  selector: 'app-new-visite',
  templateUrl: './new-visite.component.html',
  styleUrls: ['./new-visite.component.scss']
})
export class NewVisiteComponent implements OnInit {

  @Input() defiRecu !: string;

  constructor(private visiteService: VisiteService) {
  }

  ngOnInit() {
    console.log("recu"+this.defiRecu)
    this.tstVisite();
  }

  get obsVisite(): Observable<Visite | undefined> {
    return this.visiteService.obsVisiteEnCour;
  }

  tstVisite() {
    this.visiteService.newVisite(this.defiRecu);
  }
}
