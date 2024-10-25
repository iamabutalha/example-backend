export const reverse = (string) => {
  return string.split("").reverse().join("");
};

export const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item;
  };
  // if array length is zero return zero else return the average
  return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length;
};

export const square = (num) => {
  return num * num;
};
