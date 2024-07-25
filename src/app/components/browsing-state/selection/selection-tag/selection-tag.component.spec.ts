import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionTagComponent } from './selection-tag.component';

describe('SelectionTagComponent', () => {
  let component: SelectionTagComponent;
  let fixture: ComponentFixture<SelectionTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectionTagComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectionTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
