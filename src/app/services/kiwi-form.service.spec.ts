import { TestBed } from '@angular/core/testing';

import { KiwiFormService } from './kiwi-form.service';

describe('KiwiFormService', () => {
  let service: KiwiFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KiwiFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
