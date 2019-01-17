import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKudosModalComponent } from './add-kudos.component';

describe('AddKudosModalComponent', () => {
  let component: AddKudosModalComponent;
  let fixture: ComponentFixture<AddKudosModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddKudosModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddKudosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
