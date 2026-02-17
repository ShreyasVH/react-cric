import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { CardActionArea, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { getDetails as getPlayerDetails } from '../../../endpoints/players';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

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
    };

    const formatDismissalStatsForRender = (stats) => {
        const colorMap = {
            Bowled: {
                backgroundColor: '#a6cee3'
            },
            Caught: {
                backgroundColor: '#1f78b4'
            },
            LBW: {
                backgroundColor: '#b2df8a'
            },
            'Run Out': {
                backgroundColor: '#33a02c'
            },
            Stumped: {
                backgroundColor: '#fb9a99'
            },
            'Hit Twice': {
                backgroundColor: '#e31a1c'
            },
            'Hit Wicket': {
                backgroundColor: '#fdbf6f'
            },
            'Obstructing the Field': {
                backgroundColor: '#ff7f00'
            },
            'Timed Out': {
                backgroundColor: '#cab2d6'
            },
            'Handled the Ball': {
                backgroundColor: '#6a3d9a'
            }
        };

        let labels = [];
        let data = [];
        let backgroundColors = [];
        let hoverBackgroundColors = [];
        for (const [dismissal, count] of Object.entries(stats)) {
            labels.push(dismissal);
            data.push(count);
            backgroundColors.push(colorMap[dismissal].backgroundColor);
            hoverBackgroundColors.push(colorMap[dismissal].hoverBackgroundColor);
        }

        return (
            {
                labels,
                datasets: [
                    {
                        backgroundColor: backgroundColors,
                        hoverBackgroundColor: hoverBackgroundColors,
                        data
                    }
                ]
            }
        );
    }

    return (
        <>
            {
                loaded && <div>
                    <h1>Player Details</h1>

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

                    <br />
                    <hr />
                    <br />

                    <h2>Dismissal Stats</h2>

                    <Grid container sx={{textAlign: 'center'}}>
                        {Object.keys(details.dismissalStats).map(gameType => (
                            <Grid size={{xs: 4}} key={`dismissals_${gameType}`}>
                                <Doughnut
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: gameType,
                                                font: {
                                                    size: 18,
                                                    weight: 'bold',
                                                }
                                            },
                                            legend: {
                                                display: true,
                                                position: 'bottom'
                                            }
                                        }
                                    }}
                                    data={formatDismissalStatsForRender(details.dismissalStats[gameType])}
                                    chart-id={`dismissals_${gameType}`}
                                    dataset-id-key={`dismissals_${gameType}`}
                                    width={400}
                                    height={400}
                                />
                            </Grid>))}
                    </Grid>
                </div>
            }
        </>
    );
};