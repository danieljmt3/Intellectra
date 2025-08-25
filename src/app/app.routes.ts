import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './presentation/layouts/dashboardLayout/dashboardLayout.component';

export const routes: Routes = [

  //Ruta inicial
    {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  //Ruta login
  {
    path: 'login',
    loadComponent: () =>
      import('./presentation/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },

  //Ruta restablecer
  {
    path:'reset-password',
    loadComponent:()=>
      import('./presentation/pages/ResetPassword/ResetPassword.component').then((m)=>m.ResetPasswordComponet)
  },

  //Rutas protegidas con dashboard
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'orthography',
        loadComponent: () =>
          import(
            './presentation/pages/orthographyPage/orthographyPage.component'
          ),
        data: {
          icon: 'fa-solid fa-spell-check',
          title: 'Ortografía',
          description: 'Corregir ortografía',
        },
      },
      {
        path: 'translate',
        loadComponent: () =>
          import('./presentation/pages/translatePage/translatePage.component'),
        data: {
          icon: 'fa-solid fa-language',
          title: 'Traducir',
          description: 'Textos a otros idiomas',
        },
      },
      {
        path: 'text-to-audio',
        loadComponent: () =>
          import(
            './presentation/pages/textToAudioPage/textToAudioPage.component'
          ),
        data: {
          icon: 'fa-solid fa-podcast',
          title: 'Texto a audio',
          description: 'Convertir texto a audio',
        },
      },
      {
        path: 'image-generation',
        loadComponent: () =>
          import(
            './presentation/pages/imageGenerationPage/imageGenerationPage.component'
          ),
        data: {
          icon: 'fa-solid fa-image',
          title: 'Imágenes',
          description: 'Generar imágenes',
        },
      },
      {
        path: 'assistant',
        loadComponent: () =>
          import('./presentation/pages/assistantPage/assistantPage.component'),
        data: {
          icon: 'fa-solid fa-user',
          title: 'Asistente',
          description: 'Información del asistente',
        },
      },{
        path:'',
        redirectTo:'orthography',
        pathMatch:'full'
      }
    ],
  },
  //Ruta global (comodin)
  {
    path: '**',
    redirectTo: 'login',
  },
];
