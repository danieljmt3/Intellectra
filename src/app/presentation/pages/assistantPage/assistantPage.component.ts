import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OpenAiService } from 'app/presentation/services/openai.service';
import Swal from 'sweetalert2';


@Component( {
  selector: 'app-assistant-page',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './assistantPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export default class AssistantPageComponent { 
  constructor(private openIAservice:OpenAiService) {}

  report(event:Event){

    const nombre=(document.getElementById('nombre')as HTMLInputElement).value
    const email= (document.getElementById('email')as HTMLInputElement).value
    const asunto=(document.getElementById('problema')as HTMLInputElement).value

    event.preventDefault();
    console.log(`Se recibió ${nombre},${email},${asunto}`);

    if(nombre.trim() == "" || email.trim() =="" || asunto.trim()==""){
      Swal.fire({
        icon:"error",
        title:"Error",
        text:"Complete todos los campos"
      })
      return
    }


    this.openIAservice.report(nombre,email,asunto).subscribe({
      next:(res)=>{
        console.log("Reporte enviado");
        Swal.fire({
          icon:"success",
          title:"Reporte enviado",
          text:"Reporte enviado",
          timer:4000,
          timerProgressBar:true
        })
      },error:(err)=>{
        console.log(err);
        Swal.fire({
          icon:"error",
          title:"Error inesperado",
          text:"Ocurrió algo inesperado",
          confirmButtonColor:"#C21313"
        })
      }
    })

  }




}
