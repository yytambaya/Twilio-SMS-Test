const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
//const { getSystemErrorMap } = require('util');
//const { Console } = require('console');
const app = express();
//added
const validPins = ['6119031535', '5274150480', '1086864576', '7719536725', '9549158365', '8889139086', '8271677245', '5838172641', 
                  '1758351069', '9555895222', '7162372670', '4320971693', '3880629565', '9699453690', '7436769945', '7846420077', 
                  '9131961846', '0338106564', '8911120779', '7147325458']
const englishSuccessMessage = 'Genuine High Quality Seed by IAR-Samaru. Log-on to www.iar.gov.ng for more... Thank you.';
const hausaSuccessMessage = 'Ingantaccen Irin Shuka da IAR-Samaru. Shiga www.iar.giv.ng don karin bayani. Mun gode.'
const englishFailMessage = 'Fake Seed.';
const hausaFailMessage = 'Wannan Iri ba daga IAR-Samaru ba ne, Irin Boge ne.';

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send("Welcome to Twilio SMS Test")
})


app.post('/', (req, res) => {
  const twiml = new MessagingResponse();
  const {pin, lang} = extractRequest(req.body.Body);
  //console.log("PIN: " + pin);
  if(pin != ""){
    if(validPins.includes(pin)){
      var successMessage = lang.toLowerCase() == "hausa" ? hausaSuccessMessage : lang.toLowerCase() == "engslih" ? englishSuccessMessage : englishSuccessMessage;
      twiml.message(successMessage);
    }else{
      var failMessage = lang.toLowerCase() == "hausa" ? hausaFailMessage : lang.toLowerCase() == "engslih" ? englishFailMessage : englishFailMessage;
      twiml.message(failMessage);
    }
  }else{
    twiml.message("Invalid request")
  }  

  /*if (req.body.Body == 'hello') {
    twiml.message('Hi!');
  } else if (req.body.Body == 'bye') {
    twiml.message('Goodbye');
  } else {
    twiml.message(
      'IAR Samaru Seed Verification Service'
    );
  }*/

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

const port = process.env.PORT || 3000; 
http.createServer(app).listen(port, () => {
  console.log('Express server listening on port ' + port);
  //generatePins(10);
  //extractRequest('38893 English me')
  //const {pin, lang} = extractRequest("345262 Eng");
  //console.log("PIN: " + pin);

});

/*const generatePins = (number) => {
  var pin = 0;
  console.log("All PINS")
  for(let i=0; i<number; i++){
      pin = Math.floor((Math.random() * 10999999999) + 10000000000)
     console.log("PIN " + i + ' = ' + pin)
  }
}*/

const extractRequest = (req) => {
  if(req.includes(' ')){
    var pin = req.substring(0, req.indexOf(' '));
    var lang = req.substring(req.indexOf(' ') + 1);
  }else{
   var pin = req;
   var lang = "";
  }  
  //console.log("PIN: " + pin);
  //console.log("Language: " +  lang);
  return {pin: pin, lang: lang}
}