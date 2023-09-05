import { Injectable, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { SharedDataService } from './shared-data.service';
import { DialogModel } from '../shared/dialogMessageModel';
import { dialogData } from '../shared/dialog-messages-data';
import { DialogComponent } from '../general-components/dialog/dialog.component';

@Injectable({
	providedIn: 'root'
})
export class DialogService implements OnInit {
	public dialogs: DialogModel[] = dialogData;
	public gameCode: string;
	constructor(
		private sharedDataService: SharedDataService,
		private dialog: MatDialog,
		private dialogRef: MatDialogRef<any> | null = null
	) {}

	ngOnInit(): void {
		this.sharedDataService.gameCode$.subscribe(gameCodeObservable => {
			console.log('Dialog Service Game Code Observable: ', gameCodeObservable);
			this.gameCode = gameCodeObservable;
		});
		console.log('Game Code: ', this.gameCode);
	}

	findAndManipulateDialog(name: string): DialogModel | undefined {
		const dialogConfig = this.dialogs.find(dialog => dialog.dialogName === name);

		if (dialogConfig) {
			this.sharedDataService.gameCode$.subscribe(gameCode => {
				dialogConfig.data.gameCode = gameCode;
				console.log('Dialog Config gameCode: ', gameCode);
			});
			return dialogConfig;
		}
		return undefined;
	}

	findDialog(name: string): DialogModel | undefined {
		return this.dialogs.find(dialog => dialog.dialogName === name);
	}

	openDialog(dialogName: string): MatDialogRef<any> | undefined {
		this.sharedDataService.gameCode$.subscribe(gamecode => {
			this.gameCode = gamecode;
			console.log('openDialog Service Game Code: ', this.gameCode);
		});
		const dialogConfig = this.findAndManipulateDialog(dialogName);
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
