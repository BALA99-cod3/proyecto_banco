import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon,
  IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption,
  IonModal, IonButton, IonInput, IonBadge, IonButtons, IonSearchbar, IonRefresher,
  IonRefresherContent, AlertController, LoadingController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline, personOutline, searchOutline } from 'ionicons/icons';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-clientes',
  templateUrl: 'clientes.page.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon,
    IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption,
    IonModal, IonButton, IonInput, IonBadge, IonButtons, IonSearchbar, IonRefresher,
    IonRefresherContent
  ]
})
export class ClientesPage implements OnInit {
  clientes: any[]   = [];
  filtered: any[]   = [];
  searchText        = '';
  isModalOpen       = false;
  isEditing         = false;
  form: any         = { id: null, nombre: '', email: '', telefono: '' };

  constructor(
    private api: ApiService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    addIcons({ addOutline, createOutline, trashOutline, personOutline, searchOutline });
  }

  ngOnInit() { this.load(); }

  load(refresher?: any) {
    this.api.getClientes().subscribe(data => {
      this.clientes = data;
      this.filtered = data;
      if (refresher) refresher.target.complete();
    });
  }

  search(ev: any) {
    const q = ev.target.value.toLowerCase();
    this.filtered = this.clientes.filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.telefono || '').includes(q)
    );
  }

  openModal(cliente?: any) {
    this.isEditing = !!cliente;
    this.form = cliente
      ? { id: cliente.id, nombre: cliente.nombre, email: cliente.email, telefono: cliente.telefono }
      : { id: null, nombre: '', email: '', telefono: '' };
    this.isModalOpen = true;
  }

  async save() {
    if (!this.form.nombre?.trim() || !this.form.email?.trim()) {
      return this.toast('Nombre y email son obligatorios', 'warning');
    }
    const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
    await loading.present();

    const obs = this.isEditing
      ? this.api.updateCliente(this.form.id, this.form)
      : this.api.createCliente(this.form);

    obs.subscribe({
      next: () => {
        loading.dismiss();
        this.isModalOpen = false;
        this.load();
        this.toast(this.isEditing ? 'Cliente actualizado' : 'Cliente creado', 'success');
      },
      error: (err) => { loading.dismiss(); this.toast(err.error?.error || 'Error', 'danger'); }
    });
  }

  async delete(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: 'Se eliminarán también sus cuentas. ¿Continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar', role: 'destructive', cssClass: 'danger',
          handler: () => {
            this.api.deleteCliente(id).subscribe({
              next: () => { this.load(); this.toast('Cliente eliminado', 'success'); },
              error: (err) => this.toast(err.error?.error || 'Error al eliminar', 'danger')
            });
          }
        }
      ]
    });
    alert.present();
  }

  async toast(message: string, color: string) {
    const t = await this.toastCtrl.create({ message, duration: 2500, color, position: 'top' });
    t.present();
  }
}
