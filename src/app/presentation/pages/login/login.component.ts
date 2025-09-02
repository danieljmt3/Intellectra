import { Component } from '@angular/core';
import { loginServices } from 'app/presentation/services/login.service';
import { passwordRestServices } from 'app/presentation/services/passwrod.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

      :root {
        --primary-color: #111211;
        --secondary-color: #10b981;
        --dark-color: #1e293b;
        --light-color: #f8fafc;
      }

      * {
        font-family: 'Poppins', sans-serif;
        transition: all 0.3s ease;
      }

      .form-container {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        border-radius: 16px;
        overflow: hidden;
      }

      .form-tab {
        padding: 1.5rem;
        cursor: pointer;
      }

      .form-tab.active {
        background-color: var(--primary-color);
        color: white;
      }

      .auth-btn {
        background-color: var(--primary-color);
        background-image: linear-gradient(
          to right,
          var(--primary-color),
          #000000
        );
      }

      .auth-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }

      .forgot-pass:hover {
        color: var(--primary-color);
      }

      .input-field:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
      }

      .social-btn {
        border: 1px solid #e2e8f0;
      }

      .social-btn:hover {
        border-color: var(--primary-color);
      }

      .illustration-container {
        background: linear-gradient(135deg, var(--primary-color), #111211);
      }

      #notification {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
      }

      #notification.show {
        opacity: 1;
        transform: translateY(0);
      }
    `,
  ],
})
export class LoginComponent {
  constructor(private loginservice: loginServices, private passRestService:passwordRestServices,private router: Router) {}

  showTab(tabName: string) {
    document.querySelectorAll('.auth-form').forEach((form) => {
      form.classList.add('hidden');
    });
    document.querySelectorAll('.form-tab').forEach((tab) => {
      tab.classList.remove('active', 'text-white');
      tab.classList.add('text-gray-600');
    });

    document.getElementById(`${tabName}-form`)?.classList.remove('hidden');
    document
      .getElementById(`${tabName}-tab`)
      ?.classList.add('active', 'text-white');
    document
      .getElementById(`${tabName}-tab`)
      ?.classList.remove('text-gray-600');
  }

  showNotification(message: string, type: 'success' | 'error' = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.className = `p-4 mb-6 rounded-lg bg-${
      type === 'success' ? 'green' : 'red'
    }-100 text-${type === 'success' ? 'green' : 'red'}-800`;
    notification.innerHTML = message;
    notification.classList.remove('hidden');
    notification.classList.add('show');

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.classList.add('hidden');
      }, 300);
    }, 5000);
  }

  handleLogin(event: Event) {
    event.preventDefault();
    const email = (document.getElementById('login-email') as HTMLInputElement)
      .value;
    const password = (
      document.getElementById('login-password') as HTMLInputElement
    ).value;

    this.loginservice.login(email, password).subscribe({
      next: (res) => {
        this.showNotification('Inicio de sesión exitoso', 'success');
        localStorage.setItem('token', res.token);
        this.router.navigate(['dashboard']);
      },
      error: (err) => {
        this.showNotification(
          err.error?.message || 'Error en inicio de sesión',
          'error'
        );
      },
    });
  }

  handleRegister(event: Event) {
    event.preventDefault();
    const firstName = (
      document.getElementById('register-firstname') as HTMLInputElement
    ).value;
    const lastName = (
      document.getElementById('register-lastname') as HTMLInputElement
    ).value;
    const email = (
      document.getElementById('register-email') as HTMLInputElement
    ).value;
    const password = (
      document.getElementById('register-password') as HTMLInputElement
    ).value;
    const confirmPassword = (
      document.getElementById('register-confirm') as HTMLInputElement
    ).value;

    if (password !== confirmPassword) {
      this.showNotification('Las contraseñas no coinciden', 'error');
      return;
    }

    const name = `${firstName} ${lastName}`;

    this.loginservice.register(name, email, password).subscribe({
      next: (res) => {
        this.showNotification('Registro exitoso', 'success');
        this.showTab('login');
      },
      error: (err) => {
        this.showNotification(
          err.error?.message || 'Error al registrarse',
          'error'
        );
      },
    });
  }

  cerrarSesion() {
    this.loginservice.logout().subscribe({
      next: () => {
        this.showNotification('Sesión cerrada', 'success');
      },
      error: (err) => {
        this.showNotification(
          err.error?.message || 'Error al cerrar sesión',
          'error'
        );
      },
    });
  }

  handleForgotPassword(event: Event) {
    event.preventDefault();

    const email = (document.getElementById('forgot-email') as HTMLInputElement)
      .value;

    if (!email) {
      this.showNotification('Porfavor ingresa un correo valido');
      return;
    }

    this.passRestService.requestRestPassword(email).subscribe({
      next: (res) => {
        this.showNotification(
          'Hemos enviado un enlace de recuperación a tu correo electrónico.',
          'success'
        );
        console.log('Se envió el correo', email);
      },
      error: (err) => {
        console.log(err);
        this.showNotification(
          err.error?.message || 'Ocurrió un error al enviar el enlace.',
          'error'
        );
      },
    });
  }
}
