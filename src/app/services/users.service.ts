import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = 'https://reqres.in/api';
  private useMock = true;

  login(user: any): Observable<any> {
    if (this.useMock) {
      console.log('Usando MOCK para login:', user);
      const mockResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: Math.floor(Math.random() * 1000), // ID único
          email: user.email,
          first_name: this.getFirstNameFromEmail(user.email),
          last_name: 'Usuario'
        }
      };
      
      // Guardar el usuario en localStorage
      localStorage.setItem('currentUser', JSON.stringify(mockResponse.user));
      
      return new Observable(observer => {
        setTimeout(() => {
          this.setToken(mockResponse.token);
          observer.next(mockResponse);
          observer.complete();
        }, 1000);
      });
    }

    return this.http.post(`${this.apiUrl}/login`, user).pipe(
      tap((data: any) => {
        this.setToken(data.token);
        // Para API real, necesitarías hacer otra llamada para obtener el usuario
      })
    );
  }

  register(user: any): Observable<any> {
    if (this.useMock) {
      console.log('Usando MOCK para registro:', user);
      const mockResponse = {
        id: Math.floor(Math.random() * 1000),
        token: 'mock-jwt-token-' + Date.now(),
        email: user.email
      };
      
      // Crear usuario para el registro
      const newUser = {
        id: mockResponse.id,
        email: user.email,
        first_name: this.getFirstNameFromEmail(user.email),
        last_name: 'Nuevo Usuario',
        avatar: 'https://reqres.in/img/faces/1-image.jpg'
      };
      
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      return new Observable(observer => {
        setTimeout(() => {
          this.setToken(mockResponse.token);
          observer.next(mockResponse);
          observer.complete();
        }, 1000);
      });
    }

    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap((data: any) => {
        this.setToken(data.token);
      })
    );
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    console.log('Token guardado:', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  deleteToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser'); // Limpiar también el usuario
  }

  getUser(): Observable<any> {
    // Primero intenta obtener el usuario guardado en localStorage
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedUser) {
      console.log('Usuario recuperado de localStorage:', JSON.parse(savedUser));
      return of({ data: JSON.parse(savedUser) });
    }

    // Si no hay usuario guardado, usa el mock por defecto
    if (this.useMock) {
      const mockUser = {
        data: {
          id: 1,
          email: 'usuario@ejemplo.com',
          first_name: 'Usuario',
          last_name: 'Demo',
          avatar: 'https://reqres.in/img/faces/1-image.jpg'
        }
      };
      return of(mockUser);
    }

    return this.http.get(`${this.apiUrl}/users/2`);
  }

  // Helper para generar nombre desde el email
  private getFirstNameFromEmail(email: string): string {
    if (!email) return 'Usuario';
    
    const namePart = email.split('@')[0];
    const name = namePart.split('.')[0] || namePart;
    
    // Capitalizar primera letra
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}