import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetWrapperComponent } from './widget-wrapper.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { Component } from '@angular/core';
import { IWidget } from '../../../core/models/statistics/widget';
import { Subject } from 'rxjs';

@Component({
  standalone: true,
  imports: [WidgetWrapperComponent],
  template: `
    <app-widget-wrapper [header]="'Test Widget'">
      <div #widgetContent [widget]="mockWidget">Test Content</div>
    </app-widget-wrapper>
  `,
})
class TestHostComponent {
  mockWidget: IWidget = {
    onInit$: new Subject(),
    onLoad$: new Subject(),
    onRefresh$: new Subject(),
    loadData: jasmine.createSpy('loadData'),
    triggerAction: jasmine.createSpy('triggerAction'),
  };
}

describe('WidgetWrapperComponent', () => {
  let component: WidgetWrapperComponent;
  let fixture: ComponentFixture<WidgetWrapperComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetWrapperComponent, TestHostComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetWrapperComponent);
    fixture.componentRef.setInput('header', 'test header');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display header', () => {
    expect(component.header()).toBe('test header');
  });

  it('should initialize with loading state', () => {
    expect(component.loading()).toBeTruthy();
    expect(component.loadingError()).toBeFalsy();
    expect(component.refreshing()).toBeFalsy();
    expect(component.hasInteraction()).toBeFalsy();
  });

  it('should warn when widget content is not found', () => {
    spyOn(console, 'warn');

    component.ngAfterContentInit();

    expect(console.warn).toHaveBeenCalledWith(`Widget content for 'test header' not found!`);
  });
  it('should render loading spinner when loading', () => {
    component.loading.set(true);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });
});
