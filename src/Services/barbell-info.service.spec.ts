import { TestBed } from '@angular/core/testing';

import { BarbellInfoService } from './barbell-info.service';

describe('BarbellInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BarbellInfoService = TestBed.get(BarbellInfoService);
    expect(service).toBeTruthy();
  });
});
