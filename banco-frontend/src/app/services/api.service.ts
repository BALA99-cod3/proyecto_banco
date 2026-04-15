import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // ── Clientes ────────────────────────────────────────────
  getClientes():                  Observable<any[]> { return this.http.get<any[]>(`${this.base}/clientes`); }
  getCliente(id: number):         Observable<any>   { return this.http.get<any>(`${this.base}/clientes/${id}`); }
  createCliente(data: any):       Observable<any>   { return this.http.post(`${this.base}/clientes`, data); }
  updateCliente(id: number, d: any): Observable<any> { return this.http.put(`${this.base}/clientes/${id}`, d); }
  deleteCliente(id: number):      Observable<any>   { return this.http.delete(`${this.base}/clientes/${id}`); }

  // ── Cuentas ──────────────────────────────────────────────
  getCuentas():                   Observable<any[]> { return this.http.get<any[]>(`${this.base}/cuentas`); }
  getCuenta(id: number):          Observable<any>   { return this.http.get<any>(`${this.base}/cuentas/${id}`); }
  createCuenta(data: any):        Observable<any>   { return this.http.post(`${this.base}/cuentas`, data); }
  updateCuenta(id: number, d: any): Observable<any> { return this.http.put(`${this.base}/cuentas/${id}`, d); }
  deleteCuenta(id: number):       Observable<any>   { return this.http.delete(`${this.base}/cuentas/${id}`); }

  // ── Transacciones ────────────────────────────────────────
  getTransacciones():             Observable<any[]> { return this.http.get<any[]>(`${this.base}/transacciones`); }
  createTransaccion(data: any):   Observable<any>   { return this.http.post(`${this.base}/transacciones`, data); }
}
