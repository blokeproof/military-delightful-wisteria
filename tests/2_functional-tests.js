const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server.js");

chai.use(chaiHttp);

let Translator = require("../components/translator.js");

suite("Functional Tests", () => {
  test("Translation with text and locale fields: POST request to /api/translate", function(done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        text: "I ate yogurt for breakfast.",
        locale: "american-to-british"
      })
      .end(function(err, res) {
        assert.propertyVal(
          res.body,
          "translation",
          'I ate <span class="highlight">yoghurt</span> for breakfast.'
        );
        done();
      });
  });

  test("Translation with text and invalid locale field: POST request to /api/translate", function(done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        text: "I ate yogurt for breakfast.",
        locale: "american-to-british"
      })
      .end(function(err, res) {
        assert.propertyVal(
          res.body,
          "translation",
          'I ate <span class="highlight">yoghurt</span> for breakfast.'
        );
        done();
      });
  });

  test("Translation with missing text field: POST request to /api/translate", function(done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        locale: "american-to-british"
      })
      .end(function(err, res) {
        assert.propertyVal(res.body, "error", "Required field(s) missing");
        done();
      });
  });

  test("Translation with missing locale field: POST request to /api/translate", function(done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        text: "I ate yogurt for breakfast."
      })
      .end(function(err, res) {
        assert.propertyVal(res.body, "error", "Required field(s) missing");
        done();
      });
  });

  test("Translation with empty text: POST request to /api/translate", function(done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        text: "",
        locale: "american-to-british"
      })
      .end(function(err, res) {
        assert.propertyVal(res.body, "error", "No text to translate");
        done();
      });
  });

  test("Translation with text that needs no translation: POST request to /api/translate", function(done) {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        text: "Like a high tech Rube Goldberg machine.",
        locale: "american-to-british"
      })
      .end(function(err, res) {
        assert.propertyVal(
          res.body,
          "translation",
          'Like a high tech <span class="highlight">Heath Robinson device</span>.'
        );
        done();
      });
  });
});
