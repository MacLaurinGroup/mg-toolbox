describe("GET", function() {
  let dbConn;

  //---------------------------------------

  beforeAll(async function() {

  });

  afterAll(async function() {

  });

  //---------------------------------------

  it("Simple Log Test", async function() {

    log = require("../log");
    log = new log("TST");

    const { CodeError } = require("../error");

    log.info("1234");
    log.config("CONFIG message");
    log.severe("SEVERE message");

    console.log( "log.INFO=" + log.INFO );
    console.log( "log.level=" + log.level );

    log.level = log.SEVERE;
    console.log( "log.level=" + log.level );
    log.severe("SEVERE message2");
    log.info("INFO");
    log.log("alan");

    log.severe({alan:2});

    try{
      throw new Error("WTF! something has gone wrong");
    }catch(e){
      log.severe(e, false);
    }


    try{
      throw new CodeError(21, "Special Error", "Some Other Data");
    }catch(e){
      log.severe(e);
    }

  });

  //---------------------------------------

  it("Another scope", async function() {

    log = require("../log");
    log = new log("Tst2");

    log.info("INFO message");
    log.config("CONFIG message");
    log.severe("SEVERE message");

  });

  //---------------------------------------

  it("Another scope2", async function() {

    log = new (require("../log"))("abc");

    log.info("INFO message");
    log.config("CONFIG message");
    log.severe("SEVERE message");

  });


});