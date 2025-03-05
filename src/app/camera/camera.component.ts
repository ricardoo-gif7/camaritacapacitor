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
      this.loading = false;
    } catch (error) {
      console.error('Error al capturar imagen:', error);
      this.errorMessage = String(error);
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
}
