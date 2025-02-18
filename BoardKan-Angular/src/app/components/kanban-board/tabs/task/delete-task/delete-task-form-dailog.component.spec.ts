import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTaskFormDailogComponent } from './delete-task-form-dailog.component';

describe('DeleteTaskFormDailogComponent', () => {
  let component: DeleteTaskFormDailogComponent;
  let fixture: ComponentFixture<DeleteTaskFormDailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteTaskFormDailogComponent]
    });
    fixture = TestBed.createComponent(DeleteTaskFormDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
