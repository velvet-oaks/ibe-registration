import { Component, Inject, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormControl,
	FormGroup,
	FormGroupDirective,
	NgForm,
	ValidatorFn,
	Validators
} from '@angular/forms';
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogRef,
	MatDialogConfig
} from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { SharedDataService } from '../services/shared-data.service';
import { RegistrationService } from '../services/registration.service';
import { DialogService } from '../services/dialog.service';
import { environment } from 'src/environments/environment';
import { RegistrationForm } from './registrationModel';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RevisedCountryModel } from 'src/app/shared/revisedCountryModel';
import { revisedCountryData } from 'src/app/shared/revisedCountryData';
import { AccountType } from 'src/app/shared/typeModel';
import { accountTypes } from 'src/app/shared/types-data-store';
import { FeedbackModel } from '../shared/feedbackModel';
import { feedbacks } from '../shared/feedbackOptions';
import { CityModel } from 'src/app/shared/cityModel';
import { UsageModel } from 'src/app/shared/usageModel';
import { usageList } from 'src/app/shared/usage-list';

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(
		control: FormControl | null,
		form: FormGroupDirective | NgForm | null
	): boolean {
		const isSubmitted = form && form.submitted;
		return !!(
			control &&
			control.invalid &&
			(control.dirty || control.touched || isSubmitted)
		);
	}
}
@Component({
	selector: 'app-registration',
	templateUrl: './registration.component.html',
	styleUrls: ['./registration.component.scss']
})

// LoginSignupDialogComponent
export class RegistrationComponent implements OnInit, OnChanges {
	// public cities: CityModel[] = cities;
	public feedbacks: FeedbackModel[] = feedbacks;
	public accountTypes: AccountType[] = accountTypes;
	public revisedCountries: RevisedCountryModel[] = revisedCountryData;
	public cityNames: string[] = [];
	public citySearchText: string = '';
	public filteredCities: string[] = [];
	public usageList: UsageModel[] = usageList;
	public data: { type: string } = { type: 'signUp' };
	public signUpForm: FormGroup;
	userEnteredFormValue;

	unqiueUserError: any = false;
	hidePassword: boolean = true;
	hide = true;
	loginType: string = '';
	// private isDialogOpen: boolean = false;
	dialingCodeValue?: any;

	selectedCountry?: RevisedCountryModel;
	disabledDialingCode = true;

	private matchValidator(controlValidationName: string): ValidatorFn {
		return (control: AbstractControl) => {
			const controlValidation = control.root.get(controlValidationName);
			if (!controlValidation) {
				return null;
			}
			return controlValidation.value !== control.value
				? { matchValidator: { value: control.value } }
				: null;
		};
	}

