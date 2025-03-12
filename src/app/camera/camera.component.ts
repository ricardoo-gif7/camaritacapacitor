import { Component, OnInit, HostListener } from '@angular/core';
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
export class CameraComponent implements OnInit {
  imgUrls: string[] = [];
  hoverIndex: number | null = null;
  selectedImage: string | null = null;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private cameraService: CameraService) {}

  ngOnInit() {
    console.log('CameraComponent loaded');
    // Cargar imágenes guardadas al iniciar el componente
    this.loadSavedImages();
  }

  // Limpiar el hoverIndex cuando se hace clic fuera de una imagen
  @HostListener('document:click')
  onDocumentClick() {
    if (this.hoverIndex !== null) {
      this.hoverIndex = null;
    }
  }

  // Escuchar la tecla Escape para cerrar el modal
  @HostListener('document:keydown.escape')
  onKeydownHandler() {
    if (this.selectedImage) {
      this.closeImage();
    }
  }

  private loadSavedImages() {
    try {
      this.imgUrls = this.cameraService.loadImagesFromLocalStorage();
      console.log('Imágenes cargadas desde localStorage:', this.imgUrls.length);
    } catch (error) {
      console.error('Error al cargar imágenes:', error);
      this.errorMessage = 'No se pudieron cargar las imágenes guardadas';
    }
  }

  // Guardar imágenes cada vez que la colección cambie
  private saveImages() {
    this.cameraService.saveImagesToLocalStorage(this.imgUrls);
  }

  async takePicture() {
    this.errorMessage = '';
    try {
      this.loading = true;
      const imageUrl = await this.cameraService.takePicture();
      if (!imageUrl) {
        throw new Error('No se obtuvo una imagen válida');
      }
      this.imgUrls.unshift(imageUrl); // Añadir al principio para mostrar las más recientes primero
      // Guardar la nueva colección de imágenes
      this.saveImages();
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
    // Pedir confirmación antes de eliminar todas las fotos
    if (confirm('¿Estás seguro de que deseas eliminar todas las fotos?')) {
      this.imgUrls = [];
      // Limpiar localStorage al eliminar todas las fotos
      this.cameraService.clearImagesFromLocalStorage();
    }
  }

  toggleHoverIndex(index: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.hoverIndex = this.hoverIndex === index ? null : index;
  }

  deleteImage(index: number, event: Event) {
    event.stopPropagation(); // Evita que el clic en el botón afecte al contenedor
    // Pedir confirmación antes de eliminar
    if (confirm('¿Eliminar esta imagen?')) {
      this.imgUrls.splice(index, 1);
      if (this.hoverIndex === index) {
        this.hoverIndex = null;
      }
      // Actualizar localStorage al eliminar una imagen
      this.saveImages();
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