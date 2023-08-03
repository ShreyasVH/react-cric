import { get } from '../utils/api';
const endpoint = process.env.REACT_APP_API_ENDPOINT;


export const getToursForYear = async (year, page, pageSize) => {
    const url = endpoint + '/cric/v1/tours/year/' + year + '?page=' + page + '&limit=' + pageSize;
    return get(url);
};

export const getAllYears = async () => {
    const url = endpoint + '/cric/v1/tours/years';
    return get(url);
};

export const getTour = async id => {
    const url = endpoint + '/cric/v1/tours/' + id;
    return get(url);
}
