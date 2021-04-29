/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VisiteService } from './visite.service';

describe('Service: Visite', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VisiteService]
    });
  });

  it('should ...', inject([VisiteService], (service: VisiteService) => {
    expect(service).toBeTruthy();
  }));
});
