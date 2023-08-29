import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DemoMaterialModule } from 'src/material.module';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from './general-components/dialog/dialog.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogModule } from '@angular/cdk/dialog';

@NgModule({
	declarations: [AppComponent, RegistrationComponent, DialogComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		DemoMaterialModule,
		HttpClientModule,
		ReactiveFormsModule,
		DialogModule,
		MatDialogModule
	],
	providers: [
		{ provide: MatDialogModule, useValue: {} },
		{ provide: MatDialogRef, useValue: {} }
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
