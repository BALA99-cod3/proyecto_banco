import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon,
  IonList, IonItem, IonLabel, IonModal, IonButton, IonSelect, IonSelectOption,
  IonBadge, IonInput, IonButtons, IonRefresher, IonRefresherContent,
  LoadingController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline, swapHorizontalOutline, arrowUpOutline,
  arrowDownOutline, cashOutline
} from 'ionicons/icons';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-transacciones',
  templateUrl: 'transacciones.page.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon,
    IonList, IonItem, IonLabel, IonModal, IonButton, IonSelect, IonSelectOption,
    IonBadge, IonInput, IonButtons, IonRefresher, IonRefresherContent
  ]
})
export class TransaccionesPage implements OnInit {
  transacciones: any[] = [];
  cuentas: any[]       = [];
  isModalOpen          = false;
  form: any            = {
    cuenta_origen_id:  null,
    cuenta_destino_id: null,
    monto:             null,
    tipo_movimiento:   'Deposito'
  };

  constructor(
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    addIcons({ addOutline, swapHorizontalOutline, arrowUpOutline, arrowDownOutline, cashOutline });
  }

  ngOnInit() { this.load(); }

  load(refresher?: any) {
    this.api.getTransacciones().subscribe(data => {
      this.transacciones = data;
      if (refresher) refresher.target.complete();
    });
    this.api.getCuentas().subscribe(data => this.cuentas = data);
  }

  resetForm() {
    this.form = { cuenta_origen_id: null, cuenta_destino_id: null, monto: null, tipo_movimiento: 'Deposito' };
  }

  async save() {
    if (!this.form.monto || this.form.monto <= 0)
      return this.toast('El monto debe ser mayor a 0', 'warning');

    if (this.form.tipo_movimiento === 'Retiro' && !this.form.cuenta_origen_id)
      return this.toast('Selecciona la cuenta de origen', 'warning');
    if (this.form.tipo_movimiento === 'Deposito' && !this.form.cuenta_destino_id)
      return this.toast('Selecciona la cuenta de destino', 'warning');
    if (this.form.tipo_movimiento === 'Transferencia' &&
        (!this.form.cuenta_origen_id || !this.form.cuenta_destino_id))
      return this.toast('Selecciona ambas cuentas para transferencia', 'warning');

    const loading = await this.loadingCtrl.create({ message: 'Procesando transacción...' });
    await loading.present();

    this.api.createTransaccion(this.form).subscribe({
      next: () => {
        loading.dismiss();
        this.isModalOpen = false;
        this.resetForm();
        this.load();
        this.toast('Transacción registrada exitosamente', 'success');
      },
      error: (err) => { loading.dismiss(); this.toast(err.error?.error || 'Error', 'danger'); }
    });
  }

  badgeColor(tipo: string): string {
    return tipo === 'Deposito' ? 'success' : tipo === 'Retiro' ? 'danger' : 'primary';
  }

  iconName(tipo: string): string {
    return tipo === 'Deposito' ? 'arrow-down-outline' :
           tipo === 'Retiro'   ? 'arrow-up-outline'   : 'swap-horizontal-outline';
  }

  async toast(message: string, color: string) {
    const t = await this.toastCtrl.create({ message, duration: 3000, color, position: 'top' });
    t.present();
  }
}
