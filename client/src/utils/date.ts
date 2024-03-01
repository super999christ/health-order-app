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