import { useEffect, useState } from 'react';
import { getSeries } from '../../endpoints/series';
import Card from '@mui/material/Card';
import { CardActionArea, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { formatDateTimeString } from '../../utils';

export default function TourDetails() {
    const [ series, setSeries ] = useState({});
    const [ loaded, setLoaded ] = useState(false);

    const getWinMargin = (winMargin, winMarginType) => {
        let margin = winMarginType.toLowerCase();

        if (winMargin > 1) {
            margin += 's';
        }

        return margin;
    };

    const renderWinner = match => {
        let result = '';

        if (match.winner) {
            result += match.winner.name + " won";

            if (match.winMarginType) {
                result += " by " + match.winMargin + " " + getWinMargin(match.winMargin, match.winMarginType.name);
            }

            if ('Super Over' === match.resultType.name) {
                result += ' (Super Over)';
            }
        } else {
            if (match.resultType.name === 'Tie') {
                result = 'Match Tied';
            } else if(match.resultType.name === 'Draw') {
                result = 'Match Drawn';
            } else if(match.resultType.name === 'Washed Out') {
                result = 'Match Washed Out';
            }
        }

        return result;
    };

    const renderStadiumDetails = stadium => {
        return stadium.name + ', ' + stadium.country.name;
    }

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const id = urlSearchParams.get('id');

        getSeries(id).then(seriesResponse => {
            setSeries(seriesResponse.data.data);
            setLoaded(true);
        });
    }, []);

    return (
        <>
            {
                loaded && <div>
                    <Typography variant={'h5'} sx={{marginBottom: '1%'}}>
                        {series.name + ' - ' + series.gameType.name}
                    </Typography>

                    {
                        series.matches.map((match, index) => (
                            <Card raised sx={{marginBottom: '1%'}} key={'match' + match.id}>
                                <CardActionArea>
                                    <CardContent>
                                        <Grid container>
                                            <Grid item lg={4}>
                                                <Typography color="text.secondary" sx={{display: 'inline'}}>
                                                    {(index + 1) + '. ' + match.team1.name + ' v/s ' + match.team2.name}
                                                </Typography>

                                                <Typography color="text.secondary" sx={{display: 'block'}}>
                                                    {renderWinner(match)}
                                                </Typography>
                                            </Grid>

                                            <Grid item lg={4} style={{textAlign: 'center'}}>
                                                <Typography color="text.secondary" sx={{display: 'inline'}}>
                                                    {renderStadiumDetails(match.stadium)}
                                                </Typography>
                                            </Grid>

                                            <Grid item lg={4}>
                                                <Typography color="text.secondary" sx={{float: 'right'}}>
                                                    {formatDateTimeString(match.startTime)}
                                                </Typography>
                                            </Grid>
                                        </Grid>
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