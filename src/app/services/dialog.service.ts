import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

@Injectable({
	providedIn: 'root'
})
export class DialogService {
	constructor(
		private dialog: MatDialog,
		private dialogRef: MatDialogRef<any> | null = null
	) {}

	openDialog(component: any, dialogConfig: MatDialogConfig): MatDialogRef<any> {
		this.dialogRef = this.dialog.open(component, dialogConfig);
		return this.dialogRef;
	}

	closeDialog(): void {
		if (this.dialogRef) {
			this.dialogRef.close();
			this.dialogRef = null;
		}
	}
}
