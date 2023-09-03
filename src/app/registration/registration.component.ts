import { Component, Inject, OnInit } from '@angular/core';
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
export class RegistrationComponent implements OnInit {
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

	// types = ['bexbronze', 'bexsilver', 'bexgold', ''];
	unqiueUserError: any = false;
	hidePassword: boolean = true;
	hide = true;
	loginType: string = '';
	private isDialogOpen: boolean = false;
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
		private dialogService: DialogService,
		private registrationService: RegistrationService,
		private fb: FormBuilder,
		public dialog: MatDialog
	) {
		this.signUpForm = this.fb.group({
			// name: ['', [Validators.required]],
			first_name: new FormControl('', [Validators.required]),
			last_name: new FormControl('', [Validators.required]),
			// username: ['', [Validators.required]],
			type: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required, Validators.email]),
			tel_phone: new FormControl('', [
				Validators.required,
				Validators.pattern('[- +()0-9]+')
			]),
			password: new FormControl('', [Validators.required, Validators.minLength(4)]),
			password_confirm: new FormControl('', [
				Validators.required,
				this.matchValidator('password')
			]),
			country: new FormControl('', [Validators.required]),
			gameCode: new FormControl('', [Validators.pattern('^[a-zA-Z0-9]*$')]),
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

	// selectedTab: string = 'slot';

	// slotForm = this.fb.group({
	// 	slot: ['', [Validators.required]],
	// 	password: ['', [Validators.required]]
	// });
	// usernameForm = this.fb.group({
	// 	user_name: ['', [Validators.required]],
	// 	password: ['', [Validators.required]]
	// });

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
			const formData = this.signUpForm.value;

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
			this.registrationService
				.createRegistration(formData)
				.subscribe(responseData => {
					if (responseData.err) {
						console.log('Error: ', responseData.err);
						this.dialogService
							.openDialog('registrationFail')
							.afterClosed()
							.subscribe(result => {
								if (result === 'success') {
									this.signUpForm.reset();
								}
							});
					} else {
						this.dialogService
							.openDialog('registrationSuccess')
							.afterClosed()
							.subscribe(result => {
								if (result === 'success') {
									this.signUpForm.reset();
								}
							});
					}
				});
			this.signUpForm.markAllAsTouched();
		}
	}

	get isFormInvalid(): boolean {
		return this.signUpForm.invalid;
	}

	sendTest() {
		console.log(this.signUpForm);

		this.registrationService.gameCodeTest();
		const user = this.registrationService.testRegistration;

		this.registrationService.createRegistration(user).subscribe(response => {
			if (response.err) {
				console.log('error registering user with api', response.err);
			} else {
				console.log('Success sendign to api');
			}
		});
	}
	dialCodeTest() {
		console.log(this.signUpForm);

		this.registrationService.gameCodeTest();
		let formData = this.registrationService.testWithDialCode;

		formData.internationalTelNumber = this.registrationService.formatTelephone(
			formData.dialingCode,
			formData.tel_phone
		);

		// Remove the individual dialingCode and tel_phone proeprties
		delete formData.dialingCode;
		delete formData.tel_phone;

		console.log('formData after mutation: ', formData);

		this.registrationService.createRegistration(formData).subscribe(response => {
			if (response.err) {
				console.log('error registering user with api', response.err);
			} else {
				console.log('Success sendign to api');
			}
		});
	}
}
