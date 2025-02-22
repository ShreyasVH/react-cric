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
import {copyObject} from "../../../utils";

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
    const filterOptions = {
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
        }
    }
    const [ isFilterOpen, setIsFilterOpen ] = useState(false);
    const [ loaded, setLoaded ] = useState(false);

    const handlePlayerClick = playerId => e => {
        console.log(playerId);
        // navigate('/')
    };

    const handleApplyFilters = async () => {
        await updateData(1);
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

            }
                break;
            case FILTER_TYPE.RADIO: {
                let key = target.dataset['key'];
                let id = target.dataset['id'];

                tempFilters[key] = id;
                this.setState({
                    selectedFiltersTemp: tempFilters
                });
            }
                break;
            case FILTER_TYPE.RANGE: {
                console.log(target.dataset);
                let key = target.dataset['key'];
                let type = target.dataset['rangetype'];
                if (!tempFilters.hasOwnProperty(key)) {
                    tempFilters[key] = {};
                }
                tempFilters[key][type] = target.value;
                this.setState({
                    selectedFiltersTemp: tempFilters
                });
            }
                break;
        }

        setSelectedFiltersTemp(tempFilters);
    };

    const handleFilterOpen = event => {
        setIsFilterOpen(true);
        setSelectedFiltersTemp(selectedFilters);
    };

    const handleFilterClose = event => {
        setIsFilterOpen(false);
    }

    const limit = 10;

    const updateData = (selectedPage) => {
        const payload = {
            type: 'batting',
            filters: {},
            rangeFilters: {},
            count: limit,
            offset: (selectedPage - 1) * limit,
            sortMap: {
                runs: 'desc'
            }
        };

        const rangeFilterKeys = [
            'year'
        ];

        for (const [key, values] of Object.entries(selectedFiltersTemp)) {
            if (key === 'type') {
                payload.type = values;
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
        });
    };

    const goToPage = async page => {
        await updateData(page);
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

    useEffect(() => {
        updateData(1);
    }, []);

    useEffect(() => {
        Promise.all()
    }, []);

    return (
        <>
            {
                loaded && <Container>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Player ID
                                </TableCell>
                                <TableCell>
                                    Name
                                </TableCell>
                                <TableCell>
                                    Innings
                                </TableCell>
                                <TableCell>
                                    Runs
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {stats.map(stat => (
                                <TableRow key={stat.id}>
                                    <TableCell>
                                        {stat.id}
                                    </TableCell>
                                    <TableCell>
                                        {stat.name}
                                    </TableCell>
                                    <TableCell>
                                        {stat.innings}
                                    </TableCell>
                                    <TableCell>
                                        {stat.runs}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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