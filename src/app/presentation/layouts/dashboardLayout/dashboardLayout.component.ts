import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule,Router } from '@angular/router';
import { SidebarMenuItemComponent } from '../../components/sidebarMenuItem/sidebarMenuItem.component';
import { routes } from '../../../app.routes';

@Component( {
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarMenuItemComponent,
  ],
  templateUrl: './dashboardLayout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class DashboardLayoutComponent {

  public routes = routes
  .find(route=> route.path === 'dashboard')
  ?.children?.filter(route=>route.data)?? []

  constructor (private router:Router){}

  logout(){
    localStorage.clear();
    this.router.navigate(['login'])
  }

}
