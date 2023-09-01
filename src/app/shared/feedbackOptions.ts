import { FeedbackModel } from './feedbackModel';

export const feedbacks: FeedbackModel[] = [
	{
		message:
			'YES, I am happy for you to publish my feedback in written endorsements',
		value: '1'
	},
	{ message: 'I will not give feedback and do not wish to be asked', value: 'No' },
	{ message: 'YES, I will rate the app in the App stores', value: '2' },
	{
		message:
			'YES. I love the App and will be happy to help get the word out to bridge players',
		value: '3'
	},
	{
		message:
			'I’m not sure please include me in research, but give me the chance to unsubscribe',
		value: '4'
	},
	{
		message:
			'YES, I am willing to be contacted for feedback on my usage of IBEScore',
		value: '5'
	}
];
