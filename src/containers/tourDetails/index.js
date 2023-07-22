import { useEffect, useState } from 'react';
import { getTour } from '../../endpoints/tours';
import Card from '@mui/material/Card';
import { CardActionArea, CardContent, Typography } from '@mui/material';
import { formatDateTimeString } from '../../utils';

export default function TourDetails() {
    const [ tour, setTour ] = useState({});
    const [ loaded, setLoaded ] = useState(false);

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const id = urlSearchParams.get('id');

        getTour(id).then(tourResponse => {
            setTour(tourResponse.data.data);
            setLoaded(true);
        });
    }, []);

    return (
        <>
            {
                loaded && <div>
                    <Typography variant={'h5'} sx={{marginBottom: '1%'}}>
                        {tour.name}
                    </Typography>

                    {
                        tour.seriesList.map(series => (
                            <Card raised sx={{marginBottom: '1%'}} key={'series' + series.id}>
                                <CardActionArea>
                                    <CardContent>
                                        <Typography color="text.secondary" sx={{display: 'inline'}}>
                                            {series.gameType.name}
                                        </Typography>

                                        <Typography color="text.secondary" sx={{float: 'right'}}>
                                            {formatDateTimeString(series.startTime)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))
                    }
                </div>
            }
        </>
    );
}