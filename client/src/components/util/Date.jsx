const Date = ({ date, noyear }) => {
  if (noyear) {
    const newDate = new window.Date(date);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = newDate.getDate();
    const month = monthNames[newDate.getMonth()];
    return <>{`${day} ${month}`}</>;
  } else {
    const newDate = new window.Date(date);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = newDate.getDate();
    const month = monthNames[newDate.getMonth()];
    const year = newDate.getFullYear();

    return <>{`${day} ${month}, ${year}`}</>;
  }
};

export default Date;
