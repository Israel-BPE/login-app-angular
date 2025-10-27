import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  user: any = null;
  private userService = inject(UsersService);
  private router = inject(Router);

  ngOnInit() {
    this.getUserLogged();
  }

  getUserLogged() {
    const token = this.userService.getToken();
    console.log('Token encontrado:', token);
    
    if (token) {
      this.userService.getUser().subscribe({
        next: (userData: any) => {
          console.log('Datos del usuario recibidos:', userData);
          this.user = userData.data;
        },
        error: (error: any) => {
          console.error('Error obteniendo usuario:', error);
          this.user = null;
        }
      });
    } else {
      console.log('No hay token, usuario no logueado');
      this.user = null;
    }
  }

  logout() {
    console.log('Cerrando sesión...');
    this.userService.deleteToken();
    this.user = null;
    this.router.navigate(['/login']);
  }
}