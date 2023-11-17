export const getArrayFromCsv = (importIds: unknown) =>
  String(importIds)
    .split(',')
    .map((id) => id.trim())
    .filter((id) => [...id].length > 0);
