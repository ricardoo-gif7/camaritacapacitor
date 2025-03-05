import { Component } from '@angular/core';
import { CameraComponent } from './camera/camera.component';  // Ruta de tu componente independiente
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CameraComponent, IonicModule]  // Asegúrate de que CameraComponent y IonicModule estén correctamente importados
})
export class AppComponent {}
