import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from 'src/app/interface/tab';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {

  user: any = {};
  medium: boolean;
  displayedColumns: string[] = ['direction','mdp','action'];
  dataSource = new MatTableDataSource<User>();
  getUser: any;

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit(): void {

    this.responsive();

    this.recupUser();

  }

  logout(): void {
    this.tokenStorage.signOut();
    this.router.navigate(['']);
    let msg = 'Déconnexion';
  };

  responsive(){
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait,Breakpoints.Small,,Breakpoints.XSmall])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.medium = true;
        }else{
          this.medium = false;
        }
      });
  }

  recupUser(): void {
    this.authService.admin()
      .subscribe({
        next: (data) => {
          this.dataSource.data = data;
        },
        error: (e) => console.error(e)
      });
  }


  createUser(): void {

    this.authService.create(this.user)
      .subscribe({
        next: (res) => {
          // console.log(response);
          this.recupUser();
          // this.recupFile();
        },
        error: (e) => console.error(e)
      });

  };

  deleteUser(data: User) {
    
    this.authService.delete(data)
      .subscribe({
        next: (res) => {
          // console.log(response);
          this.recupUser();
        },
        error: (e) => console.error(e)
      });
  };


}
