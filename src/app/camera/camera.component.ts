import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Necesario para directivas como *ngIf, *ngFor
import { IonicModule } from '@ionic/angular';  // Necesario para Ionic
import { CameraService } from './services/camera.service';  // Tu servicio para la cámara
import { ToastController } from '@ionic/angular';  // Para los toasts

@Component({
  selector: 'app-camera',
  standalone: true,  // Este componente es independiente
  imports: [CommonModule, IonicModule],  // Aquí se importan IonicModule y CommonModule para las directivas
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent {
  imgUrls: string[] = [];
  hoverIndex: number = -1;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private cameraService: CameraService,  // Servicio para interactuar con la cámara
    private toastController: ToastController  // Controlador de Toasts
  ) {}

  async takePicture() {
    this.errorMessage = '';
    try {
      this.loading = true;
      const imageUrl = await this.cameraService.takePicture();  // Captura la imagen
      if (!imageUrl) {
        throw new Error('No se obtuvo una imagen válida');
      }
      this.imgUrls.push(imageUrl);  // Agrega la imagen a la galería
      this.showToast('Imagen agregada');
      this.loading = false;
    } catch (error) {
      console.error('Error al capturar imagen:', error);
      this.errorMessage = String(error);
      this.imgUrls = [];
    }
  }

  async deleteImage(index: number) {
    this.imgUrls.splice(index, 1);  // Elimina la imagen seleccionada
    this.showToast('Imagen borrada');
  }

  async deleteAllPhotos() {
    this.imgUrls = [];  // Elimina todas las imágenes
    this.showToast('Galería vacía');
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
    });
    toast.present();
  }
}
