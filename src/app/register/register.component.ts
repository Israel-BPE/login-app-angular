import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordError: boolean = false;
  error: string = '';
  loading: boolean = false;

  private userService = inject(UsersService);
  private router = inject(Router);

  register() {
    // Reset errors
    this.error = '';
    this.passwordError = false;

    // Validaciones
    if (!this.email || !this.password || !this.confirmPassword) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.passwordError = true;
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.loading = true;

    const user = { 
      email: this.email, 
      password: this.password 
    };

    this.userService.register(user).subscribe({
      next: (data: any) => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        this.loading = false;
        if (error.status === 400) {
          this.error = 'Email no válido para esta API de prueba. Usa: eve.holt@reqres.in';
        } else {
          this.error = 'Error en el registro. Intenta nuevamente.';
        }
        console.error('Register error:', error);
      }
    });
  }
}