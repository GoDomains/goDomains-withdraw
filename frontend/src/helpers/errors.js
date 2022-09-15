export const getErrorMessage = (e) => {
  if (e.error) return e.error;
  if (e.response) {
    const { data } = e.response;
    const firstKey = Object.keys(data)[0];
    if (Array.isArray(data[firstKey])) {
      return `${firstKey} : ${data[firstKey][0]}`;
    } else {
      return data[firstKey];
    }
  }
  return e.message;
};
