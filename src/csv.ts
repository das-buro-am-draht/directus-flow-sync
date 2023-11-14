export const getArrayFromCsv = (importIds: {}) =>
  String(importIds)
    .split(',')
    .map((id) => id.trim())
    .filter((id) => [...id].length > 0);
