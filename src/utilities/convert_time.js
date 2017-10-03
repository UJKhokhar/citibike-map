export default function convertTimeToMinutes(time) {
  const regex = new RegExp('([0-9]+):([0-5]?[0-9]):([0-5]?[0-9])');
  const timeSplit = regex.exec(time);
  return (parseInt(timeSplit[1], 10) * 60) + parseInt(timeSplit[2], 10);
}
