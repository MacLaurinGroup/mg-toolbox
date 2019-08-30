const sanitizer = require("../sanitizer");

describe("sanitizer", function() {

  //---------------------------------------

  beforeAll(function() {
  });

  afterAll(function() {
  });

  //---------------------------------------

  it("Basic String Test", function() {

    const options = {
      toLowerCase : true,
      encode : true
    };
    let inData, outData;

    inData = "<h1>Hello</h1>";
    outData = sanitizer.filter(inData,options);
    expect( outData ).toBe("&lt;h1&gt;hello&lt;/h1&gt;");

    inData = "<h1>Hello</h1>";
    options.toLowerCase = false;
    outData = sanitizer.filter(inData,options);
    expect( outData ).toBe("&lt;h1&gt;Hello&lt;/h1&gt;");

    inData = "<h1>Hello</h1>";
    options.az09 = true;
    outData = sanitizer.filter(inData,options);
    expect( outData ).toBe("h1Helloh1");

    inData = "<h1>Hello_</h1>";
    options.az09_ = true;
    outData = sanitizer.filter(inData,options);
    expect( outData ).toBe("h1Hello_h1");

    inData = null;
    outData = sanitizer.filter(inData,options);
    expect( outData ).toBe(null);

  });

  //---------------------------------------

  it("Basic String Test", function() {

    const options = {
      toLowerCase : true,
      encode : true,
      fields : ["a","b"]
    };
    let inData = {
      a : "<h1>Hello</h1>",
      b : "<h1>Hello</h1>",
      c : "<h1>Hello</h1>"
    }, outData;

    outData = sanitizer.filter(inData,options);
    expect( outData.a ).toBe("&lt;h1&gt;hello&lt;/h1&gt;");
    expect( outData.b ).toBe("&lt;h1&gt;hello&lt;/h1&gt;");
    expect( outData.c ).toBe("<h1>Hello</h1>");

  });
});