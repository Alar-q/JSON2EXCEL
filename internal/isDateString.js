module.exports = function isDateString(str) {
  // console.log(typeof str);
  if(typeof str !== 'string'){
    return false;
  }
  const timestamp = Date.parse(str);
  return !isNaN(timestamp);
}