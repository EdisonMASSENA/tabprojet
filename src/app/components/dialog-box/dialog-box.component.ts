import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
// import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
// import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// import {MatDatepicker} from '@angular/material/datepicker';


// import * as _moment from 'moment';
// import {default as _rollupMoment, Moment} from 'moment';
// const moment = _rollupMoment || _moment;


import { Tab } from "src/app/interface/tab";
import { TokenStorageService } from 'src/app/services/token-storage.service';



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
  //   {
  //     provide: DateAdapter,
  //     useClass: MomentDateAdapter,
  //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  //   },

  //   {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class DialogBoxComponent {

  
  types= [
    {value: 'Technique' },
    {value: 'Numérique' },
    {value: 'Métier' },
    {value: 'Étude' },
    {value: 'Documentation' },
  ];
  action: string;
  local_data: any;
  msg: string;
  moiss: number[] = [];
  annees: number[] = [];
  // date = new FormControl(moment().toISOString);

  constructor(private tokenStorageService: TokenStorageService, private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Tab) { this.local_data = { ...data }; this.action = this.local_data.action; 
    for (let i = 1; i <= 12; i++) {
      this.moiss.push(i);
    }
    for (let i = 2020; i <= 2075; i++) {
      this.annees.push(i);
    } }

// this.local_data.date = this.date

  diaFormControl = new FormControl('', [
    Validators.required
  ]);

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

  doAction() {
    const user = this.tokenStorageService.getUser();
    this.local_data.chef = this.local_data.chef.charAt(0).toUpperCase() + this.local_data.chef.slice(1);
    this.local_data.priorite = this.local_data.priorite.charAt(0).toUpperCase() + this.local_data.priorite.slice(1);
    this.local_data.projet = this.local_data.projet.charAt(0).toUpperCase() + this.local_data.projet.slice(1);
    this.local_data.direction = user.username;
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

      default: 'Annulé'
        break;
    }

    this._snackBar.open(this.msg,'Fermer', {
      duration: 3000,
      horizontalPosition: "center",
      verticalPosition: "bottom",
    });

  }

/////////////////////////////////////////////  


}
