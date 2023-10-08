import { useEffect, useState } from 'react';
import { getMatch } from '../../../endpoints/matches';
import {
    Chip,
    Paper,
    Table, TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function TourDetails() {
    const [ match, setMatch ] = useState({});
    const [ loaded, setLoaded ] = useState(false);

    const navigate = useNavigate();

    const handleSeriesClick = id => e => {
        navigate('/series/detail?id=' + id);
    }

    const handlePlayerClick = playerId => e => {
        console.log(playerId);
        // navigate('/')
    }

    const renderStadiumDetails = () => {
        const stadium = match.stadium;
        return (<div>
            <strong>
                Stadium:
                &nbsp;
            </strong>

            {stadium.name + ', ' + stadium.country.name}
        </div>);
    }

    const renderSeriesName = () => {
        if (match.series) {
            return (
                <div>
                    <strong>
                        Series:
                        &nbsp;
                    </strong>

                    <Typography variant={'span'} sx={{color: 'blue', cursor: 'pointer'}} onClick={handleSeriesClick(match.series.id)}>
                        {match.series.name + ' - ' + match.series.gameType.name}
                    </Typography>
                </div>
            );
        }
    };

    const renderTeams = () => {
        let teams = [];

        teams.push(match.team1);
        teams.push(match.team2);

        return (
            <div>
                <strong>
                    Teams:
                    &nbsp;
                </strong>

                {
                    teams.map(team => (
                        <Chip
                            label={team.name}
                            variant="outlined"
                            key={'team_' + team.id}
                            color={'secondary'}
                            sx={{marginRight: '1%'}}
                        />
                    ))
                }
            </div>
        );
    };

    const renderTossMarkup = () => {
        let markup = 'NA';

        if (match.tossWinner) {
            markup = match.tossWinner.name + ' won the toss and chose to ' + ((match.tossWinner.id === match.batFirst.id) ? 'bat' : 'bowl');
        }

        return (
            <div>
                <strong>
                    Toss:
                    &nbsp;
                </strong>

                {markup}
            </div>
        );
    };

    const getWinMargin = (winMargin, winMarginType) => {
        let margin = winMarginType.toLowerCase();

        if (winMargin > 1) {
            margin += 's';
        }

        return margin;
    };

    const renderResultMarkup = () => {
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

        return (
            <div>
                <strong>
                    Result:
                    &nbsp;
                </strong>

                {result}
            </div>
        );
    };

    const renderStartTime = () => {
        let date = new Date(match.startTime);
        let options = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return (
            <div>
                <strong>
                    Start Time:
                    &nbsp;
                </strong>

                {date.toLocaleDateString('en-GB', options)}
            </div>
        )
    };

    const getPlayerLabel = (currentPlayer) => {
        let text = currentPlayer.name;

        let roles = [];

        let isCaptain = false;
        for (const player of match.captains) {
            if (currentPlayer.id === player.id) {
                isCaptain = true;
                break;
            }
        }

        if (isCaptain) {
            roles.push('c');
        }

        let isWicketKeeper = false;
        for (const player of match.wicketKeepers) {
            if (currentPlayer.id === player.id) {
                isWicketKeeper = true;
                break;
            }
        }

        if (isWicketKeeper) {
            roles.push('wk');
        }

        if (roles.length > 0) {
            text += ' ( ' + roles.join(' & ') + ' ) ';
        }

        return text;
    }

    const playerTeamMap = {};

    const renderPlayers = () => {
        let markup = [
            (
                <Typography variant={'h5'} key={'squads'} >
                    {'Playing Squads'}
                </Typography>
            )
        ];
        let teams = [
            match.team1,
            match.team2
        ];

        for (const team of teams) {
            markup.push(
                <Typography
                    key={'team_' + team.id}
                >
                    {team.name}
                </Typography>
            );

            if (match.players.hasOwnProperty(team.id.toString())) {
                const playerObjects = match.players[team.id.toString()];

                for (const playerObject of playerObjects) {
                    playerTeamMap[playerObject.id] = team;
                    markup.push(
                        <Chip
                            sx={{margin: '0.5%'}}
                            color={((team.id === match.team1.id) ? 'success' : 'error')}
                            label={getPlayerLabel(playerObject)}
                            variant="outlined"
                            key={'player_' + playerObject.id}
                            onClick={handlePlayerClick(playerObject.id)}
                        />
                    );
                }
            }
        }

        return (
            <div className={'row'}>
               <div className={'bordered-container'}>
                   <div className={'container'}>
                       {markup}
                   </div>
               </div>
           </div>
        );
    };

    const renderManOfTheMatch = () => {
        return (
            <div>
               <strong>
                   Man of the Match:
                   &nbsp;
               </strong>

               {
                   match.manOfTheMatchList.map(motm => (
                       <Chip
                           label={motm.name}
                           className={'man-of-the-match'}
                           key={'motm_' + motm.id}
                           onClick={handlePlayerClick(motm.id)}
                       />
                   ))
               }
           </div>
        );
    };

    const renderDismissal = score => {
        if (score.dismissalMode) {
            switch (score.dismissalMode.name) {
                case 'Bowled':
                    return (
                        <span>
                            b&nbsp;
                            <Typography className={'link'} variant={'span'} onClick={handlePlayerClick(score.bowler.id)}>
                                {score.bowler.name}
                            </Typography>
                        </span>
                    );
                case 'Run Out':
                    let text = [
                        <span key={'score_ro'}>run out&nbsp;</span>
                    ];
                    for (const fielder of score.fielders) {
                        text.push(
                            <Typography className={'link'} variant={'span'} onClick={handlePlayerClick(fielder.id)} key={'score_ro_' + fielder.id}>
                                {fielder.name}
                            </Typography>
                        );
                        text.push(<span key={'score_ro_' + fielder.id + '_sep'}>&nbsp;/&nbsp;</span>)
                    }

                    text.splice(text.length - 1);
                    return text;
                case 'Caught':
                    if (score.fielders[0].id === score.bowler.id) {
                        return (
                            <span>
                                c & b&nbsp;
                                <Typography className={'link'} variant={'span'} onClick={handlePlayerClick(score.bowler.id)}>
                                    {score.bowler.name}
                                </Typography>
                            </span>
                        );
                    } else {
                        return (
                            <span>
                                c&nbsp;
                                <Typography className={'link'} variant={'span'} onClick={handlePlayerClick(score.fielders[0].id)}>
                                    {score.fielders[0].name}
                                </Typography>
                                &nbsp;b&nbsp;
                                <Typography className={'link'} variant={'span'} onClick={handlePlayerClick(score.bowler.id)}>
                                    {score.bowler.name}
                                </Typography>
                            </span>
                        );
                    }
                case 'Stumped':
                    return (
                        <span>
                            st&nbsp;
                            <Typography className={'link'} variant={'span'} onClick={handlePlayerClick(score.fielders[0].id)}>
                                {score.fielders[0].name}
                            </Typography>
                            &nbsp;b&nbsp;
                            <Typography className={'link'} variant={'span'} onClick={handlePlayerClick(score.bowler.id)}>
                                {score.bowler.name}
                            </Typography>
                        </span>
                    );
                case 'LBW':
                    return (
                        <span>
                            lbw&nbsp;
                            <Typography className={'link'} variant={'span'} onClick={handlePlayerClick(score.bowler.id)}>
                                {score.bowler.name}
                            </Typography>
                        </span>
                    );
                case 'Retired Hurt':
                    return 'Retired Hurt';
                case 'Hit Twice':
                    return 'Hit Twice';
                case 'Hit Wicket':
                    return (
                        <span>
                            Hit Wicket b&nbsp;
                            <Typography className={'link'} variant={'span'} onClick={handlePlayerClick(score.bowler.id)}>
                                {score.bowler.name}
                            </Typography>
                        </span>
                    );
                case 'Obstructing the Field':
                    return 'Obstructing the field';
                case 'Timed Out':
                    return 'Timed Out';
                case 'Handled the Ball':
                    return 'Handled the ball';
                default:
                    return '';
            }
        } else {
            return 'Not Out';
        }
    };

    const renderExtras = innings => {
        let total = 0;
        let extras = {
            b: 0,
            lb: 0,
            w: 0,
            nb: 0,
            p: 0
        };

        for (const extra of match.extras) {
            if (innings === extra.innings) {
                let typeString = '';
                let type = extra.type.name;
                let typeParts = type.split(' ');
                for (const part of typeParts) {
                    typeString += part.toLowerCase()[0];
                }

                extras[typeString] = extra.runs;
                total += extra.runs;
            }
        }

        let typeArray = [];
        for (let type in extras) {
            let runs = extras[type];
            typeArray.push(type + " " + runs);
        }

        return (
            <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell>
                    {total + '(' + typeArray.join(', ') + ')'}
                </TableCell>
            </TableRow>
        );
    };

    const renderOverDetails = balls => {
        return (Math.floor(balls / 6) + '.' + (balls % 6));
    };

    const renderTotal = (innings) => {
        let runs = 0;
        let wickets = 0;
        let balls = 0;

        for (const battingScore of match.battingScores) {
            if (innings === battingScore.innings) {
                runs += battingScore.runs;

                if (battingScore.dismissalMode) {
                    wickets++;
                }
            }
        }

        for (const extra of match.extras) {
            if (innings === extra.innings) {
                runs += extra.runs;
            }
        }

        for (const bowlingFigure of match.bowlingFigures) {
            if (innings === bowlingFigure.innings) {
                balls += bowlingFigure.balls;
            }
        }

        return (
            <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell>
                    {runs + ' - ' + wickets + ' ( ' +  renderOverDetails(balls) + ' ) '}
                </TableCell>
            </TableRow>
        );
    };

    const getInningsTitle = (teamName, innings, gameType) => {
        return teamName + ' Innings' + ((gameType === 'Test') ? ' ' + (Math.round(innings / 2)) : '');
    }

    const renderBattingScores = innings => {
        let scores = [];
        let inningsName = '';
        for (const score of match.battingScores) {
            if (score.innings === innings) {
                inningsName = getInningsTitle(playerTeamMap[score.player.id].name, innings, match.series.gameType.name);
                scores.push(
                    <TableRow
                        key={'score_' + score.id}
                        hover
                    >
                        <TableCell align={'center'}>
                            <Typography variant={'span'} className={'link'} onClick={handlePlayerClick(score.player.id)}>
                                {score.player.name}
                            </Typography>
                        </TableCell>
                        <TableCell align={'center'}>
                            {renderDismissal(score)}
                        </TableCell>
                        <TableCell align={'center'}>
                            {score.runs}
                        </TableCell>
                        <TableCell align={'center'}>
                            {score.balls}
                        </TableCell>
                        <TableCell align={'center'}>
                            {score.fours}
                        </TableCell>
                        <TableCell align={'center'}>
                            {score.sixes}
                        </TableCell>
                    </TableRow>
                );
            }
        }

        if (scores.length > 0) {
            return (
                <div>
                    <Paper>
                        <Typography
                            sx={{fontWeight: 'bold'}}
                            variant={'h5'}
                            align={"center"}
                        >
                            {inningsName}
                        </Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Batsman</TableCell>
                                    <TableCell align="center">Dismissal</TableCell>
                                    <TableCell align="center">Runs</TableCell>
                                    <TableCell align="center">Balls</TableCell>
                                    <TableCell align="center">4s</TableCell>
                                    <TableCell align="center">6s</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {scores}
                                {renderExtras(innings)}
                                {renderTotal(innings)}
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
            );
        }
    };

    const renderBowlingFigures = innings => {
        let scores = [];
        for (const score of match.bowlingFigures) {

            if (score.innings === innings) {
                scores.push(
                    <TableRow
                        key={'figure_' + score.id}
                        hover
                    >
                        <TableCell align={'center'}>
                            <Typography variant={'span'} className={'link'} onClick={handlePlayerClick(score.player.id)}>
                                {score.player.name}
                            </Typography>
                        </TableCell>
                        <TableCell align={'center'}>
                            {renderOverDetails(score.balls)}
                        </TableCell>
                        <TableCell align={'center'}>
                            {score.maidens}
                        </TableCell>
                        <TableCell align={'center'}>
                            {score.runs}
                        </TableCell>
                        <TableCell align={'center'}>
                            {score.wickets}
                        </TableCell>
                    </TableRow>
                );
            }
        }

        if (scores.length > 0) {
            return (
                <div className={'container'}>
                    <Paper className={'root'}>
                        <Table className={'table'}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Bowler</TableCell>
                                    <TableCell align="center">Overs</TableCell>
                                    <TableCell align="center">Maidens</TableCell>
                                    <TableCell align="center">Runs</TableCell>
                                    <TableCell align="center">Wickets</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {scores}
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
            );
        }
    };

    const renderInnings = innings => {
        let totalInningsCount = 0;

        for (const score of match.battingScores) {
            if (score.innings > totalInningsCount) {
                totalInningsCount = score.innings;
            }
        }


        if (innings <= totalInningsCount) {
            return (
                <div
                    className={'innings bordered-container'}
                    key={'innings_' + innings}
                >
                    <div className={'container'}>
                        {renderBattingScores(innings)}
                        {renderBowlingFigures(innings)}
                    </div>
                </div>
            );
        }
    };

    const renderScorecards = () => {
        let markup = [];

        if (Object.keys(match).length > 0) {
            for (let innings = 1; innings <= 4; innings++) {
                markup.push(renderInnings(innings));
            }
        }

        return (
            <div className={'row'}>
               <strong>
                   Scorecards:
                   &nbsp;
               </strong>
               <div className={'bordered-container'}>
                   <div className={'container'}>
                       {markup}
                   </div>
               </div>
           </div>
        );
    };

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const id = urlSearchParams.get('id');

        getMatch(id).then(matchResponse => {
            setMatch(matchResponse.data.data);
            setLoaded(true);
        });
    }, []);

    return (
        <>
            {
                loaded && <div>
                    {renderSeriesName()}
                    {renderTeams()}
                    {renderTossMarkup()}
                    {renderResultMarkup()}
                    {renderStadiumDetails()}
                    {renderStartTime()}
                    {renderPlayers()}
                    {renderManOfTheMatch()}
                    {renderScorecards()}
                </div>
            }
        </>
    );
}