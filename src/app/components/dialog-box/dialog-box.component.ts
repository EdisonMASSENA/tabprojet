import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
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
    {value: 'Organisationnel' }
  ];
  action: string;
  local_data: any;
  moiss: number[] = [];
  annees: number[] = [];
  url = environment.Url;
  user: any;
  
  message = '';
  progress = 0;
  currentFile?: File;
  fileName = 'Ajouter documents';
  modif = false;

  diaFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(private tabService: TableauService, private uploadService: UploadService, private tokenStorageService: TokenStorageService, public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Tab) { this.local_data = { ...data }; this.action = this.local_data.action;  }

  ngOnInit(): void {


    for (let i = 1; i <= 12; i++) {
      this.moiss.push(i)
    };

    for (let i = 2020; i <= 2075; i++) {
      this.annees.push(i)
    }; 

    this.user = this.tokenStorageService.getUser();
    this.local_data.direction = this.user.username;

  }

  


  doAction() {

    if (this.local_data.action == 'Modifier' || this.local_data.action == 'Ajouter' && this.local_data.chef ) {
      this.local_data.chef = this.local_data.chef.charAt(0).toUpperCase() + this.local_data.chef.slice(1);
    }

    if (this.local_data.action == 'Modifier' || this.local_data.action == 'Ajouter' && this.local_data.projet ) {
      this.local_data.projet = this.local_data.projet.charAt(0).toUpperCase() + this.local_data.projet.slice(1);
    }

    if (this.local_data.action == 'Modifier' || this.local_data.action == 'Ajouter' && this.local_data.priorite) {
      this.local_data.priorite = this.local_data.priorite.charAt(0).toUpperCase() + this.local_data.priorite.slice(1);
    };

    if (!this.local_data.progress && this.local_data.action == 'Ajouter') {
      this.local_data.progress = 0;
    };

    
    if (this.local_data.action == 'Modifier' && this.local_data.debannee == null && this.local_data.debmois == null) {
      this.recupdate(this.local_data.id);
    } else {
      this.local_data.debut = new Date(this.local_data.debannee,this.local_data.debmois,0,0,0,0);
    }

    if (this.local_data.action == 'Modifier' &&  this.local_data.finannee == null && this.local_data.finmois == null) {
      this.recupdate(this.local_data.id);
    } else {
      this.local_data.fin = new Date(this.local_data.finannee,this.local_data.finmois,0,0,0,0);
    }

    this.dialogRef.close({ event: this.action, data: this.local_data });

  }



  closeDialog() {
    this.dialogRef.close({ event: 'Annuler' });
  }


  recupdate(id) {
    this.tabService.getAll()
    .subscribe({
      next: (data) => {
        // console.log(response);
        let date = data.filter(item => item.id == id);
        if (date[0]['debut'] !== null) {
          this.local_data.debannee = date[0]['debut'].slice(0,4);
          this.local_data.debmois = date[0]['debut'].slice(5,7);
        };
        if (date[0]['fin'] !== null) {
          this.local_data.finannee = date[0]['fin'].slice(0,4);
          this.local_data.finmois = date[0]['fin'].slice(5,7);
        };
      },
      error: (e) => console.error(e)
    });
  };


  ///////////////// Upload /////////////////////

  selectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.fileName = this.currentFile.name;
    } else {
      this.fileName = 'Ajouter documents';
    }
  }  

  upload(id): void {
  
    this.progress = 0;
    this.message = "";

    if (this.currentFile) {

      this.uploadService.upload(this.currentFile, id).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
            this.recupFile(id);
            this.modif = true;
          }
        },
        error: (err: any) => {
          console.log(err);
          this.progress = 0;

          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Could not upload the file!';
          }

          this.currentFile = undefined;
        }
      });
    }
  };

  
  deleteUp(id,tabid) {
    this.uploadService.delete(id)
      .subscribe({
        next: (res) => {
          // console.log(response);
          this.recupFile(tabid);
          this.modif = true;
        },
        error: (e) => console.error(e)
      });
  };


 /////////// refresh fichier après modif ////////////////

  recupFile(id): void {
    this.uploadService.getFiles(id)
      .subscribe({
        next: (files) => {
          this.local_data.file = files;
        },
        error: (e) => console.error(e)
      });
  };

  ///////////////////////////////////////////


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



//////////////////// END /////////////////////////  


}
