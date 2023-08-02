import { get } from '../utils/api';
const endpoint = 'https://cric.playframework.com';

export const getSeries = async id => {
    const url = endpoint + '/cric/v1/series/' + id;
    return get(url);
}
