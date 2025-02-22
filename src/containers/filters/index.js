import {
    Button,
    IconButton,
    Fab,
    Dialog,
    AppBar,
    Accordion,
    AccordionSummary,
    AccordionDetails, Typography,
    Checkbox, FormControlLabel,
    Radio
} from '@mui/material';

import { FilterList, Close, ExpandMore } from "@mui/icons-material";
import { FILTER_TYPE } from '../../constants';
import Toolbar from '@mui/material/Toolbar';

import { styled } from '@mui/system';

const Container = styled("div")(({ theme }) => ({
    '.appliedFilter': {
        display: 'inline-block',
        borderRadius: '50%',
        minWidth: theme.typography.pxToRem(10),
        minHeight: theme.typography.pxToRem(10),
        backgroundColor: '#27AE60',
        marginLeft: theme.typography.pxToRem(10)
    }
}));

export default function Filters(props) {
    const openFilters = (event) => props.onFilterOpen && props.onFilterOpen(event);

    const closeFilters = event => props.onFilterClose && props.onFilterClose(event);

    const renderButton = () => {
        return (
            <Fab
                color="primary"
                size="small"
                onClick={openFilters}
                sx={{position: 'fixed', bottom: '16px', right: '16px'}}
            >

                <IconButton>
                    <FilterList />
                </IconButton>
            </Fab>
        );
    };

    const isFilterSelected = key => (props.selected.hasOwnProperty(key) && (0 !== props.selected[key].length));

    const renderFilterSelectedIndicator = (key) => {
        if (isFilterSelected(key)) {
            return <span className='appliedFilter' />
        }
    };

    const clearFilter = (key) => (event) => props.clearFilter && props.clearFilter(key);

    const renderClearFilterButton = (key) => {
        if (isFilterSelected(key)) {
            return (
                <Button
                    onClick={clearFilter(key)}
                    color="primary"
                    TouchRippleProps={{
                        'data-key': key
                    }}
                    sx={{float: 'right'}}
                >
                    <span>
                        Clear
                    </span>
                </Button>
            );
        }
    };

    const handleEvent = event => props.handleEvent && props.handleEvent(event);

    const isCheckboxChecked = (key, id) => {
        let selectedFilters = props.selected;
        return selectedFilters.hasOwnProperty(key) && (selectedFilters[key].indexOf(id) !== -1);
    };

    const renderCheckboxOptions = (key, options) => {
        let markup = [];

        for (let index in options) {
            if (options.hasOwnProperty(index)) {
                let option = options[index];
                markup.push(
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isCheckboxChecked(key, option.id)}
                                name={key + '[]'}
                                data-filter={key}
                                onChange={handleEvent}
                                inputProps={{
                                    'data-key': key,
                                    'data-type': FILTER_TYPE.CHECKBOX,
                                    'data-id': option.id
                                }}
                            />
                        }
                        label={option.name}
                        key={key + '_' + option.id}
                    />
                );
            }
        }

        return markup;
    };

    const renderCheckboxFilter = (key, filter) => {
        return (
            <div>
                {renderClearFilterButton(key)}
                {renderCheckboxOptions(key, filter.values)}
            </div>
        );
    };

    const renderRadioOptions = (key, options) => {
        let markup = [];

        for (let index in options) {
            if (options.hasOwnProperty(index)) {
                let option = options[index];
                markup.push(
                    <FormControlLabel
                        control={
                            <Radio
                                checked={isCheckboxChecked(key, option.id)}
                                name={key + '[]'}
                                data-filter={key}
                                onChange={handleEvent}
                                inputProps={{
                                    'data-key': key,
                                    'data-type': FILTER_TYPE.RADIO,
                                    'data-id': option.id
                                }}
                            />
                        }
                        label={option.name}
                        key={key + '_' + option.id}
                    />
                );
            }
        }

        return markup;
    };

    const renderRadioFilter = (key, filter) => {
        return (
            <div>
                {renderClearFilterButton(key)}
                {renderRadioOptions(key, filter.values)}
            </div>
        );
    };

    const renderFilterContent = (key, filter) => {
        switch (filter.type) {
            case FILTER_TYPE.CHECKBOX:
                return renderCheckboxFilter(key, filter);
            case FILTER_TYPE.RADIO:
                return renderRadioFilter(key, filter);
            // case FILTER_TYPE.RANGE:
            //     return renderRangeFilter(key, filter);

        }
    };

    const renderFilter = (key, filter) => {
        return (
            <Accordion
                key={key}
            >
                <AccordionSummary expandIcon={<IconButton>
                    <ExpandMore />
                </IconButton>}>
                    <Typography>
                        {filter.displayName}
                        {renderFilterSelectedIndicator(key)}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {renderFilterContent(key, filter)}
                </AccordionDetails>
            </Accordion>
        );
    };

    const renderFilters = () => {
        let markup = [];

        for (const [key, filterObject] of Object.entries(props.options)) {
            markup.push(renderFilter(key, filterObject));
        }

        return markup;
    };

    const applyFilters = (event) => props.applyFilters && props.applyFilters();

    const renderPopup = () => {
        return (
            <Dialog
                open={props.isOpen}
                fullScreen
            >
                <Container>
                <AppBar sx={{position: 'relative'}}>
                    <Toolbar>
                        <IconButton edge={'start'} onClick={closeFilters}>
                            <Close />
                        </IconButton>

                        <Button autoFocus color="inherit" onClick={applyFilters}>
                            Apply
                        </Button>
                    </Toolbar>
                </AppBar>

                {renderFilters()}
                </Container>
            </Dialog>
        );
    }

    return (
        <>
            <Container>
                {renderButton()}
                {renderPopup()}
            </Container>
        </>
    );
}