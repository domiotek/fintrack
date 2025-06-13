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

  it('should accept items input', () => {
    const testItems = [{ id: 1, name: 'Test' }];
    fixture.componentRef.setInput('items', testItems);

    expect(component.items()).toEqual(testItems);
  });

  it('should have default isSelectable as false', () => {
    fixture.componentRef.setInput('isSelectable', undefined);

    expect(component.isSelectable()).toBeFalsy();
  });

  it('should accept isSelectable input', () => {
    fixture.componentRef.setInput('isSelectable', true);

    expect(component.isSelectable()).toBeTruthy();
  });

  it('should initialize with no selected item', () => {
    expect(component.selectedItem()).toBeNull();
  });

  it('should emit selectEmit when item is clicked', () => {
    spyOn(component.selectEmit, 'emit');
    const testItem = { id: 1, name: 'Test' };

    component.onItemClick(testItem);

    expect(component.selectEmit.emit).toHaveBeenCalledWith(testItem);
  });

  it('should set selected item when isSelectable is true and item is clicked', () => {
    fixture.componentRef.setInput('isSelectable', true);
    const testItem = { id: 1, name: 'Test' };

    component.onItemClick(testItem);

    expect(component.selectedItem()).toEqual(testItem);
  });

  it('should not set selected item when isSelectable is false', () => {
    fixture.componentRef.setInput('isSelectable', false);
    const testItem = { id: 1, name: 'Test' };

    component.onItemClick(testItem);

    expect(component.selectedItem()).toBeNull();
  });
});
