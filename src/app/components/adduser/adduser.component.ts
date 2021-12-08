import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/interface/tab';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService) { }

  ngOnInit(): void {

    this.responsive();

    this.recupUser();

  }

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
      .subscribe(
        data => {
          this.dataSource.data = data;
        },
        error => {
          console.log(error);
        });
  }


  createUser(): void {

    this.authService.create(this.user)
      .subscribe(
        response => {
          // console.log(response);
          this.recupUser();
          // this.recupFile();
        },
        error => {
          // console.log(error);
        });

  };

  deleteUser(data: User) {
    
    this.authService.delete(data)
      .subscribe(
        response => {
          // console.log(response);
          this.recupUser();
        },
        error => {
          // console.log(error);
        });

  };


}
