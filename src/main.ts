import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppComponent } from './app/app.component'; // Este es el componente raíz

platformBrowserDynamic().bootstrapModule(AppComponent)
  .catch(err => console.error(err));
