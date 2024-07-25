import { TestBed } from '@angular/core/testing';

import { SelectionFunctionsService } from './selection-functions.service';

describe('SelectionFunctionsService', () => {
  let service: SelectionFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectionFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
