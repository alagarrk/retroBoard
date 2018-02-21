import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommentsModalComponent } from './add-comments-modal.component';

describe('AddCommentsModalComponent', () => {
  let component: AddCommentsModalComponent;
  let fixture: ComponentFixture<AddCommentsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCommentsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
