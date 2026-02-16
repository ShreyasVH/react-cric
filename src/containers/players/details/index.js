import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { CardActionArea, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { getDetails as getPlayerDetails } from '../../../endpoints/players';

export default function TourDetails() {
    const [ details, setDetails ] = useState({});
    const [ loaded, setLoaded ] = useState(false);

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const id = urlSearchParams.get('id');
        console.log(id);

        getPlayerDetails(id).then(detailsResponse => {
            setDetails(detailsResponse.data.data);
            console.log(detailsResponse);
            setLoaded(true);
        });
    }, []);

    const column1Fields = [
        {
            key: 'innings',
            displayName: 'Innings'
        },
        {
            key: 'runs',
            displayName: 'Runs'
        },
        {
            key: 'balls',
            displayName: 'Balls'
        },
        {
            key: 'average',
            displayName: 'Average'
        },
        {
            key: 'notOuts',
            displayName: 'Not Outs'
        },
        {
            key: 'highest',
            displayName: 'Highest'
        }
    ];

    const column2Fields = [
        {
            key: 'catches',
            displayName: 'Catches',
            statsType: 'fieldingStats'
        },
        {
            key: 'wickets',
            displayName: 'Wickets',
            statsType: 'bowlingStats'
        },
        {
            key: 'balls',
            displayName: 'Balls',
            statsType: 'bowlingStats'
        },
        {
            key: 'runs',
            displayName: 'Runs',
            statsType: 'bowlingStats'
        },
        {
            key: 'fifers',
            displayName: 'Fifers',
            statsType: 'bowlingStats'
        },
        {
            key: 'economy',
            displayName: 'Economy',
            statsType: 'bowlingStats'
        }
    ];


    const formatValue = (value, field) => {
        let formattedValue = value;

        switch (field) {
            case 'average':
                formattedValue = value.toFixed(2);
                break;
            case 'economy':
                formattedValue = value.toFixed(2);
                break
        }

        return formattedValue;
    };

    const getWrappedValue = (details, statType, gameType, key) => {
        let value = '-';

        if(details.hasOwnProperty(statType) && details[statType].hasOwnProperty(gameType) && details[statType][gameType].hasOwnProperty(key)) {
            value = formatValue(details[statType][gameType][key], key);
        }

        return value;
    };

    const getDateOfBirth = dateOfBirthString => {
        const dateOfBirth = new Date(dateOfBirthString);
        return ("0" + dateOfBirth.getDate()).slice(-2) + '/' + ("0" + (dateOfBirth.getMonth() + 1)).slice(-2) + '/' + dateOfBirth.getFullYear();
    }

    return (
        <>
            {
                loaded && <div>
                    Player Details

                    <Grid container sx={{textAlign: 'center'}}>
                        {Object.keys(details.battingStats).map(gameType => (
                            <Grid size={{xs: 4}} key={`batting_${gameType}`}>
                                <Card raised sx={{maxWidth: 300, textAlign: 'center'}}>
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            {details.name}
                                        </Typography>
                                        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{gameType}</Typography>
                                        <img src={'https://res.cloudinary.com/dyoxubvbg/image/upload/v1577106216/artists/default_m.jpg'} />
                                        <Grid container sx={{textAlign: 'left'}}>
                                            <Grid size={{xs: 6}}>
                                                {column1Fields.map(field => (
                                                    <Typography variant={'h7'} sx={{display: 'block'}} key={`column1_${field.key}`}>
                                                        <strong>{field.displayName}:</strong>
                                                        {getWrappedValue(details, 'battingStats', gameType, field.key)}
                                                    </Typography>
                                                ))}

                                                <Typography variant={'h7'} sx={{display: 'block'}}>
                                                    <strong>50/100:</strong>
                                                    {getWrappedValue(details, 'battingStats', gameType, 'fifties')}/{getWrappedValue(details, 'battingStats', gameType, 'hundreds')}
                                                </Typography>
                                            </Grid>

                                            <Grid size={{xs: 6}}>
                                                {column2Fields.map(field => (
                                                    <Typography variant={'h7'} sx={{display: 'block'}} key={`column1_${field.key}`}>
                                                        <strong>{field.displayName}:</strong>
                                                        {getWrappedValue(details, field.statsType, gameType, field.key)}
                                                    </Typography>
                                                ))}

                                                <Typography variant={'h7'} sx={{display: 'block'}}>
                                                    <strong>DOB:</strong>
                                                    {getDateOfBirth(details.dateOfBirth)}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>))}
                    </Grid>
                </div>
            }
        </>
    );
};