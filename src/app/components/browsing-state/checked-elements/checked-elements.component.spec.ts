import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckedElementsComponent } from './checked-elements.component';

describe('CheckedElementsComponent', () => {
  let component: CheckedElementsComponent;
  let fixture: ComponentFixture<CheckedElementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckedElementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckedElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
