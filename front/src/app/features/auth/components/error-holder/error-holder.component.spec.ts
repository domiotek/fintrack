import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorHolderComponent } from './error-holder.component';

describe('ErrorHolderComponent', () => {
  let component: ErrorHolderComponent;
  let fixture: ComponentFixture<ErrorHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorHolderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
