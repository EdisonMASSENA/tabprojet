import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TableauComponent } from './components/tableau/tableau.component';
import { LoginComponent } from './components/login/login.component';
import { AdminGuard, AuthGuard } from './helpers/auth.guard';
import { AdduserComponent } from './components/adduser/adduser.component';


const routes: Routes = [
  { path: 'projets', component: TableauComponent, canActivate: [AuthGuard] },
  { path: '', component: LoginComponent },
  { path: 'admin', component: AdduserComponent, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
