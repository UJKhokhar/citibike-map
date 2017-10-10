export default function convertMinutesToTime(minutes) {
  let hour = Math.floor(minutes / 60);
  let min = minutes % 60;

  hour = hour < 10 ? `0${hour}` : hour;
  min = min < 10 ? `0${min}` : min;

  return `${hour}:${min}`;
}
