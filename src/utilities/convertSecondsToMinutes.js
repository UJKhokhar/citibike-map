export default function convertSecondsToMinutes(seconds) {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;

  return `${mm} minutes and ${ss} seconds`;
}
