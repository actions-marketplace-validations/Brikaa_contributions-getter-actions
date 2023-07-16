const formatNumber = (no: number) => (no < 10 ? "0" : "") + no;
export const formatDate = (date: Date) =>
  `${date.getFullYear()}-${formatNumber(date.getMonth() + 1)}-${formatNumber(
    date.getDate(),
  )}`;

export const generateRandomString = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let string = "";
  for (let i = 0; i < 16; ++i)
    string += characters[Math.floor(Math.random() * characters.length)];
  return string;
};
