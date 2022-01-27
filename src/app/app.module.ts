import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DatePipe} from '@angular/common'
import {LayoutModule} from '@angular/cdk/layout';
import {HttpClientModule} from '@angular/common/http';


import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatIconModule} from '@angular/material/icon'; 
import {MatMenuModule} from '@angular/material/menu'; 
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatDialogModule} from '@angular/material/dialog'; 
import {MatRadioModule} from '@angular/material/radio'; 
import {MatSnackBarModule} from '@angular/material/snack-bar'; 
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort'; 
import {MatTooltipModule} from '@angular/material/tooltip';
// import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSliderModule} from '@angular/material/slider';
import {MatSidenavModule} from '@angular/material/sidenav';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableauComponent } from './components/tableau/tableau.component';
import { DialogBoxComponent } from './components/dialog-box/dialog-box.component';
import { TableauService } from './services/tableau.service';
import { LoginComponent } from './components/login/login.component';
import { authInterceptorProviders } from './helpers/auth.interceptor';
import { AdduserComponent } from './components/adduser/adduser.component';



@NgModule({
  declarations: [
    AppComponent,
    TableauComponent,
    DialogBoxComponent,
    LoginComponent,
    AdduserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatDialogModule,
    MatRadioModule,
    MatSnackBarModule,
    MatInputModule,
    MatSelectModule,
    MatSortModule,
    HttpClientModule,
    MatTooltipModule,
    LayoutModule,
    // MatDatepickerModule,
    MatCardModule,
    MatListModule,
    MatProgressBarModule,
    MatSliderModule,
    MatSidenavModule
  ],
  // entryComponents: [
  //   DialogBoxComponent
  // ],
  providers: [
    TableauService,
    authInterceptorProviders,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
