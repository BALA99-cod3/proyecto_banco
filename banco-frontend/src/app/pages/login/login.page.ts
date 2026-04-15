import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonNote,
  LoadingController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logInOutline, eyeOutline, eyeOffOutline, lockClosedOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonNote
  ]
})
export class LoginPage {
  email = 'admin@banco.com';
  password = 'password';
  showPass = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    addIcons({ logInOutline, eyeOutline, eyeOffOutline, lockClosedOutline });
  }

  async onLogin() {
    if (!this.email || !this.password) {
      this.toast('Completa todos los campos', 'warning');
      return;
    }
    const loading = await this.loadingCtrl.create({ message: 'Verificando credenciales...' });
    await loading.present();

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        loading.dismiss();
        this.router.navigate(['/tabs/dashboard']);
      },
      error: (err) => {
        loading.dismiss();
        this.toast(err.error?.error || 'Error al iniciar sesión', 'danger');
      }
    });
  }

  async toast(message: string, color: string) {
    const t = await this.toastCtrl.create({ message, duration: 3000, color, position: 'top' });
    t.present();
  }

  goRegister() { this.router.navigate(['/register']); }
}
