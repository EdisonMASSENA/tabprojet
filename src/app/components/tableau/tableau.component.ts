import { Component, OnInit, ViewChild, HostListener, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
// import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
// import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// import {MatDatepicker} from '@angular/material/datepicker';

import { take } from 'rxjs/operators';

// import * as _moment from 'moment';
// import {default as _rollupMoment, Moment} from 'moment';
// const moment = _rollupMoment || _moment;


import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'


import { Tab } from "src/app/interface/tab";
import { TableauService } from "src/app/services/tableau.service";
import { DialogBoxComponent } from 'src/app/components/dialog-box/dialog-box.component';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Observable } from 'rxjs';



/////////// Datepicker format ////////////
// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'MM/YYYY',
//   },
//   display: {
//     dateInput: 'MM/YYYY',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };



@Component({
  selector: 'app-tableau',
  templateUrl: './tableau.component.html',
  styleUrls: ['./tableau.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [
    // {
    //   provide: DateAdapter,
    //   useClass: MomentDateAdapter,
    //   deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    // },

    // {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})


export class TableauComponent implements OnInit {


  // date = new FormControl(moment());
  username: string;
  isLoggedIn = false;
  tabs: Tab[];
  consult: boolean;
  isShow: boolean;
  startShowing = 100;
  medium: boolean;
  displayedColumns: string[];
  expandedElement: Tab | null;
  dataSource = new MatTableDataSource<Tab>();
  editBlock: boolean;
  types = [
    { value: 'Technique', disp: 'Technique' },
    { value: 'Numérique', disp: 'Numérique' },
    { value: 'Métier', disp: 'Métier' },
    { value: 'Étude', disp: 'Étude' },
    { value: 'Documentation', disp: 'Documentation' },
  ];
  moiss: number[] = [];
  annees: number[] = [];


  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private _ngZone: NgZone, private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar, private service: TableauService, public dialog: MatDialog, private router: Router, private breakpointObserver: BreakpointObserver) { }


  ngOnInit(): void {

    for (let i = 1; i <= 12; i++) {
      this.moiss.push(i);
    }
    for (let i = 2020; i <= 2075; i++) {
      this.annees.push(i);
    }

    /////vérification si session déjà connecté////
    this.isLogged();

    /////récupération du tableau/////
    this.recupTab();

    //////////////////// Bar de recherche filtré par projet ////////////////////////////
    this.dataSource.filterPredicate = function (tab, filter: string): boolean {
      return tab.projet.toLowerCase().includes(filter);
    };

    ///////////////////////// Tri colonne ////////////////////////
    this.dataSource.sort = this.sort;

    ////// Affichage responsive//////
    this.tabDisplay();


  }




/////////////////////  Ouverture détail du projet en responsive ///////////////////////
// sécurité pour ne pas fermer les details pendant la modification --> editBlock

  tabclick(cli) {
    if (this.medium && !this.editBlock) {
      if (this.expandedElement === cli) {
        this.expandedElement = null;
      }
      else {
        this.expandedElement = cli;
      }
    }
  };

////////////////// Vérification si connecté et si en tant que consult ////////////////////

  isLogged() {
    this.isLoggedIn = !!this.tokenStorage.getToken();
    if (this.isLoggedIn) {

      const user = this.tokenStorage.getUser();
      this.username = user.username;
    };
    if (this.username == 'Consultation') {
      this.consult = true;
    };
  };

////////////////// Affichage tableau en responsive ///////////////////

  tabDisplay() {
    this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Small, Breakpoints.HandsetPortrait, Breakpoints.XSmall])
      .subscribe((state: BreakpointState) => {

        if (state.matches) {
          this.medium = true;
          this.displayedColumns = ['chef', 'direction', 'projet', 'etat', 'tendance'];
        }
        else if (this.consult) {
          this.medium = false;
          this.displayedColumns = ['chef', 'direction', 'priorite', 'projet', 'date', 'etat', 'tendance', 'accompli', 'attention', 'enCours'];
        }
        else {
          this.medium = false;
          this.displayedColumns = ['chef', 'direction', 'priorite', 'projet', 'date', 'etat', 'tendance', 'accompli', 'attention', 'enCours', 'action'];
        }
      });
  };


  /////////////////// Boite de dialogue add et delete //////////////////
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
      else if (result.event == 'Annuler') {
        let msg = 'Action annulée'
        this.snackbar(msg)
      }
    });
  };


  //////////////////// Deconnexion //////////////////////////
  logout(): void {
    this.tokenStorage.signOut();
    this.router.navigate(['/login']);
    let msg = 'Déconnexion';
    this.snackbar(msg);
  };


  /////////////////////// Ajout Projet ////////////////////
  createTableau(data: Tab): void {

    // data.date = data.mois + '/' + data.annee;

    this.service.create(data)
      .subscribe(
        response => {
          // console.log(response);
          this.recupTab()
        },
        error => {
          // console.log(error);
        });

  };


  //////////////// Modification des champs /////////////////
  editTab(data: Tab): void {
    data.editing = true;
    this.editBlock = true;
  };

  doneEditTab(data: Tab): void {
    this.service.update(data.id, data)
      .subscribe(
        response => {
          this.recupTab();
        },
        error => {
          // console.log(error);
        });

    let msg = 'Le projet ' + data.projet + ' a été modifié'
    this.snackbar(msg)

    data.editing = false;
    this.editBlock = false;

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
          // console.log(error);
        });

    this.editBlock = false;

  };



  //////////////////// Bar de recherche /////////////////////
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase()
  };


  ///////////////////// Data Tableau ////////////////////////
  recupTab(): void {
    this.service.getAll()
      .subscribe(
        data => {
          if (this.username == 'Consultation') {
            this.dataSource.data = data
          }
          else {
            this.dataSource.data = data.filter(item => item.direction === this.username);
          }
        },
        error => {
          // console.log(error);
        });

  };

  //////////////// Tableau en PDF (npm: jsPDF autotable) /////////////////
  downloadPdf() {
    let url = location.origin + '/';

    let prepare = [];
    this.dataSource.data.forEach(e => {
      let tempObj = [];
      tempObj.push(e.chef);
      tempObj.push(e.direction);
      tempObj.push(e.priorite);
      tempObj.push(e.projet);
      tempObj.push(e.mois + '/' + e.annee);
      tempObj.push(e.etat);
      tempObj.push(e.tendance);
      tempObj.push(e.accompli);
      tempObj.push(e.attention);
      tempObj.push(e.encours);
      prepare.push(tempObj);
    });

    const doc = new jsPDF('l', 'mm', 'a3')
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
        3: { cellWidth: 35 },
        4: { cellWidth: 30 },
        5: { cellWidth: 21, minCellHeight: 15, textColor: 255 },
        6: { cellWidth: 21, minCellHeight: 15, textColor: 255 },
        7: { cellWidth: 70 },
        8: { cellWidth: 70 },
        9: { cellWidth: 70 },
      },
      theme: "grid",
      head: [['Chef de projet', 'Direction', 'Priorité', 'Projet', 'Fin prévue', 'État', 'Tendance', 'Travaux faits', 'Points d\'attention', 'Travaux en cours / à venir ']],
      body: prepare,
      didDrawCell: function (data) {
        if (data.column.index === 5 && data.cell.section === 'body') {
          let td = data.cell.raw;
          let textPosx = data.cell.x;
          let textPosy = data.cell.y;
          if (td !== null) {
            doc.addImage(url + td, 'png', textPosx + 0.5, textPosy + 0.5, 20, 14);
          }
        }
        if (data.column.index === 6 && data.cell.section === 'body') {
          let td = data.cell.raw;
          let textPosx = data.cell.x;
          let textPosy = data.cell.y;
          if (td !== null) {
            doc.addImage(url + td, 'png', textPosx + 1, textPosy + 1, 20, 13);
          }
        }
      }
    })

    doc.save('Tableau-Projets.pdf')

  };

  /////////////////// Scroll vers le haut click bouton /////////////////////
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



  /////////////////// Snackbar //////////////////////

  snackbar(msg) {
    this._snackBar.open(msg, 'Fermer', {
      duration: 3000,
      horizontalPosition: "center",
      verticalPosition: "bottom",
    });
  };


  //////////////////// Datepicker ////////////////////////////

  // chosenYearHandler(normalizedYear: Moment) {
  //   const ctrlValue = this.date.value;
  //   ctrlValue.year(normalizedYear.year());
  //   this.date.setValue(ctrlValue);
  // }

  // chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
  //   const ctrlValue = this.date.value;
  //   ctrlValue.month(normalizedMonth.month());
  //   this.date.setValue(ctrlValue);
  //   datepicker.close();
  // }

  ///////////////// Autosize Textarea ////////////////////

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  };


  /////////////////////////////////




};

