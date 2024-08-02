export async function checkDownloadSpeed(baseUrl: string): Promise<number> {
  const startTime = performance.now();

  const response = await fetch(baseUrl);

  const data = await response.blob();

  const endTime = performance.now();

  const duration = (endTime - startTime) / 1000; // convert to seconds
  const sizeInBytes = data.size;
  const sizeInMegabits = (sizeInBytes * 8) / (1024 * 1024); // convert to megabits

  const speedMbps = sizeInMegabits / duration;

  return speedMbps;
}