	constructor(
		private sharedDataService: SharedDataService,
		private dialogService: DialogService,
		public registrationService: RegistrationService,
		private fb: FormBuilder,
		public dialog: MatDialog
	) {
		this.signUpForm = this.fb.group({
			// name: ['', [Validators.required]],
			firstName: new FormControl('', [Validators.required]),
			lastName: new FormControl('', [Validators.required]),
			// username: ['', [Validators.required]],
			type: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required, Validators.email]),
			tel_phone: new FormControl('', [
				Validators.required,
				Validators.pattern('[- +()0-9]+')
			]),
			directorKey: new FormControl('', [
				Validators.required,
				Validators.minLength(4)
			]),
			directorKeyConfirm: new FormControl('', [
				Validators.required,
				this.matchValidator('password')
			]),
			country: new FormControl('', [Validators.required]),
			gameCode: new FormControl('', [
				Validators.required,
				Validators.pattern('^[a-zA-Z0-9]*$')
			]),
			dialingCode: new FormControl(''),
			city: new FormControl('', [
				Validators.required,
				Validators.pattern('^[a-zA-Z ]*$')
			]),
			usage: new FormControl('', [Validators.required]),
			comments: new FormControl(''),
			howHeard: new FormControl('', [Validators.required]),
			feedback: new FormControl('', [Validators.required])
		});
		console.log(this.signUpForm);
	}

	// Class Methods

	ngOnInit(): void {
		this.signUpForm
			.get('country')
			.valueChanges.subscribe((selectedCountry: string) => {
				const dialingCode = this.findValueInData<string>(
					selectedCountry,
					this.revisedCountries,
					'name'
				);
				this.signUpForm.get('dialingCode').setValue(dialingCode);
			});

		this.signUpForm
			.get('country')
			.valueChanges.subscribe((selectedCountry: string) => {
				const matchedCountry = this.revisedCountries.find(
					country => country.name === selectedCountry
				);
				if (matchedCountry) {
					this.signUpForm.get('dialingCode').setValue(matchedCountry.dial_code);
				}
			});

		console.log('ORIGIN :', environment.ORIGIN);
	}

	ngOnChanges(changes: SimpleChanges): void {}

	findValueInData<T>(selectedValue: any, dataStore: any[], searchField: string): T {
		const matchedItem = dataStore.find(item => item.name === selectedValue);
		return matchedItem ? matchedItem[searchField] : null;
	}

	filterCities() {
		if (!this.citySearchText && this.citySearchText.length >= 2) {
			this.filteredCities = this.cityNames;

			this.filteredCities = this.cityNames.filter(cityName =>
				cityName.toLowerCase().includes(this.citySearchText.toLowerCase())
			);
		} else {
			this.filteredCities = [];
		}
	}

	toggleVisibility() {
		this.hidePassword = !this.hidePassword;
	}

	matcher = new MyErrorStateMatcher();

	onNoClick(): void {
		this.signUpForm.reset();
	}

	displayConcatNumber() {
		const form = this.signUpForm;
		const dialCode = form.get('dialingCode').value;
		const telNumber = form.get('tel_phone').value;
		const concatNumber = this.concatDialingAndTel(dialCode, telNumber);
		console.log('concatenated Number: ', concatNumber);
	}

	private concatDialingAndTel(dialingCode: string, telNumber: string) {
		return dialingCode + telNumber;
	}

	submitForm() {
		if (this.signUpForm.valid) {
			const formData = { ...this.signUpForm.value };
			console.log(formData);

			// Format the international telephone number

			formData.internationalTelNumber = this.registrationService.formatTelephone(
				formData.dialingCode,
				formData.tel_phone
			);

			// Remove the individual dialingCode and tel_phone proeprties
			delete formData.dialingCode;
			delete formData.tel_phone;

			console.log('formData after mutation: ', formData);
			// attempt to send sign up form to api
			this.registrationService.createRegistration(formData).subscribe({
				next: response => {
					console.log('Success', response);
					const gameCode = response.user.slot;
					this.sharedDataService.updateGameCode(gameCode);
					this.dialogService
						.openDialog('registrationSuccess')
						.afterClosed()
						.subscribe(result => {
							if (result === 'success') {
								this.signUpForm.reset();
							}
						});
				},
				error: error => {
					console.log('Error is:', error);

					this.handleResponseError(error);
				}
			});
			this.signUpForm.markAllAsTouched();
		}
	}

	get isFormInvalid(): boolean {
		return this.signUpForm.invalid;
	}

	// handle response errors

	private handleResponseError(error: any): void {
		if (error.error.slot) {
			const gameCode = error.error.slot;
			const initialValue = { ...this.signUpForm.value };
			this.sharedDataService.updateGameCode(gameCode);
			this.dialogService
				.openDialog('registrationFail_GAMECODE')
				.afterClosed()
				.subscribe(result => {
					if (result === 'fail') {
						this.signUpForm.setValue({ ...initialValue });
					}
				});
		} else {
			const gameCode = '';
			this.sharedDataService.updateGameCode(gameCode);
			this.dialogService
				.openDialog('registrationFail')
				.afterClosed()
				.subscribe(result => {
					if (result === 'success') {
						this.signUpForm.reset();
					}
				});
		}
	}

	// Debug tests

	dialCodeTest() {
		this.registrationService.dialCodeTest();
		console.log(this.signUpForm);
		console.log(this.registrationService.testCounter);
		const formData = { ...this.registrationService.testWithDialCode };
		console.log(formData.tel_phone, formData.dialingCode);
		formData.internationalTelNumber = this.registrationService.formatTelephone(
			formData.dialingCode,
			formData.tel_phone
		);

		// Remove the individual dialingCode and tel_phone proeprties
		delete formData.dialingCode;
		delete formData.tel_phone;

		console.log('formData after mutation: ', formData);

		this.registrationService.createRegistration(formData).subscribe({
			next: response => {
				console.log('Success', response);
				const gameCode = response.user.slot;
				this.sharedDataService.updateGameCode(gameCode);
				this.dialogService
					.openDialog('registrationSuccess')
					.afterClosed()
					.subscribe(result => {
						if (result === 'success') {
							this.signUpForm.reset();
						}
					});
			},
			error: error => {
				console.log('error', error);
				console.log(error.error.slot);
				this.sharedDataService.gameCode$;
				this.handleResponseError(error);
			}
		});

		// this.signUpForm.reset();
	}

	sendTest() {
		console.log(this.signUpForm);

		this.registrationService.gameCodeTest();
		const user = this.registrationService.testRegistration;

		this.registrationService.createRegistration(user).subscribe({
			next: response => {
				console.log('Success', response);
				const gameCode = response.user.slot;
				this.sharedDataService.updateGameCode(gameCode);
				this.dialogService
					.openDialog('registrationSuccess')
					.afterClosed()
					.subscribe(result => {
						console.log('result: ', result);

						if (result === 'success') {
							this.signUpForm.reset();
						}
						if(result === 'fail'){
							console.log('failure');

						}
					});
			},
			error: error => {
				console.log('error', error);
				console.log(error.error.slot);
				this.sharedDataService.gameCode$;
				this.handleResponseError(error);
			}
		});
		// this.signUpForm.reset();
	}

	counter() {
		this.registrationService.incrementCounter();
		console.log('counter value: ', this.registrationService.testCounter);
	}
}
