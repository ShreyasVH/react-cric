import { get } from '../utils/api';
const endpoint = process.env.REACT_APP_API_ENDPOINT;

export const getTeams = async (page, pageSize) => {
    const url = endpoint + '/cric/v1/teams?page=' + page + '&limit=' + pageSize;
    return get(url);
};

export const getAllTeams = async () => {
    const pageSize = 20;
    let page = 1;

    let totalCount = 0;

    while () {

    }
};