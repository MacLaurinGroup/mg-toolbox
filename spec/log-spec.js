describe("GET", function() {
  let dbConn;

  //---------------------------------------

  beforeAll(async function() {

  });

  afterAll(async function() {

  });

  //---------------------------------------

  it("Simple Log Test", async function() {

    log = require("../log")("dbOp");

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
      throw new Error("fuck me something has gone wrong");
    }catch(e){
      log.severe(e);
    }

  });

});