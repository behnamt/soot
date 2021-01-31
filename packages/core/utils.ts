import { GEO_RESOLUTION } from "classes/SootFacade";

export const formatDate = (date: number): string => {
  const d = new Date(0);
  d.setUTCMilliseconds(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }

  const hours = d.getHours();
  const minutes = d.getMinutes();

  return [year, month, day].join('-') + ' ' + hours + ':' + minutes;
};


export const increaseLocationResolution = (value: number): number => {
  return Number((value * GEO_RESOLUTION).toFixed());
}
export const decreaseLocationResolution = (value: number): number => {
  return value / GEO_RESOLUTION;
}