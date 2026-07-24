import { get } from '../utils/api';
const endpoint = process.env.REACT_APP_API_ENDPOINT;

export const getTags = async (page, pageSize) => {
    const url = endpoint + '/cric/v1/tags?page=' + page + '&limit=' + pageSize;
    return get(url);
};

export const getAllTags = async () => {
    let teams = [];
    const pageSize = 20;
    let page = 1;

    let totalCount = 0;

    do
    {
        const apiResponse = await getTags(page, pageSize);
        const response = apiResponse.data;
        const data = response.data;
        if (page === 1) {
            totalCount = data.totalCount;
        }
        const batchTeams = data.items;
        teams = teams.concat(batchTeams);
        page += 1;
    }
    while (teams.length < totalCount);
    return teams;
};