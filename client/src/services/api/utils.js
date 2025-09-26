const encodeValue = (value) => encodeURIComponent(value);

export const buildQueryString = (params = {}) => {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "");

  if (entries.length === 0) {
    return "";
  }

  const query = entries
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value
          .filter((item) => item !== undefined && item !== null)
          .map((item) => `${encodeValue(key)}=${encodeValue(item)}`);
      }

      if (typeof value === "object") {
        return `${encodeValue(key)}=${encodeValue(JSON.stringify(value))}`;
      }

      return `${encodeValue(key)}=${encodeValue(value)}`;
    })
    .join("&");

  return query;
};

export const withQuery = (path, params) => {
  const query = buildQueryString(params);
  if (!query) {
    return path;
  }

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${query}`;
};
