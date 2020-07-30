export const uuidGenerator = () => {
  let originStr = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    originChar = "0123456789abcdef",
    len = originChar.length;
  return originStr.replace(/x/g, function(match) {
    return originChar.charAt(Math.floor(Math.random() * len));
  });
};
