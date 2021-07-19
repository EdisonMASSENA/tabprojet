import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import {animate, state, style, transition, trigger} from '@angular/animations';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'


import { Tab } from "src/app/interface/tab";
import { TableauService } from "src/app/services/tableau.service";
import { DialogBoxComponent } from 'src/app/components/dialog-box/dialog-box.component';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Router } from '@angular/router';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';



@Component({
  selector: 'app-tableau',
  templateUrl: './tableau.component.html',
  styleUrls: ['./tableau.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})


export class TableauComponent implements OnInit {

  username: string;
  isLoggedIn = false;
  tabs: Tab[];
  consult: boolean;
  isShow: boolean;
  startShowing = 100;
  medium: boolean;
  displayedColumns: string[];
  expandedElement: Tab|null;
  dataSource = new MatTableDataSource<Tab>();
  acces = "Vous n'avez pas les droits"
  
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  // @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  
  constructor(private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar, private service: TableauService, public dialog: MatDialog, private router: Router, private breakpointObserver: BreakpointObserver) {  }


  ngOnInit(): void {

    this.isLogged();

    this.recupTab();
    
    // console.log(this.dataTab);
    //////////////////// Bar de recherche de projet ////////////////////////////
    this.dataSource.filterPredicate = function (tab, filter: string): boolean {
      return tab.projet.toLowerCase().includes(filter);
    };

    ///////////////////////// Tri ////////////////////////
    this.dataSource.sort = this.sort;

    if (this.username == 'Consult') {
      this.consult = true;
    }

    this.tabDisplay();
    
  }

  
  tabclick(cli) {
    if (this.medium && !cli.editing ) {
      if (this.expandedElement === cli) {
        this.expandedElement = null;
      }
      else {
        this.expandedElement = cli;
      }
    }
  };

  isLogged() {
    this.isLoggedIn = !!this.tokenStorage.getToken();
    if (this.isLoggedIn) {

      const user = this.tokenStorage.getUser();
      this.username = user.username;

    }
  };


  tabDisplay() {
    this.breakpointObserver
      .observe([Breakpoints.Medium,Breakpoints.Small,Breakpoints.HandsetPortrait,Breakpoints.XSmall])
      .subscribe((state: BreakpointState) => {
        
        if (state.matches) {
          this.medium = true;
          this.displayedColumns = ['chef', 'direction', 'projet', 'etat', 'tendance'];
        }
        else if (this.consult) {
          this.medium = false;
          this.displayedColumns = ['chef', 'direction', 'priorite', 'projet', 'etat', 'tendance', 'accompli', 'attention', 'enCours'];
        }
         else {
          this.medium = false;
          this.displayedColumns = ['chef', 'direction', 'priorite', 'projet', 'etat', 'tendance', 'accompli', 'attention', 'enCours', 'action'];
        }
      });
  };


  downloadPdf() {

    let prepare = [];
    this.dataSource.data.forEach(e => {
      let tempObj = [];
      tempObj.push(e.chef);
      tempObj.push(e.direction);
      tempObj.push(e.priorite);
      tempObj.push(e.projet);
      tempObj.push(e.etat);
      tempObj.push(e.tendance);
      tempObj.push(e.accompli);
      tempObj.push(e.attention);
      tempObj.push(e.enCours);
      prepare.push(tempObj);
    });

    const doc = new jsPDF('l', 'mm', 'a')
    autoTable(doc, {
      styles: {
        overflow: 'linebreak',
        cellPadding: 2,
      },
      headStyles: {
        fillColor: '#495bbe'
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 19 },
        2: { cellWidth: 17 },
        4: { cellWidth: 20, minCellHeight: 15, textColor: 255 },
        5: { cellWidth: 21, minCellHeight: 15, textColor: 255 },
        6: { cellWidth: 70 },
        7: { cellWidth: 70 },
        8: { cellWidth: 70 },
      },
      theme: "grid",
      head: [['Chef de projet', 'Direction', 'Priorité', 'Projet', 'État', 'Tendance', 'Travaux faits', 'Points d\'attention', 'Travaux en cours / à venir ']],
      body: prepare,
      didDrawCell: function (data) {
        if (data.column.index === 4 && data.cell.section === 'body') {
          let td = data.cell.raw;
          // console.log(td);
          let textPosx = data.cell.x;
          let textPosy = data.cell.y;
          // console.log(textPosx);
          // console.log(textPosy);
          if (td !== null) {
            doc.addImage("https://tabprojet.herokuapp.com/" + td, 'PNG', textPosx + 0.5, textPosy + 0.5, 20, 14);
          }
        }
        if (data.column.index === 5 && data.cell.section === 'body') {
          let td = data.cell.raw;
          // console.log(td);
          let textPosx = data.cell.x;
          let textPosy = data.cell.y;
          // console.log(textPosx);
          // console.log(textPosy);
          if (td !== null) {
            doc.addImage("https://tabprojet.herokuapp.com/" + td, 'PNG', textPosx + 1, textPosy + 1, 20, 13);
          }
        }
      }
    })

    doc.save('tableau-projets.pdf')

  };



  /////////////////// Boite de dialogue //////////////////
  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '650px',
      data: obj
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Ajouter') {
        this.createTableau(result.data);
      }
      else if (result.event == 'Supprimer') {
        this.deleteTableau(result.data);
      }
    });
  };


  //////////////////// Deconnexion //////////////////////////
  logout(): void {
    this.tokenStorage.signOut();
    this.router.navigate(['/login']);
  };


  /////////////////////// Ajout Projet ////////////////////
  createTableau(data: Tab): void {
    this.service.create(data)
      .subscribe(
        response => {
          // console.log(response);
          this.recupTab()
        },
        error => {
          console.log(error);
        });

  };


  //////////////// Modification des champs /////////////////
  editTab(data: Tab): void {
    data.editing = true;
  };

  doneEditTab(data: Tab): void {

    this.service.update(data.id, data)
      .subscribe(
        response => {
          // console.log(response);
          this.recupTab();
        },
        error => {
          // console.log(error);
        });

    let msg = 'Le projet ' + data.projet + ' à été modifié '

    this._snackBar.open(msg, 'Fermer', {
      duration: 2500,
      horizontalPosition: "center",
      verticalPosition: "bottom",
    });

    data.editing = false;

  };


  //////////////////// Suppression Projet ////////////////////
  deleteTableau(data: Tab) {
    this.service.delete(data.id)
      .subscribe(
        response => {
          // console.log(response);
          this.recupTab();
        },
        error => {
          console.log(error);
        });

  };



  //////////////////// Bar de recherche /////////////////////
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase()
  };


  ///////////////////// Reload ////////////////////////
  recupTab(): void {
    this.service.getAll()
      .subscribe(
        data => {
          if (this.username == 'Consult') {
            this.dataSource.data = data
          }
          else {
            this.dataSource.data = data.filter(item => item.direction === this.username);
          }
          // console.log(this.dataSource.data);
        },
        error => {
          console.log(error);
        });
    
  };


  /////////////////// Scroll /////////////////////
  @HostListener('window:scroll')
  displayScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollPosition >= this.startShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  scroll() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };


};

