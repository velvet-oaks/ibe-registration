import { DialogModel } from './dialogMessageModel';

export const dialogData: DialogModel[] = [
	// {dialog: 'registrationSuccess', title: 'SUCCESS', message: , width: '400px'}
	{
		dialogName: 'registrationSuccess',
		width: '400px',
		data: {
			title: 'SUCCESS',
			message:
				'GAME CODE successfully created. You will receive an Email to the Email address provided with your account details'
		}
	},
	{
		dialogName: 'registrationFail',
		width: '400px',
		data: {
			title: 'REGISTRATION FAILED',
			message:
				'It seems there has been an error registering. Please try again or contact..'
		}
	}
];
