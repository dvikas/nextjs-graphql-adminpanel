import Amplitude from 'amplitude';
import uuid from 'uuid/v4';

if (process.env.API_AMPLITUDE_API_KEY === undefined) {
    throw Error('Missing API_AMPLITUDE_API_KEY  environment variable');
}

const analytics = new Amplitude(process.env.API_AMPLITUDE_API_KEY, { user_id: uuid() });

export default analytics;
