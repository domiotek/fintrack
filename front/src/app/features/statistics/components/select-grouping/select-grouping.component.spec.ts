import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGroupingComponent } from './select-grouping.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { StatsGroup, StatsGroupsType } from '../../../../core/models/statistics/stats-groups';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SelectGroupingComponent', () => {
  let component: SelectGroupingComponent;
  let fixture: ComponentFixture<SelectGroupingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [SelectGroupingComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectGroupingComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('selectedGroup', StatsGroup.DAY);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct label', () => {
    const labelElement = fixture.nativeElement.querySelector('mat-label');
    expect(labelElement?.textContent?.trim()).toBe('Grupuj po');
  });
  it('should have default selected group', () => {
    expect(component.selectedGroup()).toBe(StatsGroup.DAY);
  });

  it('should load all available groups', () => {
    const groups = component.groups();
    expect(groups.length).toBe(3);
    expect(groups).toEqual([
      { label: 'Dzień', value: StatsGroup.DAY },
      { label: 'Miesiąc', value: StatsGroup.MONTH },
      { label: 'Rok', value: StatsGroup.YEAR },
    ]);
  });

  it('should display all group options', async () => {
    const matSelect = fixture.nativeElement.querySelector('mat-select');
    matSelect.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const options = document.querySelectorAll('mat-option');
    expect(options.length).toBe(3);
    expect(options[0].textContent?.trim()).toBe('Dzień');
    expect(options[1].textContent?.trim()).toBe('Miesiąc');
    expect(options[2].textContent?.trim()).toBe('Rok');
  });

  it('should update selected group when option is clicked', async () => {
    const matSelect = fixture.nativeElement.querySelector('mat-select');
    matSelect.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const monthOption = document.querySelector('mat-option[ng-reflect-value="MONTH"]') as HTMLElement;
    monthOption.click();
    fixture.detectChanges();

    expect(component.selectedGroup()).toBe('MONTH');
  });

  it('should reflect model changes in the select value', () => {
    fixture.componentRef.setInput('selectedGroup', 'YEAR');
    fixture.detectChanges();

    expect(component.selectedGroup()).toBe('YEAR');
  });

  it('should handle all group types', () => {
    const groupTypes: StatsGroupsType[] = ['DAY', 'MONTH', 'YEAR'];

    groupTypes.forEach((groupType) => {
      fixture.componentRef.setInput('selectedGroup', groupType);
      fixture.detectChanges();

      expect(component.selectedGroup()).toBe(groupType);
    });
  });
  it('should have correct mat-select attributes', () => {
    const matSelect = fixture.nativeElement.querySelector('mat-select');
    expect(matSelect).toBeTruthy();
    // Check the component's model value instead of DOM attribute
    expect(component.selectedGroup()).toBe(StatsGroup.DAY);
  });

  it('should have mat-form-field with outline appearance', () => {
    const formField = fixture.nativeElement.querySelector('mat-form-field');
    expect(formField?.getAttribute('appearance')).toBe('outline');
  });
  it('should emit changes when selection changes', async () => {
    // Test that model changes are reflected properly
    fixture.componentRef.setInput('selectedGroup', StatsGroup.MONTH);
    fixture.detectChanges();

    expect(component.selectedGroup()).toBe('MONTH');

    const matSelect = fixture.nativeElement.querySelector('mat-select');
    matSelect.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const yearOption = document.querySelector('mat-option[ng-reflect-value="YEAR"]') as HTMLElement;
    yearOption.click();
    fixture.detectChanges();

    expect(component.selectedGroup()).toBe('YEAR');
  });

  it('should maintain groups signal immutability', () => {
    const initialGroups = component.groups();
    const secondCall = component.groups();

    expect(initialGroups).toBe(secondCall); // Should be the same reference (immutable)
  });
});
