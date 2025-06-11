import { get, post } from '../utils/api';
const endpoint = process.env.REACT_APP_API_ENDPOINT;


export const search = async keyword => {
    const url = `${endpoint}/cric/v1/players/search?keyword=${keyword}&page=1&limit=25`;
    return get(url);
}

export const merge = async payload => {
    const url = `${endpoint}/cric/v1/players/merge`;
    return post(url, payload);
}
