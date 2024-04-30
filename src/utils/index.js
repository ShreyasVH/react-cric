export const formatDateTimeString = (dateTimeString) => {
    let date = new Date(dateTimeString);
    let options = {
        day: 'numeric',
        month: 'short'
    };
    return date.toLocaleDateString('en-GB', options);
};

export const copyObject = (referencedObject) => JSON.parse(JSON.stringify(referencedObject));