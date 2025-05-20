import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertPanelComponent } from './alert-panel.component';

describe('ErrorHolderComponent', () => {
  let component: AlertPanelComponent;
  let fixture: ComponentFixture<AlertPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
