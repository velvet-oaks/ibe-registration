import { FeedbackModel } from './feedbackModel';

export const feedbacks: FeedbackModel[] = [
	{
		message:
			'YES, I am happy for you to publish my feedback in written endorsements',
		value: 'Yes, publish'
	},
	{ message: 'I will not give feedback and do not wish to be asked', value: 'No' },
	{ message: 'YES, I will rate the app in the App stores', value: 'Yes, rate app' },
	{
		message:
			'YES. I love the App and will be happy to help get the word out to bridge players',
		value: 'Yes, spread word'
	},
	{
		message:
			'I’m not sure please include me in research, but give me the chance to unsubscribe',
		value: 'Unsure, research, unsubscribe maybe'
	},
	{
		message:
			'YES, I am willing to be contacted for feedback on my usage of IBEScore',
		value: 'Yes, contact me'
	}
];
