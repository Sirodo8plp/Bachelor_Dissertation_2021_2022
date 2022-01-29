export async function dataUrlToFile(
  dataUrl: string | null,
  fileName: string
): Promise<File | null> {
  if(!dataUrl) return null;
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], fileName, { type: "image/png" });
}
