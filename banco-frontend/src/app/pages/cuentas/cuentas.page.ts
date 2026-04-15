import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon,
  IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption,
  IonModal, IonButton, IonInput, IonSelect, IonSelectOption, IonBadge, IonButtons,
  IonRefresher, IonRefresherContent, AlertController, LoadingController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline, cardOutline } from 'ionicons/icons';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-cuentas',
  templateUrl: 'cuentas.page.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon,
    IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption,
    IonModal, IonButton, IonInput, IonSelect, IonSelectOption, IonBadge, IonButtons,
    IonRefresher, IonRefresherContent
  ]
})
export class CuentasPage implements OnInit {
  cuentas: any[]  = [];
  clientes: any[] = [];
  isModalOpen     = false;
  isEditing       = false;
  form: any       = { id: null, cliente_id: null, numero_cuenta: '', tipo_cuenta: 'Ahorro', saldo: 0, estado: 'Activa' };

  constructor(
    private api: ApiService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    addIcons({ addOutline, createOutline, trashOutline, cardOutline });
  }

  ngOnInit() { this.load(); }

  load(refresher?: any) {
    this.api.getCuentas().subscribe(data => {
      this.cuentas = data;
      if (refresher) refresher.target.complete();
    });
    this.api.getClientes().subscribe(data => this.clientes = data);
  }

  openModal(cuenta?: any) {
    this.isEditing = !!cuenta;
    this.form = cuenta
      ? { ...cuenta }
      : { id: null, cliente_id: null, numero_cuenta: '', tipo_cuenta: 'Ahorro', saldo: 0, estado: 'Activa' };
    this.isModalOpen = true;
  }

  async save() {
    if (!this.form.numero_cuenta?.trim() || !this.form.cliente_id)
      return this.toast('Cliente y número de cuenta son obligatorios', 'warning');

    const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
    await loading.present();

    const obs = this.isEditing
      ? this.api.updateCuenta(this.form.id, this.form)
      : this.api.createCuenta(this.form);

    obs.subscribe({
      next: () => {
        loading.dismiss();
        this.isModalOpen = false;
        this.load();
        this.toast(this.isEditing ? 'Cuenta actualizada' : 'Cuenta creada', 'success');
      },
      error: (err) => { loading.dismiss(); this.toast(err.error?.error || 'Error', 'danger'); }
    });
  }

  async delete(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Eliminar esta cuenta bancaria?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar', role: 'destructive',
          handler: () => {
            this.api.deleteCuenta(id).subscribe({
              next: () => { this.load(); this.toast('Cuenta eliminada', 'success'); },
              error: (err) => this.toast(err.error?.error || 'Error', 'danger')
            });
          }
        }
      ]
    });
    alert.present();
  }

  estadoColor(estado: string): string {
    return estado === 'Activa' ? 'success' : estado === 'Bloqueada' ? 'danger' : 'medium';
  }

  async toast(message: string, color: string) {
    const t = await this.toastCtrl.create({ message, duration: 2500, color, position: 'top' });
    t.present();
  }
}
