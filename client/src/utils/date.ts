import dayjs from 'dayjs';

export const isSelectedDate = (date: Date, y: number, m: number, d: number) => {
  if (y === date.getFullYear() && m === date.getMonth() && d === date.getDate())
    return true;
  return false;
};

export const isToday = (date: Date) => {
  const now = new Date();
  if (now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth() && now.getDate() === date.getDate())
    return true;
  return false;
};

export const isFirstDate = (date: Date) => {
  return date.getDate() === 1;
};

export const getYearArray = () => {
  const res = [];
  const year = new Date().getFullYear();
  for (let i = year - 7; i <= year + 5; i++) {
    res.push(i);
  }
  return res;
};

export const formatDateTime = (date: Date | string) => {
  const dateTime = new Date(date);
  return `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${dateTime.getDate()} ${dateTime.getHours()}:${dateTime.getMinutes()}`;
};

export const combineDate = (date1: Date | string, date2: Date | string) => {
  const date = dayjs(date1.toString());
  const time = dayjs(date2.toString() || '2024-01-01 00:00:00');
  const result = date.hour(time.hour()).minute(time.minute()).second(time.second());
  return result;
};

export const getMinimumReservationDate = () => {
  const now = new Date();
  const resDate = new Date(now.getTime() + 36 * 3600 * 1000); // 36 hours ahead in time
  return dayjs(resDate).format('MM/DD/YYYY hh:mm A');
};