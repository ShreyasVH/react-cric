import { get } from '../utils/api';
const endpoint = process.env.REACT_APP_API_ENDPOINT;

export const getMatch = async id => {
    const url = endpoint + '/cric/v1/matches/' + id;
    return get(url);
}
