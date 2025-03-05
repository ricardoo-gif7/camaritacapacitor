import { Component } from '@angular/core';
import { CameraComponent } from './camera/camera.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CameraComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My App';
  
  ngOnInit() {
    console.log('AppComponent loaded');
  }
  
}
