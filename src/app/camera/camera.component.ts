import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CameraService } from './services/camera.service';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule, IonicModule],
  providers: [CameraService],
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent {
  imgUrls: string[] = [];
  hoverIndex: number | null = null;
  selectedImage: string | null = null;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private cameraService: CameraService) {}

  async takePicture() {
    this.errorMessage = '';
    try {
      this.loading = true;
      const imageUrl = await this.cameraService.takePicture();
      if (!imageUrl) {
        throw new Error('No se obtuvo una imagen válida');
      }
      this.imgUrls.push(imageUrl);
    } catch (error: any) {
      console.error('Error al capturar imagen:', error);
      
      // Manejo de errores específicos para mejorar la experiencia del usuario
      if (typeof error === 'string') {
        this.errorMessage = error;
      } else if (error.message) {
        if (error.message.includes('cancelled') || error.message.includes('User cancelled')) {
          // El usuario canceló la operación
          this.errorMessage = 'Operación cancelada por el usuario';
        } else if (error.message.includes('PWA Element')) {
          // Problema con PWA Elements
          this.errorMessage = 'Error de configuración: PWA Elements no encontrados';
        } else if (error.message.includes('camera') || error.message.includes('permission')) {
          // Problema de permisos
          this.errorMessage = 'No se pudo acceder a la cámara. Verifica los permisos';
        } else {
          // Error general
          this.errorMessage = `Error: ${error.message}`;
        }
      } else {
        this.errorMessage = 'Error desconocido al tomar la foto';
      }
    } finally {
      this.loading = false;
    }
  }
  
  deleteAllPhotos() {
    this.imgUrls = [];
  }

  ngOnInit() {
    console.log('CameraComponent loaded');
  }  

  toggleHoverIndex(index: number) {
    this.hoverIndex = this.hoverIndex === index ? null : index;
  }

  deleteImage(index: number, event: Event) {
    event.stopPropagation(); // Evita que el clic en el botón afecte al contenedor
    this.imgUrls.splice(index, 1);
    if (this.hoverIndex === index) {
      this.hoverIndex = null;
    }
  }

  openImage(index: number, event: Event) {
    event.stopPropagation(); // Evita cerrar la imagen cuando se hace clic en el botón
    this.selectedImage = this.imgUrls[index];
  }

  closeImage() {
    this.selectedImage = null;
  }
}