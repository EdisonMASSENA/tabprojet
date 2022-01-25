import { Component, OnInit, ViewChild, HostListener, NgZone} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common'
// import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
// import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// import {MatDatepicker} from '@angular/material/datepicker';


// import * as _moment from 'moment';
// import {default as _rollupMoment, Moment} from 'moment';
// const moment = _rollupMoment || _moment;


import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';



import { Tab } from "src/app/interface/tab";
import { UploadService } from 'src/app/services/upload.service';
import { TableauService } from "src/app/services/tableau.service";
import { DialogBoxComponent } from 'src/app/components/dialog-box/dialog-box.component';
import { TokenStorageService } from 'src/app/services/token-storage.service';

// import { now } from 'lodash';



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
      transition('expanded <=> collapsed', animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
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
  docs = [];
  fileInfos?: Observable<any>;
  url = environment.Url;
  ndate = new Date;
  date = this.datepipe.transform(this.ndate, 'dd/MM/yyyy');
  msg: any;
  menuAc: boolean;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  

  constructor(private datepipe: DatePipe, private _ngZone: NgZone, private uploadService: UploadService, private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar, private tabservice: TableauService, public dialog: MatDialog, private router: Router, private breakpointObserver: BreakpointObserver) { }


  ngOnInit(): void {

    /////vérification si session déjà connecté////
    this.isLogged();

    /////récupération du tableau/////
    this.recupTab();

    ////// Affichage responsive//////
    this.tabDisplay();

    //////////////////// Bar de recherche filtré par projet ////////////////////////////
    this.dataSource.filterPredicate = function (tab, filter: string): boolean {
      return tab.projet.toLowerCase().includes(filter);
    };

    ///////////////////////// Tri colonne ////////////////////////
    this.dataSource.sort = this.sort;

  }




/////////////////////  Ouverture détail du projet en responsive ///////////////////////


  tabclick(cli) {
    if (this.medium) {
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
      this.menuAc = true;
    };
  };

////////////////// Affichage tableau en responsive ///////////////////

  tabDisplay() {
    this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Small, Breakpoints.HandsetPortrait, Breakpoints.XSmall])
      .subscribe((state: BreakpointState) => {

        if (state.matches) {
          this.medium = true;
          this.displayedColumns = ['projet', 'direction', 'chef', 'etat', 'tendance'];
        }
        else {
          this.medium = false;
          this.displayedColumns = ['projet', 'type', 'direction', 'priorite', 'chef', 'debut', 'fin', 'etat', 'tendance', 'accompli', 'attention', 'enCours', 'action'];
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

      switch (result.event) {
        case 'Ajouter': 
          this.createTableau(result.data);
          this.msg = 'Le projet ' + result.projet + ' a été ajouté';
          break;

        case 'Modifier': 
          this.editTableau(result.data);
          this.msg = 'Le projet ' + result.projet + ' a été modifié'
          break;

        case 'Supprimer': 
          this.deleteTableau(result.data);
          this.msg = 'Le projet ' + result.projet + ' a été supprimé'
          break;

        case 'Upload': 
          setTimeout(() => {
            this.recupTab();
          },2000);
          this.msg = 'Document ajouté'
          this.snackbar(this.msg)
          break;
      
        case 'Annuler': 
          this.msg = 'Action annulée'
          this.snackbar(this.msg)
          break;  

        default :
          break;
      };
    })
  };


  //////////////////// Deconnexion //////////////////////////
  logout(): void {
    this.tokenStorage.signOut();
    this.router.navigate(['']);
    let msg = 'Déconnexion';
    this.snackbar(msg);
  };


  /////////////////////// Ajout Projet ////////////////////
  createTableau(data: Tab): void {
    this.tabservice.create(data)
      .subscribe({
        next: (res) => {
          // console.log(res);
          this.recupTab();
        },
        error: (e) => console.error(e)
      });
  };


  //////////////// Modification des champs /////////////////

  editTableau(data: Tab): void {
    delete data.file;
    this.tabservice.update(data.id, data)
      .subscribe({
        next: (res) => {
          // console.log(res);
          this.recupTab();
        },
        error: (e) => console.error(e)
      });

  };


  //////////////////// Suppression Projet ////////////////////
  deleteTableau(data: Tab) {
    this.tabservice.delete(data.id)
      .subscribe({
        next: (res) => {
          // console.log(res);
          this.recupTab();
        },
        error: (e) => console.error(e)
      });

  };


  deleteUp(id) {
    this.uploadService.delete(id)
      .subscribe({
        next: (res) => {
          // console.log(response);
          this.recupTab();
        },
        error: (e) => console.error(e)
      });
  };


  //////////////////// Bar de recherche /////////////////////
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase()
  };


  ///////////////////// Data Tableau ////////////////////////
  recupTab(): void {
    this.tabservice.getAll()
      .subscribe({
        next: (data) => {
          if (this.username == 'Consultation') {
            this.dataSource.data = data
          }
          else {
            this.dataSource.data = data.filter(item => item.direction === this.username);
          };
        },
        error: (e) => console.error(e)
      });
  };

  /////////// not in prod ////////////////

  // recupFile(): void {
  //   this.uploadService.getFiles()
  //     .subscribe({
  //       next: (files) => {
  //         this.docs = files;
  //         // console.log(this.docs);
  //       },
  //       error: (e) => console.error(e)
  //     });
  // };

  //////////////////////////////////////


  //////////////// Tableau en PDF (npm: jsPDF autotable) /////////////////
  downloadPdf() {
    let url = location.origin + '/';

    let prepare = [];
    this.dataSource.data.forEach(e => {
      let pdfData = [];
      pdfData.push(e.chef);
      pdfData.push(e.direction);
      pdfData.push(e.priorite);
      pdfData.push(e.projet + '  (' + e.type + ')');
      pdfData.push(this.datepipe.transform(e.debut, 'MM/yyyy'));
      pdfData.push(this.datepipe.transform(e.fin, 'MM/yyyy'));
      pdfData.push(e.progress + '%');
      pdfData.push(e.etat);
      pdfData.push(e.tendance);
      pdfData.push(e.accompli);
      pdfData.push(e.attention);
      pdfData.push(e.encours);
      prepare.push(pdfData);
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
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 25 },
        7: { cellWidth: 21, minCellHeight: 15, textColor: 255 },
        8: { cellWidth: 21, minCellHeight: 15, textColor: 255 },
        9: { cellWidth: 65 },
        10: { cellWidth: 65 },
        11: { cellWidth: 60 }
      },
      rowPageBreak: 'avoid',
      theme: "striped",
      head: [['Chef de projet', 'Direction', 'Priorité', 'Projet', 'Début', 'Fin prévue', 'Avancement', 'État', 'Tendance', 'Travaux faits', 'Points d\'attention', 'Travaux en cours / à venir ']],
      body: prepare,
      didDrawCell: function (data) {
        if (data.column.index === 7 && data.cell.section === 'body') {
          let td = data.cell.raw;
          let textPosx = data.cell.x;
          let textPosy = data.cell.y;
          if (td !== null) {
            doc.addImage(url + td, 'png', textPosx + 0.5, textPosy + 0.5, 20, 14);
          }
        }
        if (data.column.index === 8 && data.cell.section === 'body') {
          let td = data.cell.raw;
          let textPosx = data.cell.x;
          let textPosy = data.cell.y;
          if (td !== null) {
            doc.addImage(url + td, 'png', textPosx + 1, textPosy + 1, 20, 13);
          }
        }
      }
    })

    doc.save('Tableau-Projets '+ this.date +'.pdf')

  };





  ///////////////////// Tableau Excel ////////////////// 

  downloadExcel(): void {

    
    let dataExcel = [];

    this.dataSource.data.forEach(e => {
      let excelData = [];
      let etat : String;
      let tendance : String;

      excelData.push(e.chef);
      excelData.push(e.direction);
      excelData.push(e.priorite);
      excelData.push(e.projet + '  (' + e.type + ')');
      excelData.push(e.progress + '%');
      excelData.push(this.datepipe.transform(e.debut, 'MM/yyyy'));
      excelData.push(this.datepipe.transform(e.fin, 'MM/yyyy'));
      switch (e.etat) {
        case 'assets/1.png':
         etat = 'Soleil';
          break;

        case 'assets/2.png':
         etat = 'Éclaircie'
          break;

        case 'assets/3.png':
         etat = 'Nuage'
          break;

        case 'assets/4.png':
         etat = 'Pluie'
          break;

        default:
          break;
      }
      excelData.push(etat);
      switch (e.tendance) {
        case 'assets/a.png':
         tendance = 'Bonne';
          break;

        case 'assets/b.png':
         tendance = 'Moyenne'
          break;

        case 'assets/c.png':
         tendance = 'Mauvaise'
          break;

        default:
          break;
      }
      excelData.push(tendance);
      excelData.push(e.accompli);
      excelData.push(e.attention);
      excelData.push(e.encours);
      dataExcel.push(excelData);
    });

    const rename = dataExcel.map(({
      0: Chef,
      1: Direction,
      2: Priorité,
      3: Projet,
      4: Avancement,
      5: Début,
      6: Fin,
      7: État,
      8: Tendance,
      9: Accompli,
      10: Attention,
      11: Encours
      
    }) => ({
      Chef,
      Direction,
      Priorité,
      Projet,
      Avancement,
      Début,
      Fin,
      État,
      Tendance,
      Accompli,
      Attention,
      Encours      
    }));

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rename);
    

    let wscols = [
      {wch:15},
      {wch:8},
      {wch:6},
      {wch:30},
      {wch:12},
      {wch:8},
      {wch:8},
      {wch:10},
      {wch:10},
      {wch:35},
      {wch:35},
      {wch:35},
    ];

    ws['!cols'] = wscols;

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Projets1');

    /* save to file */
    XLSX.writeFile(wb, 'Suivi de projet '+ this.date +'.xlsx');
  }





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


/////////////////// Sidenav Tri ////////////////////

tri(tri){
  this.tabservice.getAll()
      .subscribe({
        next: (data) => {
          switch (tri) {
            case 'assets/1.png': case 'assets/2.png': case 'assets/3.png': case 'assets/4.png':
              this.dataSource.data = data.filter(item => item.etat === tri);
              break;
         
            case 'assets/a.png': case 'assets/b.png': case 'assets/c.png':
              this.dataSource.data = data.filter(item => item.tendance === tri);
              break;
         
            default:
              this.recupTab();
              break;
          }
        },
        error: (e) => console.error(e)
      });
}


  ////////////////END/////////////////


};

