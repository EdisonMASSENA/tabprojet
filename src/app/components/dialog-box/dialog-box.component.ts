import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Tab } from "src/app/interface/tab";
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { FormControl, Validators } from '@angular/forms';




@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})

export class DialogBoxComponent {

  action: string;
  local_data: any;
  msg: string;

  constructor(private tokenStorageService: TokenStorageService, private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Tab) { this.local_data = { ...data }; this.action = this.local_data.action;  }


  diaFormControl = new FormControl('', [
    Validators.required
  ]);

  doAction() {
    const user = this.tokenStorageService.getUser();
    this.local_data.chef = this.local_data.chef.charAt(0).toUpperCase() + this.local_data.chef.slice(1);
    this.local_data.priorite = this.local_data.priorite.charAt(0).toUpperCase() + this.local_data.priorite.slice(1);
    this.local_data.projet = this.local_data.projet.charAt(0).toUpperCase() + this.local_data.projet.slice(1);
    this.local_data.direction = user.username;
    this.dialogRef.close({ event: this.action, data: this.local_data });
    this.dialogRef.backdropClick().subscribe(()=> this.closeDialog);
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Annuler' });
  }

  openSnackBar(nom: string, action: string) {

    switch (action) {
      case 'Ajouter': this.msg = 'Le projet ' + nom + ' à été ajouté'

        break;

      case 'Supprimer': this.msg = 'Le projet ' + nom + ' à été supprimé'

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
