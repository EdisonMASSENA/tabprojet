import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatIconModule} from '@angular/material/icon'; 
import {MatMenuModule} from '@angular/material/menu'; 
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatDialogModule} from '@angular/material/dialog'; 
import {MatRadioModule} from '@angular/material/radio'; 
import {MatSnackBarModule} from '@angular/material/snack-bar'; 
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort'; 
import { HttpClientModule } from '@angular/common/http';
import {MatTooltipModule} from '@angular/material/tooltip'; 
import {LayoutModule} from '@angular/cdk/layout';
import {MatChipsModule} from '@angular/material/chips';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableauComponent } from './components/tableau/tableau.component';
import { DialogBoxComponent } from './components/dialog-box/dialog-box.component';
import { TableauService } from './services/tableau.service';
import { LoginComponent } from './components/login/login.component';
import { authInterceptorProviders } from './helpers/auth.interceptor';



@NgModule({
  declarations: [
    AppComponent,
    TableauComponent,
    DialogBoxComponent,
    LoginComponent
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
    DragDropModule,
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
    MatChipsModule
    
  ],
  entryComponents: [
    DialogBoxComponent
  ],
  providers: [
    TableauService,
    authInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
