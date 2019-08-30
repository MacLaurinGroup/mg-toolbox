const sanitizer = require("../sanitizer");

describe("sanitizer", function () {

  //---------------------------------------

  beforeAll(function () {});

  afterAll(function () {});

  //---------------------------------------

  it("Basic String Test", function () {

    const options = {
      toLowerCase: true,
      encode: true
    };
    let inData, outData;

    inData = "<h1>Hello</h1>";
    outData = sanitizer.filter(inData, options);
    expect(outData).toBe("&lt;h1&gt;hello&lt;/h1&gt;");

    inData = "<h1>Hello</h1>";
    options.toLowerCase = false;
    outData = sanitizer.filter(inData, options);
    expect(outData).toBe("&lt;h1&gt;Hello&lt;/h1&gt;");

    inData = "<h1>Hello</h1>";
    options.az09 = true;
    outData = sanitizer.filter(inData, options);
    expect(outData).toBe("h1Helloh1");

    inData = "<h1>Hello_</h1>";
    options.az09_ = true;
    outData = sanitizer.filter(inData, options);
    expect(outData).toBe("h1Hello_h1");

    inData = null;
    outData = sanitizer.filter(inData, options);
    expect(outData).toBe(null);

  });

  //---------------------------------------

  it("Basic String Test 2", function () {
    let inData, outData;
    inData = "<h1>Hello</h1>";
    outData = sanitizer.filter(inData);
    expect(outData).toBe("&lt;h1&gt;Hello&lt;/h1&gt;");
  });

  //---------------------------------------

  it("Basic Map Test", function () {

    const options = {
      toLowerCase: true,
      encode: true,
      fields: ["a", "b"]
    };
    let inData = {
        a: "<h1>Hello</h1>",
        b: "<h1>Hello</h1>",
        c: "<h1>Hello</h1>"
      },
      outData;

    outData = sanitizer.filter(inData, options);
    expect(outData.a).toBe("&lt;h1&gt;hello&lt;/h1&gt;");
    expect(outData.b).toBe("&lt;h1&gt;hello&lt;/h1&gt;");
    expect(outData.c).toBe("<h1>Hello</h1>");

  });

  //---------------------------------------

  it("Basic Map Test 2", function () {

    const options = {
      toLowerCase: true,
      encode: true
    };
    let inData = {
        a: "<h1>Hello</h1>",
        b: "<h1>Hello</h1>",
        c: "<h1>Hello</h1>",
        d: 12,
        e: "45",
        f: null
      },
      outData;

    outData = sanitizer.filter(inData, options);
    expect(outData.a).toBe("&lt;h1&gt;hello&lt;/h1&gt;");
    expect(outData.b).toBe("&lt;h1&gt;hello&lt;/h1&gt;");
    expect(outData.c).toBe("&lt;h1&gt;hello&lt;/h1&gt;");
    expect(outData.d).toBe(12);
    expect(outData.e).toBe("45");
    expect(outData.f).toBe(null);

  });

  //---------------------------------------

  it("Basic Map Test 3", function () {

    const options = {
      toLowerCase: true,
      encode: true,
      fieldsIgnored: ["b"]
    };
    let inData = {
        a: "<h1>Hello</h1>",
        b: "<h1>Hello</h1>",
        c: "<h1>Hello</h1>",
        d: 12,
        e: "45",
        f: null
      },
      outData;

    outData = sanitizer.filter(inData, options);
    expect(outData.a).toBe("&lt;h1&gt;hello&lt;/h1&gt;");
    expect(outData.b).toBe("<h1>Hello</h1>");
    expect(outData.c).toBe("&lt;h1&gt;hello&lt;/h1&gt;");
    expect(outData.d).toBe(12);
    expect(outData.e).toBe("45");
    expect(outData.f).toBe(null);

  });

  //---------------------------------------

  it("Basic Map Test 4", function () {

    const options = {
      toLowerCase: true,
      encode: true,
      fieldsIgnored: ["b"]
    };

    let inData = {
        a: "<h1>Hello</h1>",
        b: "<h1>Hello</h1>",
        c: "<h1>Hello</h1>",
        d: 12,
        e: "45",
        f: [{
          "text": "",
          "header": "New page",
          "questions": [{
            "text": "A question here",
            "type": "text"
          }]
        }, {
          "text": "<h1>Hello</h1>",
          "header": "New page",
          "questions": [{
            "text": "<h1>Hello</h1>",
            "type": "boolean"
          }]
        }]
      },
      outData;

      outData = sanitizer.filter(inData, options);
      expect(outData.a).toBe("&lt;h1&gt;hello&lt;/h1&gt;");
      expect(outData.b).toBe("<h1>Hello</h1>");
      expect(outData.c).toBe("&lt;h1&gt;hello&lt;/h1&gt;");
      expect(outData.d).toBe(12);
      expect(outData.e).toBe("45");

      expect(outData.f[1].text).toBe("&lt;h1&gt;hello&lt;/h1&gt;");
      expect(outData.f[1].questions[0].text).toBe("&lt;h1&gt;hello&lt;/h1&gt;");
  });

});