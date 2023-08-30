import {
	Component,
	Inject,
	OnInit,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RegistrationComponent } from 'src/app/registration/registration.component';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
	selector: 'app-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
	@ViewChild('registationComponent', { read: ViewContainerRef })
	registrationContainer: ViewContainerRef;

	constructor(
		public dialogRef: MatDialogRef<DialogComponent>,
		private dialog: MatDialog,

		private dialogService: DialogService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnInit(): void {}

	openRegistrationDialog(): void {
		const dialogRef = this.dialog.open(RegistrationComponent, {
			width: '60vw',
			data: this.data
		});
	}
	emitSuccess(): void {
		this.dialogRef.close('success');
	}

	onClose(): void {
		this.dialogRef.close();
	}

	closeAllDialogs(): void {
		this.dialog.closeAll();
	}
}
