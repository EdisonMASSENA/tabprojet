import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';


// import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
// import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// import {MatDatepicker} from '@angular/material/datepicker';
// import * as _moment from 'moment';
// import {default as _rollupMoment, Moment} from 'moment';
// import 'moment/locale/fr';


import { Tab } from "src/app/interface/tab";
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UploadService } from 'src/app/services/upload.service';
import { TableauService } from 'src/app/services/tableau.service';


// const moment = _rollupMoment || _moment;
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
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css'],
  providers: [
    // {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
    // {
    //   provide: DateAdapter,
    //   useClass: MomentDateAdapter,
    //   deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    // },

    // {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class DialogBoxComponent implements OnInit {


  types= [
    {value: 'Technique' },
    {value: 'Numérique' },
    {value: 'Métier' },
    {value: 'Étude' },
    {value: 'Documentation' },
    { value: 'Organisationnel' }
  ];
  action: string;
  local_data: any;
  msg: string;
  moiss: number[] = [];
  annees: number[] = [];
  url = environment.Url;

  
  selectedFiles?: FileList;
  selectedFileNames: string[] = [];

  // progressInfos: any[] = [];
  message: string[] = [];

  docs?: Observable<any>;
  diaFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(private tableauService: TableauService,private uploadService: UploadService, private tokenStorageService: TokenStorageService, private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Tab) { this.local_data = { ...data }; this.action = this.local_data.action;  }

  ngOnInit(): void {


    for (let i = 1; i <= 12; i++) {
      this.moiss.push(i)
    };

    for (let i = 2020; i <= 2075; i++) {
      this.annees.push(i)
    }; 

    this.docs = this.uploadService.getFiles();

  }

  


  doAction() {

    const user = this.tokenStorageService.getUser();
    this.local_data.direction = user.username;

    this.local_data.chef = this.local_data.chef.charAt(0).toUpperCase() + this.local_data.chef.slice(1);
    this.local_data.projet = this.local_data.projet.charAt(0).toUpperCase() + this.local_data.projet.slice(1);
    if (this.local_data.priorite) {
      this.local_data.priorite = this.local_data.priorite.charAt(0).toUpperCase() + this.local_data.priorite.slice(1);
    };

    if (this.local_data.progress == null) {
      this.local_data.progress = 0;
    };

    

    if (this.local_data.action == 'Modifier' && this.local_data.debannee == null && this.local_data.debmois == null  ) {
      this.recupdate(this.local_data.id);
    } else {
      this.local_data.debut = new Date(this.local_data.debannee,this.local_data.debmois,0,0,0,0);
      this.local_data.fin = new Date(this.local_data.finannee,this.local_data.finmois,0,0,0,0);
    }

    this.uploadFiles();
    this.dialogRef.close({ event: this.action, data: this.local_data });

  }



  closeDialog() {
    this.dialogRef.close({ event: 'Annuler' });
  }



  openSnackBar(nom: string, action: string) {

    switch (action) {
      case 'Ajouter': this.msg = 'Le projet ' + nom + ' a été ajouté'

        break;

      case 'Supprimer': this.msg = 'Le projet ' + nom + ' a été supprimé'

        break;

      case 'Modifier': this.msg = 'Le projet ' + nom + ' a été modifié'

      break;

      default: 'Annulé'
        break;
    }

    this._snackBar.open(this.msg,'Fermer', {
      duration: 3000,
      horizontalPosition: "center",
      verticalPosition: "bottom",
    });

  }

  
  selectFiles(event: any): void {
    this.message = [];
    // this.progressInfos = [];
    this.selectedFileNames = [];
    this.selectedFiles = event.target.files;
  

    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {  
        this.selectedFileNames.push(this.selectedFiles[i].name);
      }
    }
  }
  

  uploadFiles(): void {
    this.message = [];
  
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }
  

  upload(idx: number, file: File): void {
    // this.progressInfos[idx] = { value: 0, fileName: file.name };
  
    if (file) {
      this.uploadService.upload(file).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            // this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
            this.docs = this.uploadService.getFiles();
          }
        },
        (err: any) => {
          // this.progressInfos[idx].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        });
    }
  }
  
  

  deleteUp(id) {
    this.uploadService.delete(id)
      .subscribe(
        response => {
          // console.log(response);
          this.docs = this.uploadService.getFiles();
        },
        error => {
          // console.log(error);
        });

  };

  recupdate(id) {
    this.tableauService.getAll()
    .subscribe(
      data => {
        // console.log(response);
        let date = data.filter(item => item.id == id);
        this.local_data.debannee = date[0]['debut'].slice(0,4);
        this.local_data.debmois = date[0]['debut'].slice(5,7);
      },
      error => {
        // console.log(error);
      });
  };


  // date = new FormControl(moment());

  // chosenYearHandler(normalizedYear: Moment) {
  //   const ctrlValue = this.date.value;
  //   ctrlValue.year(normalizedYear.year());
  //   this.date.setValue(ctrlValue);
  // }

  // chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
  //   const ctrlValue = this.date.value;
  //   ctrlValue.month(normalizedMonth.month());
  //   this.date.setValue(ctrlValue);
  //   this.local_data.date = this.date.value;
  //   datepicker.close();
  // }



/////////////////////////////////////////////  


}
