import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';


import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(0px)' }),
        animate(0, style({ opacity: 1, transform: 'translateY(0px)' }))
      ]),
      transition(':leave', [
        animate(300, style({ opacity: 0, transform: 'translateY(0px)' }))
      ]),
    ]),
  ]

})

export class LoginComponent implements OnInit {

  dirs = [];
  hide = true;
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  small:boolean;

  constructor(private _snackBar: MatSnackBar, private router: Router, private authService: AuthService, private tokenStorage: TokenStorageService, private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.router.navigate(['/projets']);
    }

    this.recupUser();

    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait,Breakpoints.Small,,Breakpoints.XSmall])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
           this.small = true;
        }else{
          this.small = false;

        }
      });
  }

  mdpFormControl = new FormControl('', [
    Validators.required
  ]);



  login(): void {
    if (this.form.username == 'Consult') {
      this.form.password = null ;
    };
    this.authService.login(this.form).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.router.navigate(['/projets']);

      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        console.log(err.error.message)

        let msg = 'Mauvais mot de passe'

        this._snackBar.open(msg, 'Fermer', {
          duration: 3000,
          horizontalPosition: "center",
          verticalPosition: "bottom",
        });

      }
    );
  }

  recupUser(): void {
    this.authService.user()
      .subscribe(
        data => {
          for (let i = 0; i < data.length; i++) {
            this.dirs = this.dirs.concat(data[i].username);
          }
          // console.log(data);
          // console.log(this.dirs);
        },
        error => {
          console.log(error);
        });
  }


}
