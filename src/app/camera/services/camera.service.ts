import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, PermissionStatus } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  private async checkPermissions(): Promise<void> {
    const check = async (permission: PermissionStatus): Promise<boolean> => {
      if (permission.camera !== 'granted' || permission.photos !== 'granted') {
        const request = await Camera.requestPermissions();
        return request.camera === 'granted' && request.photos === 'granted';
      }
      return true;
    };

    if (Capacitor.isNativePlatform()) {
      const permissions = await Camera.checkPermissions();
      if (!(await check(permissions))) {
        throw new Error('Permisos de cámara no otorgados');
      }
    }
  }

  async takePicture(): Promise<string> {
    await this.checkPermissions();

    if (Capacitor.isNativePlatform()) {
      // En Android/iOS
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      return image.webPath ?? '';
    } else {
      // En la web, usar un input file
      return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event: any) => {
          const file = event.target.files[0];
          if (!file) {
            reject('No se seleccionó una imagen');
            return;
          }

          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject('Error al leer la imagen');
          reader.readAsDataURL(file);
        };
        input.click();
      });
    }
  }
}
