import { useEffect, useState } from 'react';
import { getStats } from '../../../endpoints/players';
import {
    Chip,
    Paper,
    Table, TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import Filters from '../../filters';
import { useNavigate } from 'react-router-dom';
import { FILTER_TYPE } from "../../../constants";
import { copyObject, showLoader, hideLoader } from '../../../utils';
import { getAllTeams } from '../../../endpoints/teams';
import { getAllStadiums } from '../../../endpoints/stadiums';
import PaginationBox from './paginationBox';

import { styled } from '@mui/system';

const Container = styled("div")(({ theme }) => ({
    '& .sortable': {
        cursor: 'pointer'
    },
    '& .clickable': {
        cursor: 'pointer'
    }
}));

export default function PlayerStats() {
    const [ stats, setStats ] = useState([]);
    const [ totalCount, setTotalCount ] = useState(0);
    const [ selectedFilters, setSelectedFilters ] = useState({
        type: 'batting'
    });
    const [ page, setPage ] = useState(1);
    const [ selectedFiltersTemp, setSelectedFiltersTemp ] = useState({
        type: 'batting'
    });
    const [ sortMap, setSortMap ] = useState({
        'runs': 'desc'
    });

    const getDefaultFilterOptions = () => ({
        type: {
            displayName: 'Type',
            type: FILTER_TYPE.RADIO,
            values: [
                {
                    id: 'batting',
                    name: 'Batting'
                },
                {
                    id: 'bowling',
                    name: 'Bowling'
                },
                {
                    id: 'fielding',
                    name: 'Fielding'
                }
            ]
        },
        gameType: {
            displayName: 'Game Type',
            type: FILTER_TYPE.CHECKBOX,
            values: [
                {
                    id: '1',
                    name: 'ODI'
                },
                {
                    id: '2',
                    name: 'TEST'
                },
                {
                    id: '3',
                    name: 'T20'
                }
            ]
        },
        teamType: {
            displayName: 'Team Type',
            type: FILTER_TYPE.CHECKBOX,
            values: [
                {
                    id: '1',
                    name: 'INTERNATIONAL'
                },
                {
                    id: '2',
                    name: 'DOMESTIC'
                },
                {
                    id: '3',
                    name: 'FRANCHISE'
                }
            ]
        },
        year: {
            displayName: 'Year',
            type: FILTER_TYPE.RANGE
        }
    });
    const [ filterOptions, setFilterOptions ] = useState(getDefaultFilterOptions());
    const [ isFilterOpen, setIsFilterOpen ] = useState(false);
    const [ loaded, setLoaded ] = useState(false);

    const handlePlayerClick = playerId => e => {
        console.log(playerId);
        // navigate('/')
    };

    const handleApplyFilters = async () => {
        await updateData(1, sortMap);
    };

    const handleFilterEvent = event => {
        const target = event.target;
        let tempFilters = copyObject(selectedFiltersTemp);

        switch (event.target.dataset.type) {
            case FILTER_TYPE.CHECKBOX: {
                let key = target.dataset['key'];
                let id = target.dataset['id'];
                let checked = target.checked;

                if (checked) {
                    if (tempFilters.hasOwnProperty(key)) {
                        tempFilters[key].push(id);
                    } else {
                        tempFilters[key] = [
                            id
                        ];
                    }
                } else {
                    let index = tempFilters[key].indexOf(id);
                    tempFilters[key].splice(index, 1);
                }
                if (tempFilters[key].length === 0) {
                    delete tempFilters[key];
                }
                break;
            }
            case FILTER_TYPE.RADIO: {
                let key = target.dataset['key'];
                let id = target.dataset['id'];

                tempFilters[key] = id;
                break;
            }
            case FILTER_TYPE.RANGE: {
                let key = target.dataset['key'];
                let type = target.dataset['rangetype'];
                if (!tempFilters.hasOwnProperty(key)) {
                    tempFilters[key] = {};
                }
                tempFilters[key][type] = target.value;
                break;
            }
            default: {}
        }

        setSelectedFiltersTemp(tempFilters);
    };

    const handleFilterOpen = event => {
        setIsFilterOpen(true);
        setSelectedFiltersTemp(selectedFilters);
    };

    const handleFilterClose = event => {
        setIsFilterOpen(false);
    };

    const handleSort = key => async event => {
        event.preventDefault();

        const order = ((sortMap.hasOwnProperty(key) && sortMap[key] === 'desc') ? 'asc' : 'desc');
        await updateData(1, {
            [key]: order
        });
    };

    const limit = 10;

    const columns = {
        batting: [
            {
                displayKey: 'Name',
                key: 'name',
                sortable: false
            },
            {
                displayKey: 'Innings',
                key: 'innings',
                sortable: true
            },
            {
                displayKey: 'Runs',
                key: 'runs',
                sortable: true
            },
            {
                displayKey: 'Balls',
                key: 'balls',
                sortable: true
            },
            {
                displayKey: 'Not Outs',
                key: 'notOuts',
                sortable: true
            },
            {
                displayKey: 'Highest',
                key: 'highest',
                sortable: true
            },
            {
                displayKey: '4s',
                key: 'fours',
                sortable: true
            },
            {
                displayKey: '6s',
                key: 'sixes',
                sortable: true
            },
            {
                displayKey: '50s',
                key: 'fifties',
                sortable: true
            },
            {
                displayKey: '100s',
                key: 'hundreds',
                sortable: true
            }
        ],
        bowling: [
            {
                displayKey: 'Name',
                key: 'name',
                sortable: false
            },
            {
                displayKey: 'Innings',
                key: 'innings',
                sortable: true
            },
            {
                displayKey: 'Wickets',
                key: 'wickets',
                sortable: true
            },
            {
                displayKey: 'Runs',
                key: 'runs',
                sortable: true
            },
            {
                displayKey: 'Balls',
                key: 'balls',
                sortable: true
            },
            {
                displayKey: 'Maidens',
                key: 'maidens',
                sortable: true
            },
            {
                displayKey: 'fifers',
                key: 'fifers',
                sortable: true
            },
            {
                displayKey: 'Ten Wickets',
                key: 'tenWickets',
                sortable: true
            }
        ],
        fielding: [
            {
                displayKey: 'Name',
                key: 'name',
                sortable: false
            },
            {
                displayKey: 'Fielder Catches',
                key: 'fielderCatches',
                sortable: true
            },
            {
                displayKey: 'Keeper Catches',
                key: 'keeperCatches',
                sortable: true
            },
            {
                displayKey: 'Stumpings',
                key: 'stumpings',
                sortable: true
            },
            {
                displayKey: 'Run Outs',
                key: 'runOuts',
                sortable: true
            }
        ]
    };

    const updateData = (selectedPage, sortMap) => {
        showLoader();

        const payload = {
            type: 'batting',
            filters: {},
            rangeFilters: {},
            count: limit,
            offset: (selectedPage - 1) * limit,
            sortMap
        };

        const rangeFilterKeys = [
            'year'
        ];

        const allowedSortKeys = {
            'batting': [
                'runs',
                'innings',
                'balls',
                'notOuts',
                'highest',
                'fours',
                'sixes',
                'fifties',
                'hundreds'
            ],
            'bowling': [
                'wickets',
                'innings',
                'runs',
                'balls',
                'maidens',
                'fifers',
                'tenWickets'
            ],
            'fielding': [
                'fielderCatches',
                'keeperCatches',
                'stumpings',
                'runOuts'
            ]
        };

        for (const [key, values] of Object.entries(selectedFiltersTemp)) {
            if (key === 'type') {
                payload.type = values;
                if (!allowedSortKeys[payload.type].includes(Object.keys(sortMap)[0])) {
                    sortMap = {
                        [allowedSortKeys[payload.type][0]]: 'desc'
                    };
                    payload.sortMap = sortMap;
                }
            } else if (rangeFilterKeys.indexOf(key) !== -1) {
                payload.rangeFilters[key] = values;
            } else {
                payload.filters[key] = values;
            }
        }

        getStats(payload).then(statsResponse => {
            setStats(statsResponse.data.data.stats);
            setTotalCount(statsResponse.data.data.count);
            setLoaded(true);
            setSelectedFilters(selectedFiltersTemp);
            handleFilterClose();
            setPage(selectedPage);
            setSortMap(sortMap);
            hideLoader();
        });
    };

    const goToPage = async page => {
        await updateData(page, sortMap);
    };

    const renderSortSymbol = key => ((sortMap.hasOwnProperty(key)) ? ((sortMap[key] === 'asc') ? '\u0020\u2191' : '\u0020\u2193') : '');

    const renderStats = () => {
        return (
            <>
                <Table>
                    <TableHead sx={{
                        "& .MuiTableCell-head": {
                            fontWeight: 600
                        },
                    }}>
                        <TableRow>
                            {columns[selectedFilters.type].map(column => (
                                <TableCell key={column.key} className={column.sortable ? 'sortable': ''} onClick={handleSort(column.key, selectedFilters.type)}>
                                    {column.displayKey}
                                    {renderSortSymbol(column.key)}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {stats.map(stat => (
                            <TableRow key={stat.id}>
                                {columns[selectedFilters.type].map(column => (
                                    <TableCell key={`${column.key}_${stat.id}`}>
                                        {stat[column.key]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </>
        );
    };

    useEffect(() => {
        Promise.all([
            updateData(1, sortMap),
            getAllTeams(),
            getAllStadiums()
        ]).then(([_, allTeams, allStadiums]) => {
            const updatedFilterOptions = copyObject(filterOptions);
            updatedFilterOptions['team'] = {
                displayName: 'Team',
                type: FILTER_TYPE.CHECKBOX,
                values: allTeams.map(team => ({
                    id: JSON.stringify(team.id),
                    name: team.name
                }))
            };
            updatedFilterOptions['opposingTeam'] = {
                displayName: 'Opposing Team',
                type: FILTER_TYPE.CHECKBOX,
                values: allTeams.map(team => ({
                    id: JSON.stringify(team.id),
                    name: team.name
                }))
            };
            updatedFilterOptions['stadium'] = {
                displayName: 'Stadium',
                type: FILTER_TYPE.CHECKBOX,
                values: allStadiums.map(stadium => ({
                    id: JSON.stringify(stadium.id),
                    name: stadium.name
                }))
            };
            setFilterOptions(updatedFilterOptions);
        }).catch(error => console.log(error))
    }, []);

    const handleClearFilter = key => {
        let tempFilters = copyObject(selectedFiltersTemp);

        delete tempFilters[key];

        setSelectedFiltersTemp(tempFilters);
    };

    const handleClearAllFilters = () => {
        let tempFilters = copyObject(selectedFiltersTemp);

        for (const key of Object.keys(tempFilters)) {
            if (key !== 'type') {
                delete tempFilters[key];
            }
        }

        setSelectedFiltersTemp(tempFilters);
    };

    return (
        <>
            {
                loaded && <Container>
                    {renderStats()}
                    <Filters
                        isOpen={isFilterOpen}
                        onFilterOpen={handleFilterOpen}
                        options={filterOptions}
                        selected={selectedFiltersTemp}
                        handleEvent={handleFilterEvent}
                        applyFilters={handleApplyFilters}
                        onFilterClose={handleFilterClose}
                        clearFilter={handleClearFilter}
                        clearAllFilters={handleClearAllFilters}
                    />

                    <PaginationBox
                        page={page}
                        totalCount={totalCount}
                        limit={limit}
                        goToPage={goToPage}
                    />

                </Container>
            }
        </>
    );
}