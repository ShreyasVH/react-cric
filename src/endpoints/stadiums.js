import { get } from '../utils/api';
const endpoint = process.env.REACT_APP_API_ENDPOINT;

export const getStadiums = async (page, pageSize) => {
    const url = endpoint + '/cric/v1/stadiums?page=' + page + '&limit=' + pageSize;
    return get(url);
};

export const getAllStadiums = async () => {
    let stadiums = [];
    const pageSize = 20;
    let page = 1;

    let totalCount = 0;

    do
    {
        const apiResponse = await getStadiums(page, pageSize);
        const response = apiResponse.data;
        const data = response.data;
        if (page === 1) {
            totalCount = data.totalCount;
        }
        const batchStadiums = data.items;
        stadiums = stadiums.concat(batchStadiums);
        page += 1;
    }
    while (stadiums.length < totalCount);
    return stadiums;
};