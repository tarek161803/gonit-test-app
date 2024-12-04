export const buildQuery = (params) => {
  const query = Object.keys(params)
    .filter((key) => params[key] !== "" && params[key] !== null && params[key] !== undefined)
    .map((key) => {
      let value = params[key];
      if (typeof value === "string") {
        value = value.trim();
      }
      if (Array.isArray(value)) {
        return value.map((item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`).join("&");
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join("&");

  return query ? `?${query}` : "";
};
