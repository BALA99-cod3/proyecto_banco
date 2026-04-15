import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonButton, IonIcon,
  LoadingController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personAddOutline, arrowBackOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonButton, IonIcon
  ]
})
export class RegisterPage {
  nombre = '';
  email = '';
  telefono = '';
  password = '';
  confirmPassword = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    addIcons({ personAddOutline, arrowBackOutline });
  }

  async onRegister() {
    if (!this.nombre || !this.email || !this.password)
      return this.toast('Nombre, email y contraseña son obligatorios', 'warning');

    if (this.password.length < 6)
      return this.toast('La contraseña debe tener al menos 6 caracteres', 'warning');

    if (this.password !== this.confirmPassword)
      return this.toast('Las contraseñas no coinciden', 'warning');

    const loading = await this.loadingCtrl.create({ message: 'Creando cuenta...' });
    await loading.present();

    this.auth.register({
      nombre: this.nombre,
      email: this.email,
      telefono: this.telefono,
      password: this.password
    }).subscribe({
      next: () => {
        loading.dismiss();
        this.toast('¡Cuenta creada exitosamente!', 'success');
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        loading.dismiss();
        this.toast(err.error?.error || 'Error al registrar', 'danger');
      }
    });
  }

  async toast(message: string, color: string) {
    const t = await this.toastCtrl.create({ message, duration: 3000, color, position: 'top' });
    t.present();
  }

  goLogin() { this.router.navigate(['/login']); }
}
