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
    }
}));

export default function PaginationBox(props) {
    const page = props.page;
    const totalCount = props.totalCount;
    const limit = props.limit;
    const goToPage = props.goToPage;

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
        <Container>
            <div className='paginationBox'>
                {markup}
            </div>
        </Container>
    );
}