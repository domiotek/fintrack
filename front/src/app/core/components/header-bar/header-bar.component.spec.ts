import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBarComponent } from './header-bar.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('AppHeaderBarComponent', () => {
  let component: HeaderBarComponent;
  let fixture: ComponentFixture<HeaderBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [HeaderBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderBarComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('title', 'Dashboard');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
