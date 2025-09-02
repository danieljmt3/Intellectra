import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Route } from '@angular/router';
import Swal from 'sweetalert2';
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
          Swal.fire({
            icon:"success",
            title:"Contraseña restablecida",
            text:"Contraseña restablecida con exito,",
            confirmButtonColor:"#1d4ed8",
            timer:3000,
            timerProgressBar:true,
            showConfirmButton:false
          }).then(()=>{
            this.router.navigate(['/login'])
          });
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            icon:"error",
            title:"Erro inesperado",
            text:"No se pudo cambiar la contraseña",
            confirmButtonColor:"#1d4ed8"
          })
        },
      });
  }
}
