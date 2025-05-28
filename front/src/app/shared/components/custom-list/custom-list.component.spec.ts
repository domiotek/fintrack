import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomListComponent } from './custom-list.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('CustomListComponent', () => {
  let component: CustomListComponent;
  let fixture: ComponentFixture<CustomListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [CustomListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomListComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('items', [{ id: 1, name: 'Item 1' }]);

    fixture.componentRef.setInput('itemTemplate', null);

    fixture.componentRef.setInput('isSelectable', true);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
