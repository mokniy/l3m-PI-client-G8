/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UtilisateurService } from './utilisateur.service';

describe('Service: Utilisateur', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilisateurService]
    });
  });

  it('should ...', inject([UtilisateurService], (service: UtilisateurService) => {
    expect(service).toBeTruthy();
  }));
});
