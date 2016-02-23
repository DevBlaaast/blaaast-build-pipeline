const helpers = {
  json(context){
    return JSON.stringify(context);
  },
  'start-row'(larg, itemsPerLine) {
    const modulo = larg % itemsPerLine;

    if (modulo === 0) {
      return true;
    } else {
      return false;
    }
  }
};

module.exports = helpers;
