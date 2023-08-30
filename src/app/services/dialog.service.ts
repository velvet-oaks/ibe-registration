import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { DialogModel } from '../shared/dialogMessageModel';
import { dialogData } from '../shared/dialog-messages-data';
import { DialogComponent } from '../general-components/dialog/dialog.component';

@Injectable({
	providedIn: 'root'
})
export class DialogService {
	public dialogs: DialogModel[] = dialogData;
	constructor(
		private dialog: MatDialog,
		private dialogRef: MatDialogRef<any> | null = null
	) {}

	findDialog(name: string): DialogModel | undefined {
		return this.dialogs.find(dialog => dialog.dialogName === name);
	}

	openDialog(dialogName: string): MatDialogRef<any> | undefined {
		const dialogConfig = this.findDialog(dialogName);
		let matDialogConfig: MatDialogConfig | undefined;

		if (dialogConfig) {
			matDialogConfig = {
				width: dialogConfig.width,
				data: dialogConfig.data
			};
		}
		if (matDialogConfig) {
			this.dialogRef = this.dialog.open(DialogComponent, matDialogConfig);
			return this.dialogRef;
		}
		return undefined;
	}

	closeDialog(): void {
		if (this.dialogRef) {
			this.dialogRef.close();
			this.dialogRef = null;
		}
	}
}
