import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HappinessScoreModalComponent } from './happiness-score-modal.component';

describe('AddCommentsModalComponent', () => {
  let component: HappinessScoreModalComponent;
  let fixture: ComponentFixture<HappinessScoreModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HappinessScoreModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HappinessScoreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
