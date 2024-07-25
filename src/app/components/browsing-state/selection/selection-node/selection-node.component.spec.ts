import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionNodeComponent } from './selection-node.component';

describe('SelectionNodeComponent', () => {
  let component: SelectionNodeComponent;
  let fixture: ComponentFixture<SelectionNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectionNodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectionNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
