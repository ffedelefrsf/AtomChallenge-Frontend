import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditTaskComponent } from './create-or-edit-task.component';

describe('CreateOrEditTaskComponent', () => {
  let component: CreateOrEditTaskComponent;
  let fixture: ComponentFixture<CreateOrEditTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateOrEditTaskComponent]
    });
    fixture = TestBed.createComponent(CreateOrEditTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
