/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DefiService } from './defi.service';

describe('Service: Defi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DefiService]
    });
  });

  it('should ...', inject([DefiService], (service: DefiService) => {
    expect(service).toBeTruthy();
  }));
});
