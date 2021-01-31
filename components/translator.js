const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

// Reverse object key/value pairs
function reverseDict(obj) {
  let result = {};
  for (var key in obj) {
    result[obj[key]] = key;
  }
  return result;
}

// American/British dictionary
let americanBritishDict = {
  ...americanOnly,
  ...americanToBritishSpelling
};

// British/American dictionary
const reverseAmericanToBritishSpelling = reverseDict(americanToBritishSpelling);
const reverseAmericanToBritishTitles = reverseDict(americanToBritishTitles);

let britishAmericanDict = {
  ...britishOnly,
  ...reverseAmericanToBritishSpelling
};

class Translator {
  toSimilarCase(original, matched) {
    if (original.substr(0, 1) >= "A") {
      return (
        matched.substr(0, 1).toUpperCase() + matched.substr(1).toLowerCase()
      );
    } else {
      return matched.toLowerCase();
    }
  }

  replaceAll(str, mapObj) {
    if (str == null || mapObj == null) {
      return null;
    }
    const re = new RegExp(Object.keys(mapObj).join("|"), "gi");

    return str.replace(re, matched => mapObj[matched.toLowerCase()]);
  }

  replaceAllWithHighlight(str, mapObj) {
    const re = new RegExp(Object.keys(mapObj).join("|"), "gi");

    return str.replace(re, matched => {
      return (
        '<span class="highlight">' + mapObj[matched.toLowerCase()] + "</span>"
      );
    });
  }

  translate(text, locale) {
    console.log(americanBritishDict["breakfast"]);

    if (text == "") {
      return "";
    }

    const dict =
      locale === "american-to-british"
        ? americanBritishDict
        : britishAmericanDict;

    const titlesHonorificsDict =
      locale === "american-to-british"
        ? americanToBritishTitles
        : reverseAmericanToBritishTitles;

    const timeRegex =
      locale === "american-to-british"
        ? /([1-9]|1[012]):[0-5][0-9]/g
        : /([1-9]|1[012]).[0-5][0-9]/g;

    const matchesMap = {};

    // Search for titles/honorifics and add'em to the matchesMap object
    Object.entries(titlesHonorificsDict).map(([k, v]) => {
      if (text.toLowerCase().includes(k)) {
        if (text.substr(text.indexOf(k), 1) <= "Z") {
          matchesMap[k] = v.substr(0, 1).toUpperCase() + v.substr(1);
        } else {
          matchesMap[k] = v;
        }
      }
    });

    // Filter words with spaces from current dictionary
    const wordsWithSpace = Object.fromEntries(
      Object.entries(dict).filter(([k, v]) => k.includes(" "))
    );

    // Search for spaced word matches and add'em to the matchesMap object
    Object.entries(wordsWithSpace).map(([k, v]) => {
      if (text.toLowerCase().includes(k)) {
        if (text.substr(text.indexOf(k), 1).charCodeAt(0) <= 97) {
          matchesMap[k] = v.substr(0, 1).toUpperCase() + v.substr(1);
        } else {
          matchesMap[k] = v;
        }
      }
    });

    // Search for individual word matches and add'em to the matchesMap object
    text
      .toLowerCase()
      .match(/(\w+([-'])(\w+)?['-]?(\w+))|\w+/g)
      .map(word => {
        if (dict[word]) {
          if (
            text.substr(text.toLowerCase().indexOf(word), 1).charCodeAt(0) <= 97
          ) {
            return (matchesMap[word] =
              dict[word].substr(0, 1).toUpperCase() + dict[word].substr(1));
          } else {
            return (matchesMap[word] = dict[word]);
          }
        }
      });

    // Search for time matches and add'em to the matchesMap object
    const matchedTimes = text.toLowerCase().match(timeRegex);

    if (matchedTimes) {
      matchedTimes.map(e => {
        if (locale === "american-to-british") {
          return (matchesMap[e] = e.replace(":", "."));
        }
        return (matchesMap[e] = e.replace(".", ":"));
      });
    }

    // No matches
    if (Object.keys(matchesMap).length === 0) return text;

    // Return logic
    const translation = this.replaceAllWithHighlight(text, matchesMap);

    return translation;
  }
}

module.exports = Translator;
