import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmileyRatingComponent } from './smiley-rating.component';

describe('SmileyRatingComponent', () => {
  let component: SmileyRatingComponent;
  let fixture: ComponentFixture<SmileyRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmileyRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmileyRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
