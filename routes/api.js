"use strict";

const Translator = require("../components/translator.js");

module.exports = function(app) {
  const translator = new Translator();

  app.route("/api/translate").post((req, res) => {
    if (req.body.text == "") {
      return res.json({ error: "No text to translate" });
    }
    if (!req.body.text || !req.body.locale) {
      return res.json({ error: "Required field(s) missing" });
    }
    if (
      req.body.locale != "american-to-british" &&
      req.body.locale != "british-to-american"
    ) {
      return res.json({ error: "Invalid value for locale field" });
    }
    let translation = translator.translate(req.body.text, req.body.locale);

    let result = {};
    result.text = req.body.text;
    result.translation =
      translation == req.body.text
        ? "Everything looks good to me!"
        : translation;
    return res.json(result);
  });
};
