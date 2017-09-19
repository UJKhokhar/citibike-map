export function convertTimeToMinutes(time) {
  var regex = new RegExp('([0-9]+):([0-5]?[0-9]):([0-5]?[0-9])');
  var time_split = regex.exec(time);
  return parseInt(time_split[1]) * 60 + parseInt(time_split[2]);
}
