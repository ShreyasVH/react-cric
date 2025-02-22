import { post } from '../utils/api';
const endpoint = process.env.REACT_APP_API_ENDPOINT;

export const getStats = async payload => {
    const url = endpoint + '/cric/v1/stats';
    return post(url, payload);
};
