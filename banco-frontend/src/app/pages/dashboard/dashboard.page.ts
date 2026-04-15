import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonList, IonItem, IonLabel, IonBadge, IonButton, IonIcon, IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  peopleOutline, cardOutline, swapHorizontalOutline,
  logOutOutline, trendingUpOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonList, IonItem, IonLabel, IonBadge, IonButton, IonIcon, IonButtons
  ]
})
export class DashboardPage implements OnInit {
  user: any;
  totalClientes    = 0;
  totalCuentas     = 0;
  totalMovimientos = 0;
  saldoTotal       = 0;
  recentTx: any[]  = [];
  loading          = true;

  constructor(private auth: AuthService, private api: ApiService) {
    addIcons({ peopleOutline, cardOutline, swapHorizontalOutline, logOutOutline, trendingUpOutline });
  }

  ngOnInit() {
    this.user = this.auth.getUser();
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.api.getClientes().subscribe(d => this.totalClientes = d.length);

    this.api.getCuentas().subscribe(d => {
      this.totalCuentas = d.length;
      this.saldoTotal   = d.reduce((sum: number, c: any) => sum + parseFloat(c.saldo || 0), 0);
    });

    this.api.getTransacciones().subscribe(d => {
      this.totalMovimientos = d.length;
      this.recentTx         = d.slice(0, 6);
      this.loading          = false;
    });
  }

  badgeColor(tipo: string): string {
    return tipo === 'Deposito' ? 'success' : tipo === 'Retiro' ? 'danger' : 'primary';
  }

  logout() { this.auth.logout(); }
}
