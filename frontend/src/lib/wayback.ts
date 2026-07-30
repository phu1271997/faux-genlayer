export async function getWaybackArchiveUrl(targetUrl: string): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  return `https://web.archive.org/web/${timestamp}/${targetUrl}`;
}
