import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { passwordRestServices } from 'app/presentation/services/passwrod.service';

@Component({
  selector: 'app-reset-password',
  standalone:true,
  imports:[FormsModule,CommonModule],
  templateUrl: './ResetPassword.component.html',
})
export class ResetPasswordComponet {
  id!: string;
  token!: string;
  NewPassword: string = '';
  confirmPassword: string = '';
  mensaje: string = '';
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private passwordservice: passwordRestServices
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params=>{
      this.id=params['id']
      this.token=params['token']
    })
  }

  onSubmit() {
    if (this.NewPassword !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      this.mensaje = '';
      return;
    }

    this.passwordservice
      .RestPassword(this.id, this.token, this.NewPassword)
      .subscribe({
        next: (res) => {
          this.mensaje = 'La contraseña ha sido restablecida exitosamente';
          this.error = '';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (err) => {
          console.log(err);
          this.error =
            err.error?.message ||
            'Ocurrió un error al restablecer la contraseña.';
          this.mensaje = '';
        },
      });
  }
}
