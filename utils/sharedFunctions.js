// Convert date format from ISO to DD/MM/YYYY
export const formatDate = (seconds) => {
  const date = new Date(seconds * 1000);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Compare two databases to return overlaps in specified fields
export const compareDatas = (data1, data2, field1, field2) => {
  const set2 = new Set(data2.map((item) => item[field2]));
  return data1.filter((item) => set2.has(item[field1]));
};
