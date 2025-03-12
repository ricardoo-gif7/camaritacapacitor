import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { enableProdMode } from '@angular/core';
import { environment } from './app/environment';

defineCustomElements(window);

if (environment.production) {
  enableProdMode();
  }
bootstrapApplication(AppComponent, {
  providers: [provideIonicAngular({})]
})
  .catch(err => console.error(err));
