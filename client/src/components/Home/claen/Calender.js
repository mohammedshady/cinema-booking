function isSameDayAndMonth(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth();
}

export function getDates(shows) {
  const currentDate = new Date();
  const daysArray = [];

  for (let i = 0; i < 5; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + i);
    const showTimes = shows.filter(show => isSameDayAndMonth(date, show.startTime))
      .map(show => ({ id: show._id, startTime: show.startTime }));
    if (showTimes.length > 0) {
      daysArray.push({
        day: date,
        showTimes: showTimes
      });
    }
  }

  return daysArray;
}