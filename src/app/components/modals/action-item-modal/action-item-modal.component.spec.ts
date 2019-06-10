import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionItemModalComponent } from './action-item-modal.component';

describe('AddCommentsModalComponent', () => {
  let component: ActionItemModalComponent;
  let fixture: ComponentFixture<ActionItemModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionItemModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
