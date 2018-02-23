import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCommentsModalComponent } from './manage-comments-modal.component';

describe('AddCommentsModalComponent', () => {
  let component: ManageCommentsModalComponent;
  let fixture: ComponentFixture<ManageCommentsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCommentsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCommentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
