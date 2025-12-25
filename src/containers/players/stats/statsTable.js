import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { styled } from "@mui/system";

const Container = styled("div")(({ theme }) => ({
    '& .sortable': {
        cursor: 'pointer'
    }
}));

export default function StatsTable(props) {
    const columns = props.columns;
    const selectedFilters = props.selectedFilters;
    const stats = props.stats;
    const sortMap = props.sortMap;
    const handleSort = props.handleSort;

    const renderSortSymbol = key => ((sortMap.hasOwnProperty(key)) ? ((sortMap[key] === 'asc') ? '\u0020\u2191' : '\u0020\u2193') : '');

    return (
        <Container>
            <Table>
                <TableHead sx={{
                    "& .MuiTableCell-head": {
                        fontWeight: 600
                    },
                }}>
                    <TableRow>
                        {columns[selectedFilters.type].map(column => (
                            <TableCell
                                key={column.key}
                                className={column.sortable ? 'sortable': ''}
                                onClick={handleSort(column.key, selectedFilters.type)}
                            >
                                {column.displayKey}
                                {renderSortSymbol(column.key)}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {stats.map(stat => (
                        <TableRow key={stat.id}>
                            {columns[selectedFilters.type].map(column => (
                                <TableCell key={`${column.key}_${stat.id}`}>
                                    {stat[column.key]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
}