import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class RegistrationService implements OnInit {
	private testTel: string = '01245445445';
	private testDialCode: string = '+44';
	private formattedTel: string = this.formatTelephone(
		this.testDialCode,
		this.testTel
	);

	public testRegistration = {
		firstName: 'Jack',
		lastName: 'Shelford',
		type: 'bexbronze',
		email: 'robert.shelford@googlemail.com',
		internationalTelNumber: this.formatTelephone(this.testDialCode, this.testTel),
		directorKey: '',
		gameCode: 'dfdfsdfhdfshdfshdf',
		country: 'United Kingdom',
		city: 'London',
		usage: 'personal',
		howHeard: 'test',
		feedback: 'Yes, publish',
		comments: 'this is a new comment to test'
	};

	public testWithDialCode: {
		firstName: string;
		lastName: string;
		type: string;
		email: string;
		internationalTelNumber?: string;
		dialingCode: string;
		tel_phone: string;
		directorKey: string;
		gameCode: string;
		country: string;
		city: string;
		usage: string;
		howHeard: string;
		feedback: string;
		comments: string;
	} = {
		firstName: 'Jack',
		lastName: 'Shelford',
		type: 'bexbronze',
		email: 'robert.shelford@googlemail.com',
		dialingCode: '+44',
		tel_phone: '01245455455',
		directorKey: '',
		gameCode: 'InternationalNumber',
		country: 'United Kingdom',
		city: 'London',
		usage: 'personal',
		howHeard: 'test',
		feedback: 'Yes, publish',
		comments: 'this is a new comment to test'
	};

	public testCounter: number = 0;

	constructor(private http: HttpClient) {}

	concatTelNumber(dialingCode: string, telNumber: string) {}

	ngOnInit(): void {
		console.log('API_URL: ', environment.API_URL);
		console.log('test formatted international number: ', this.formattedTel);
		if (this.testCounter > 0) {
			this.testCounter++;
		} else {
			this.testCounter;
		}
		this.testRegistration.gameCode = `newTest_00${this.testCounter}`;
		console.log(this.testRegistration.gameCode);
	}

	public formatTelephone(dialingCode: string, telNumber: string): string {
		dialingCode = dialingCode.replace(/^0+/, '');
		telNumber = telNumber.replace(/^0+/, '');

		// Handle Argentina Numbers - add 9 between country code and number, and remove
		// initial '15' from number

		if (dialingCode === '+54') {
			telNumber = telNumber.replace(/^15/, '');
			telNumber = '9' + telNumber;
		} else if (dialingCode === '+52') {
			telNumber = telNumber.replace(/^\+?52/, '+521');
		}
		// format the whole number
		const formattedNumber = `${dialingCode}${telNumber}`;
		return formattedNumber;
	}

	public gameCodeTest(): void {
		if (this.testCounter >= 0) {
			this.testCounter++;
		}
		this.testRegistration.gameCode = `test_code_00${this.testCounter}`;
		console.log(`test game code is ${this.testRegistration.gameCode}`);
	}

	// Creater User
	createRegistration(formData: any): Observable<any> {
		const registrationData = formData;
		console.log(registrationData);

		// const dialingCode = formData.value.dial_code;
		// const telNumber = formData.value.tel_phone;
		// const internationalTelNumber = this.formatTelephone(dialingCode, telNumber);

		// let newRegistration = {
		// 	firstName: formData.value.first_name,
		// 	lastName: formData.value.last_name,
		// 	type: formData.value.type,
		// 	email: formData.value.email,
		// 	internationalTelNumber: internationalTelNumber,
		// 	directorKey: formData.value.password,
		// 	gameCode: formData.value.slot,
		// 	country: formData.value.country,
		// 	city: formData.value.city,
		// 	usage: formData.value.usage,
		// 	howHeard: formData.value.howHeard,
		// 	feedback: formData.value.feedback,
		// 	comments: formData.value.comments
		// };
		return this.http.post<{ message: string; err: any; registeredUser: any }>(
			environment.API_URL + '/register',
			// newRegistration
			registrationData
		);
	}
}
