import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(ReactiveFormsModule), // ReactiveFormsModule itt biztosítva
  ],
});
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(), provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};