import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { isDevMode } from '@angular/core';

bootstrapApplication(AppComponent, appConfig).catch((err) => {
  if (isDevMode()) {
    // eslint-disable-next-line no-console
    console.error('Error during bootstrap:', err);
  }
});
