import { useEffect, useState } from "react";
import { Helmet } from 'react-helmet';
import './index.css';
import Grid from '@mui/material/Grid';
import { getAllYears, getToursForYear } from '../../endpoints/tours';
import Card from '@mui/material/Card';
import { Box, Button, CardActionArea, CardContent, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { formatDateTimeString } from '../../utils';
import { Waypoint } from "react-waypoint";

export default function Home() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const year = parseInt(urlSearchParams.get('year') ?? (new Date()).getFullYear());
    const [ tours, setTours ] = useState([]);
    const [ page, setPage ] = useState(1);
    const [ years, setYears ] = useState([]);
    const [ totalPages, setTotalPages ] = useState(1);
    const [ isMounted, setIsMounted ] = useState(false);
    const pageSize = 25;

    const navigate = useNavigate();

    const handleYearClick = year => e => {
        navigate('/browse?year=' + year);
    }

    const handleTourClick = id => e => {
        navigate('/tours/detail?id=' + id);
    }

    useEffect(() => {
        Promise.all([
            getAllYears(),
        ]).then((responses) => {
            const yearsResponse = responses[0];
            const availableYears = yearsResponse.data.data;
            setYears(availableYears);
        });
    }, []);

    const scrollMore = () => {
        if (tours.length > 0 && page < totalPages) {
            setPage(page + 1);
        }
    }

    const handleDataUpdate = (toursResponse, page) => {
        const toursData = toursResponse.data.data;
        let finalTours = [];
        if (page === 1) {
            const totalCount = toursData.totalCount;
            setTotalPages(Math.ceil(totalCount / pageSize));
            setIsMounted(true);
            finalTours = toursData.items;
        } else {
            finalTours = tours.concat(toursData.items);
        }

        setTours(finalTours);
    }

    useEffect(() => {
        if (isMounted) {
            getToursForYear(year, page, pageSize).then(toursResponse => {
                handleDataUpdate(toursResponse, page);
            });
        }
    }, [page]);

    useEffect(() => {
        getToursForYear(year, 1, pageSize).then(toursResponse => {
            handleDataUpdate(toursResponse, 1);
        });
    }, [year]);

    return (
        <>
            <Helmet>
                <title>
                    Howzzat - Home Page
                </title>
            </Helmet>

            <div className="tours-container">
                <Grid container>
                    <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                        <Typography variant={'h5'} align={'center'} sx={{marginBottom: '1%'}}>
                            Tours for {year}:
                        </Typography>

                        {
                            tours.map(tour => (
                                <Card raised sx={{marginBottom: '1%'}} key={'tour' + tour.id}>
                                    <CardActionArea>
                                        <CardContent onClick={handleTourClick(tour.id)}>
                                            <Typography color="text.secondary" sx={{display: 'inline'}}>
                                                {tour.name}
                                            </Typography>

                                            <Typography color="text.secondary" sx={{float: 'right'}}>
                                                {formatDateTimeString(tour.startTime)}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            ))
                        }

                        <Waypoint
                            onEnter={scrollMore}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <Typography variant={'h5'} align={'center'} sx={{marginBottom: '1%'}}>
                            Years:

                            <Box justifyContent={'center'}>
                                {
                                    years.map(currentYear => (
                                        <Button
                                            variant={(currentYear === year) ? 'contained' : 'outlined'}
                                            key={'year' + currentYear}
                                            color={'secondary'}
                                            sx={{marginLeft: '1%', marginRight: '1%'}}
                                            onClick={handleYearClick(currentYear)}
                                        >
                                            <Typography variant={'button'}>
                                                {currentYear}
                                            </Typography>
                                        </Button>
                                    ))
                                }
                            </Box>
                        </Typography>
                    </Grid>
                </Grid>
            </div>
        </>
    );
};