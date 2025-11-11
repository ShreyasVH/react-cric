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

import { styled } from '@mui/system';

const Container = styled("div")(({ theme }) => ({
    '& .paginationBox': {
        textAlign: 'center',
        marginTop: '2%',
        '& .active': {
            backgroundColor: '#303F9F',
            color: '#FFFFFF',
            border: '1px solid #303F9F',
            borderRadius: '10%'
        }
    },
    '& .paginationButton': {
        display: 'inline-block',
        padding: '1% 1.5%',
        cursor: 'pointer',
        fontWeight: 'large',
        marginLeft: '0.25%',
        marginRight: '0.25%',
        borderRadius: 0,
        '&:hover': {
            [theme.breakpoints.up('lg')]: {
                backgroundColor: '#303F9F',
                color: '#FFFFFF',
                border: '1px solid #303F9F',
                borderRadius: '10%'
            }
        }
    },
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

        console.log(event);

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
                break;
            }
            case FILTER_TYPE.RADIO: {
                let key = target.dataset['key'];
                let id = target.dataset['id'];

                tempFilters[key] = id;
                break;
            }
            case FILTER_TYPE.RANGE: {
                console.log(target.dataset);
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

    const renderPagination = () => {
        const currentPage = page;
        const totalPages = (((totalCount - (totalCount % limit)) / limit) + (((totalCount % limit) === 0) ? 0 : 1));
        const markup = [];

        if (currentPage > 2) {
            markup.push(
                <div className='paginationButton' onClick={() => goToPage(1)} key={'pageFirst'}>
                    {'<<'}
                </div>
            );
        }

        if (currentPage > 1) {
            markup.push(
                <div className='paginationButton' onClick={() => goToPage(currentPage - 1)} key={'pagePrevious'}>
                    {'<'}
                </div>
            );
        }

        for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
            let className = 'paginationButton' + ((i === currentPage) ? ' ' + 'active' : '');

            markup.push(
                <div className={className} onClick={() => goToPage(i)} key={'page' + i}>
                    {i}
                </div>
            );
        }

        if (currentPage < (totalPages - 1)) {
            markup.push(
                <div className='paginationButton' onClick={() => goToPage(currentPage + 1)} key={'pageNext'}>
                    {'>'}
                </div>
            );
        }

        if (currentPage < (totalPages - 2)) {
            markup.push(
                <div className='paginationButton' onClick={() => goToPage(totalPages)} key={'pageLast'}>
                    {'>>'}
                </div>
            );
        }

        return (
            <div className='paginationBox'>
                {markup}
            </div>
        );
    }

    const renderSortSymbol = key => ((sortMap.hasOwnProperty(key)) ? ((sortMap[key] === 'asc') ? '\u0020\u2191' : '\u0020\u2193') : '');

    const renderBattingStats = () => {
        return (
            <>
                {
                    selectedFiltersTemp.type === 'batting' && <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Player ID
                                </TableCell>
                                <TableCell>
                                    Name
                                </TableCell>
                                <TableCell className='sortable' onClick={handleSort('innings')}>
                                    Innings
                                    {renderSortSymbol('innings')}
                                </TableCell>
                                <TableCell className='sortable' onClick={handleSort('runs')}>
                                    Runs
                                    {renderSortSymbol('runs')}
                                </TableCell>
                                <TableCell className='sortable' onClick={handleSort('balls')}>
                                    Balls
                                    {renderSortSymbol('balls')}
                                </TableCell>
                                <TableCell className='sortable' onClick={handleSort('notOuts')}>
                                    Notouts
                                    {renderSortSymbol('notOuts')}
                                </TableCell>
                                <TableCell className='sortable' onClick={handleSort('highest')}>
                                    Highest
                                    {renderSortSymbol('highest')}
                                </TableCell>
                                <TableCell className='sortable' onClick={handleSort('fours')}>
                                    4s
                                    {renderSortSymbol('fours')}
                                </TableCell>
                                <TableCell className='sortable' onClick={handleSort('sixes')}>
                                    6s
                                    {renderSortSymbol('sixes')}
                                </TableCell>
                                <TableCell className='sortable' onClick={handleSort('fifties')}>
                                    50s
                                    {renderSortSymbol('fifties')}
                                </TableCell>
                                <TableCell className='sortable' onClick={handleSort('hundreds')}>
                                    100s
                                    {renderSortSymbol('hundreds')}
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {stats.map(stat => (
                                <TableRow key={stat.id}>
                                    <TableCell>
                                        {stat.id}
                                    </TableCell>
                                    <TableCell className='clickable' onClick={handlePlayerClick(stat.id)}>
                                        {stat.name}
                                    </TableCell>
                                    <TableCell>
                                        {stat.innings}
                                    </TableCell>
                                    <TableCell>
                                        {stat.runs}
                                    </TableCell>
                                    <TableCell>
                                        {stat.balls}
                                    </TableCell>
                                    <TableCell>
                                        {stat.notOuts}
                                    </TableCell>
                                    <TableCell>
                                        {stat.highest}
                                    </TableCell>
                                    <TableCell>
                                        {stat.fours}
                                    </TableCell>
                                    <TableCell>
                                        {stat.sixes}
                                    </TableCell>
                                    <TableCell>
                                        {stat.fifties}
                                    </TableCell>
                                    <TableCell>
                                        {stat.hundreds}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                }
            </>
        );
    };

    const renderBowlingStats = () => {
        return (
            <>
                {
                    selectedFiltersTemp.type === 'bowling' && <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Player ID
                                </TableCell>
                                <TableCell>
                                    Name
                                </TableCell>
                                <TableCell className='sortable' onClick={handleSort('innings')}>
                                    Innings
                                    {renderSortSymbol('innings')}
                                </TableCell>
                                <TableCell className='sortable' onClick={handleSort('wickets')}>
                                    Wickets
                                    {renderSortSymbol('wickets')}
                                </TableCell>
                                <TableCell className='sortable' onClick={handleSort('runs')}>
                                    Runs
                                    {renderSortSymbol('runs')}
                                </TableCell>
                                <TableCell className='sortable' onClick={handleSort('balls')}>
                                    Balls
                                    {renderSortSymbol('balls')}
                                </TableCell>
                                <TableCell className='sortable' onClick={handleSort('maidens')}>
                                    Maidens
                                    {renderSortSymbol('maidens')}
                                </TableCell>
                                <TableCell className='sortable' onClick={handleSort('fifers')}>
                                    Fifers
                                    {renderSortSymbol('fifers')}
                                </TableCell>
                                <TableCell className='sortable' onClick={handleSort('tenWickets')}>
                                    Ten Wickets
                                    {renderSortSymbol('tenWickets')}
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {stats.map(stat => (
                                <TableRow key={stat.id}>
                                    <TableCell>
                                        {stat.id}
                                    </TableCell>
                                    <TableCell className='clickable' onClick={handlePlayerClick(stat.id)}>
                                        {stat.name}
                                    </TableCell>
                                    <TableCell>
                                        {stat.innings}
                                    </TableCell>
                                    <TableCell>
                                        {stat.wickets}
                                    </TableCell>
                                    <TableCell>
                                        {stat.runs}
                                    </TableCell>
                                    <TableCell>
                                        {stat.balls}
                                    </TableCell>
                                    <TableCell>
                                        {stat.maidens}
                                    </TableCell>
                                    <TableCell>
                                        {stat.fifers}
                                    </TableCell>
                                    <TableCell>
                                        {stat.tenWickets}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                }
            </>
        );
    };

    const renderFieldingStats = () => {
        return (
            <>
                {
                    selectedFiltersTemp.type === 'fielding' && <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Player ID
                                </TableCell>
                                <TableCell>
                                    Name
                                </TableCell>
                                <TableCell className='sortable' onClick={handleSort('fielderCatches')}>
                                    Fielder Catches
                                    {renderSortSymbol('fielderCatches')}
                                </TableCell>
                                <TableCell className='sortable' onClick={handleSort('keeperCatches')}>
                                    Keeper Catches
                                    {renderSortSymbol('keeperCatches')}
                                </TableCell>
                                <TableCell className='sortable' onClick={handleSort('stumpings')}>
                                    Stumpings
                                    {renderSortSymbol('stumpings')}
                                </TableCell>
                                <TableCell className='sortable' onClick={handleSort('runOuts')}>
                                    Run Outs
                                    {renderSortSymbol('runOuts')}
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {stats.map(stat => (
                                <TableRow key={stat.id}>
                                    <TableCell>
                                        {stat.id}
                                    </TableCell>
                                    <TableCell className='clickable' onClick={handlePlayerClick(stat.id)}>
                                        {stat.name}
                                    </TableCell>
                                    <TableCell>
                                        {stat.fielderCatches}
                                    </TableCell>
                                    <TableCell>
                                        {stat.keeperCatches}
                                    </TableCell>
                                    <TableCell>
                                        {stat.stumpings}
                                    </TableCell>
                                    <TableCell>
                                        {stat.runOuts}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                }
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
                    id: ((typeof team.id === 'string') ? team.id : JSON.stringify(team.id)),
                    name: team.name
                }))
            };
            updatedFilterOptions['opposingTeam'] = {
                displayName: 'Opposing Team',
                type: FILTER_TYPE.CHECKBOX,
                values: allTeams.map(team => ({
                    id: ((typeof team.id === 'string') ? team.id : JSON.stringify(team.id)),
                    name: team.name
                }))
            };
            updatedFilterOptions['stadium'] = {
                displayName: 'Stadium',
                type: FILTER_TYPE.CHECKBOX,
                values: allStadiums.map(stadium => ({
                    id: ((typeof stadium.id === 'string') ? stadium.id : JSON.stringify(stadium.id)),
                    name: stadium.name
                }))
            };
            setFilterOptions(updatedFilterOptions);
        }).catch(error => console.log(error))
    }, []);



    return (
        <>
            {
                loaded && <Container>
                    {renderBattingStats()}
                    {renderBowlingStats()}
                    {renderFieldingStats()}
                    <Filters
                        isOpen={isFilterOpen}
                        onFilterOpen={handleFilterOpen}
                        options={filterOptions}
                        selected={selectedFiltersTemp}
                        handleEvent={handleFilterEvent}
                        applyFilters={handleApplyFilters}
                        onFilterClose={handleFilterClose}
                    />

                    {renderPagination()}

                </Container>
            }
        </>
    );
}