import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavItemComponent } from './nav-item.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('NavItemComponent', () => {
  let component: NavItemComponent;
  let fixture: ComponentFixture<NavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshow: {},
          },
        },
      ],
      imports: [NavItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavItemComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('item', {
      icon: 'home',
      title: 'Home',
      route: '/home',
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
