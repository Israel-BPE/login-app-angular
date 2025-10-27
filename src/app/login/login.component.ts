import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;

  private userService = inject(UsersService);
  private router = inject(Router);

  ngOnInit() {
    // Limpiar localStorage al cargar el login (opcional)
    // localStorage.removeItem('token');
  }

  login() {
    this.error = '';
    this.loading = true;

    console.log('=== INTENTANDO LOGIN ===');
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    // Validación básica
    if (!this.email || !this.password) {
      this.error = 'Email y password son requeridos';
      this.loading = false;
      return;
    }

    const user = { 
      email: this.email, 
      password: this.password 
    };

     this.userService.login(user).subscribe({
    next: (data: any) => {
      console.log('✅ Login exitoso:', data);
      this.loading = false;
      this.router.navigate(['/home']); // Redirigir a home después del login
    },
      error: (error: any) => {
        console.error('❌ ERROR EN LOGIN:', error);
        this.loading = false;
        
        // Mostrar información detallada del error
        if (error.status === 400) {
          this.error = 'Credenciales incorrectas para la API. Usando modo demo...';
          
          // Forzar login exitoso en modo demo
          setTimeout(() => {
            const mockToken = 'demo-token-' + Date.now();
            localStorage.setItem('token', mockToken);
            this.router.navigate(['/']);
          }, 1000);
          
        } else if (error.status === 0) {
          this.error = 'Error de conexión. Usando modo demo...';
          setTimeout(() => {
            const mockToken = 'demo-token-' + Date.now();
            localStorage.setItem('token', mockToken);
            this.router.navigate(['/']);
          }, 1000);
        } else {
          this.error = `Error: ${error.message || 'Desconocido'}`;
        }
      }
    });
  }
}