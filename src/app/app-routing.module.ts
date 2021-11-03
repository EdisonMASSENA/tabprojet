import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TableauComponent } from './components/tableau/tableau.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './helpers/auth.guard';


const routes: Routes = [
  { path: 'projets', component: TableauComponent, canActivate: [AuthGuard] },
  { path: '', component: LoginComponent },
  // { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
