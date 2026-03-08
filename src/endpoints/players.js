import { post, get } from '../utils/api';
const endpoint = process.env.REACT_APP_API_ENDPOINT;

export const search = async keyword => {
    const url = `${endpoint}/cric/v1/players/search?keyword=${keyword}&page=1&limit=25`;
    return get(url);
}

export const merge = async payload => {
    const url = `${endpoint}/cric/v1/players/merge`;
    return post(url, payload);
}

export const getStats = async payload => {
    const url = endpoint + '/cric/v1/stats';
    return post(url, payload);
};

export const getDetails = async id => {
    const url = endpoint + `/cric/v1/players/${id}`;
    return get(url);
};
