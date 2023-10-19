const handlebars = require("handlebars");

handlebars.registerHelper("ifExt", function (v1, operator, v2, options) {
  let result;
  switch (operator) {
    case "==":
      result = v1 == v2;
      break;
    case "===":
      result = v1 === v2;
      break;
    case "!=":
      result = v1 != v2;
      break;
    case "!==":
      result = v1 !== v2;
      break;
    case "<":
      result = v1 < v2;
      break;
    case "<=":
      result = v1 <= v2;
      break;
    case ">":
      result = v1 > v2;
      break;
    case ">=":
      result = v1 >= v2;
      break;
    case "&&":
      result = v1 && v2;
      break;
    case "||":
      result = v1 || v2;
      break;
    default:
      result = false;
      break;
  }

  if (result) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

handlebars.registerHelper("elseExt", function (options) {
  return options.fn(this);
});

handlebars.registerHelper("concat", function () {
  let args = Array.prototype.slice.call(arguments, 0, -1);
  return args.join("");
});

handlebars.registerHelper("compareIDs", function (id1, id2, options) {
  return id1 === id2 ? options.fn(this) : options.inverse(this);
});

module.exports = handlebars;