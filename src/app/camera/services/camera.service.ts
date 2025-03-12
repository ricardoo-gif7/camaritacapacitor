import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() {
    // Nota: PWA Elements debe estar inicializado en el main.ts
    // Si no está inicializado, es posible que necesites importarlo aquí:
    // import { defineCustomElements } from '@ionic/pwa-elements/loader';
    // defineCustomElements(window);
  }

  // Verifica permisos solo si es un dispositivo nativo
  private async checkPermissions(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    
    const permissions = await Camera.checkPermissions();
    if (permissions.camera !== 'granted') {
      const request = await Camera.requestPermissions();
      if (request.camera !== 'granted') {
        throw new Error('Permisos de cámara no otorgados');
      }
    }
  }

  // Toma una foto directamente con la cámara
  async takePicture(): Promise<string> {
    try {
      await this.checkPermissions();
      
      // Configuración específica para forzar la apertura de la cámara
      const options = {
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera, // Forzar uso de cámara
        correctOrientation: true,
        // Estas opciones son importantes para web
        webUseInput: false, // No use input html
        promptLabelHeader: 'Cámara',
        promptLabelPhoto: 'Tomar foto',
        promptLabelPicture: 'Capturar foto',
        saveToGallery: false // No guardar en galería
      };
      
      const image: Photo = await Camera.getPhoto(options);
      
      if (!image || !image.webPath) {
        throw new Error('No se pudo obtener la imagen');
      }
      
      return image.webPath;
      
    } catch (error: any) {
      console.error('Error en CameraService.takePicture:', error);
      
      // Si el error es que no se encontraron los PWA Elements
      if (error.message && error.message.includes('PWA Element')) {
        console.warn('PWA Elements no encontrados. Asegúrate de agregarlos en main.ts');
        throw new Error('No se pudo inicializar la cámara web. Verifica la configuración de PWA Elements');
      }
      
      throw error;
    }
  }
}