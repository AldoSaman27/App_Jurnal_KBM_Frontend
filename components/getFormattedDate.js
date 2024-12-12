const getFormattedDate = (dateValue) => {
    const dateFormatter = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return dateFormatter.format(dateValue);
};

export default getFormattedDate;
