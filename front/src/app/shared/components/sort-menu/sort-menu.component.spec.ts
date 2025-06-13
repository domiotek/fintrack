import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortMenuComponent } from './sort-menu.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('SortMenuComponent', () => {
  let component: SortMenuComponent;
  let fixture: ComponentFixture<SortMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [SortMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SortMenuComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('options', [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ]);

    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display sort options', () => {
    expect(component.options().length).toBe(2);
    expect(component.options()[0].label).toBe('Option 1');
    expect(component.options()[1].label).toBe('Option 2');
  });

  it('should have default state', () => {
    expect(component.state().value).toBe('name');
    expect(component.state().direction).toBe('ASC');
  });

  it('should initialize local state with current state', () => {
    expect(component.localState().value).toBe(component.state().value);
    expect(component.localState().direction).toBe(component.state().direction);
  });

  it('should emit sort change when state changes', () => {
    spyOn(component.sortChange, 'emit');

    // Change local state
    component.localState.set({ value: 'option1', direction: 'DESC' });

    component.onSortChange();

    expect(component.sortChange.emit).toHaveBeenCalledWith({
      value: 'option1',
      direction: 'DESC',
    });
  });

  it('should not emit when state has not changed', () => {
    spyOn(component.sortChange, 'emit');

    // Keep same state
    component.localState.set({ ...component.state() });

    component.onSortChange();

    expect(component.sortChange.emit).not.toHaveBeenCalled();
  });

  it('should reset local state on menu closed', () => {
    // Change local state
    component.localState.set({ value: 'option1', direction: 'DESC' });

    component.onMenuClosed();

    expect(component.localState().value).toBe(component.state().value);
    expect(component.localState().direction).toBe(component.state().direction);
  });

  it('should change direction to ASC', () => {
    const event = new MouseEvent('click');
    spyOn(event, 'stopImmediatePropagation');
    spyOn(event, 'preventDefault');
    spyOn(event, 'stopPropagation');

    component.changeDirection(event, true);

    expect(component.localState().direction).toBe('ASC');
    expect(event.stopImmediatePropagation).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should change direction to DESC', () => {
    const event = new MouseEvent('click');

    component.changeDirection(event, false);

    expect(component.localState().direction).toBe('DESC');
  });

  it('should accept different options', () => {
    const newOptions = [
      { label: 'Name', value: 'name' },
      { label: 'Date', value: 'date' },
      { label: 'Amount', value: 'amount' },
    ];

    fixture.componentRef.setInput('options', newOptions);

    expect(component.options().length).toBe(3);
    expect(component.options()[2].label).toBe('Amount');
    expect(component.options()[2].value).toBe('amount');
  });
});
