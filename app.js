const express = require('express');
const fetch = require('node-fetch')
const csv = require('csvtojson')
const app = express();
const uuid = require('uuid')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.post('/', async (req, res) => {
  let url = req.body.csv.url
  if(!(url.endsWith('.csv'))){
    res.send('invalid url link')
  }
  let resp =await fetch(req.body.csv.url)
  let conv;
  conv = csv()
  if(req.body.csv.select_fields){
      let headers = req.body.csv.select_fields.join('|')

      headers = new RegExp(`(${headers})`)
      conv = csv({includeColumns: headers})
  }
    let js = await conv.fromStream(resp.body);
    let result = {conversion_key: uuid.v4(), json: js}
    result = JSON.stringify(result)
    res.json(result)

});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

app.listen(3000, console.log('Listening'))
module.exports = app;
