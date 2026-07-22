export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function formatDuration(value: string): string {
  const [hours, minutes] = value.split(':');
  if (hours === undefined || minutes === undefined) return value;
  const parts = [];
  if (Number(hours) > 0) parts.push(`${Number(hours)}h`);
  if (Number(minutes) > 0) parts.push(`${Number(minutes)}m`);
  return parts.length > 0 ? parts.join(' ') : '0m';
}

export function isoToDatetimeLocal(value: string): string {
  const match = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/.exec(value);
  if (match) return match[1];
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function durationToHoursMinutes(value: string): { hours: number; minutes: number } {
  const [hours, minutes] = value.split(':');
  return { hours: Number(hours) || 0, minutes: Number(minutes) || 0 };
}
