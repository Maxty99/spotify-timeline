export function milis_to_time_string(milis: number) {
  const total_seconds_listened = Math.floor(milis / 1000);
  const seconds = total_seconds_listened % 60;
  const minutes = (total_seconds_listened - seconds) / 60;
  return `${minutes}:${
    seconds.toLocaleString("en-US", { minimumIntegerDigits: 2 })
  }`;
}
