import {Autocomplete, Box, Button, TextField, Typography} from '@mui/material';
import { useEffect, useState } from 'react';
import { search, merge } from '../../../endpoints/players';
import { showLoader, hideLoader } from '../../../utils';

export default function MergePlayers () {
    const [ fromPlayerList, setFromPlayerList ] = useState([]);
    const [ toPlayerList, setToPlayerList ] = useState([]);
    const [ fromKeyword, setFromKeyword ] = useState('');
    const [ toKeyword, setToKeyword ] = useState('');
    const [ formData, setFormData ] = useState({});
    const [ fromPlayer, setFromPlayer ] = useState(null);
    const [ toPlayer, setToPlayer ] = useState(null);

    useEffect(() => {
        if (fromKeyword.length > 2) {
            search(fromKeyword).then(searchResponse => {
                const responseData = searchResponse.data;
                setFromPlayerList(responseData.data.items.map(player => ({
                    id: player.id,
                    name: player.name,
                    country: player.country.name,
                    dateOfBirth: player.dateOfBirth
                })));
            });
        }
    }, [fromKeyword]);

    useEffect(() => {
        if (toKeyword.length > 2) {
            search(toKeyword).then(searchResponse => {
                const responseData = searchResponse.data;
                setToPlayerList(responseData.data.items.map(player => ({
                    id: player.id,
                    name: player.name,
                    country: player.country.name,
                    dateOfBirth: player.dateOfBirth
                })));
            });
        }
    }, [toKeyword]);

    const handleFromPlayerSelect = (event, value) => {
        if (value) {
            setFormData(Object.assign(formData, { playerIdToMerge: value.id }));
            setFromPlayer(value);
        }
    };

    const handleToPlayerSelect = (event, value) => {
        if (value) {
            setFormData(Object.assign(formData, { originalPlayerId: value.id }));
            setToPlayer(value);
        }
    };

    const handleSubmit = async event => {
        event.preventDefault();

        showLoader();

        const mergeResponse = await merge(formData);
        let myEvent;
        if (mergeResponse.status === 200) {
            myEvent = new CustomEvent('show-alert', {
                detail: {
                    severity: 'success',
                    message: 'Merged successfully'
                }
            });
            setFormData({});
            setFromPlayer(null);
            setToPlayer(null);
        } else {
            myEvent = new CustomEvent('show-alert', {
                detail: {
                    severity: 'error',
                    message: mergeResponse.data.message
                }
            });
        }
        window.dispatchEvent(myEvent);
        hideLoader();
    };

    const getLabel = option => {
        return `${option.id}. ${option.name} ${option.country} ${option.dateOfBirth}`;
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Typography variant="h5" gutterBottom>
                    Merge Players
                </Typography>
                <Box display="flex" gap={2}>
                    <Autocomplete
                        value={fromPlayer}
                        disablePortal
                        onInputChange={(event, newInputValue) => {
                            setFromKeyword(newInputValue);
                        }}
                        onChange={(event, value) => handleFromPlayerSelect(event, value)}
                        options={fromPlayerList}
                        getOptionLabel={getLabel}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="From" />}
                    />

                    <Autocomplete
                        value={toPlayer}
                        disablePortal
                        onInputChange={(event, newInputValue) => {
                            setToKeyword(newInputValue);
                        }}
                        getOptionLabel={getLabel}
                        onChange={(event, value) => handleToPlayerSelect(event, value)}
                        options={toPlayerList}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="To" />}
                    />
                </Box>

                <Button sx={{ marginTop: '1%' }} variant={'contained'} type={'submit'} disabled={Object.keys(formData).length < 2}>
                    Merge
                </Button>
            </form>
        </>
    );
}