/* 
  Today I Learned webapp
*/
const assert = require('assert');
const FactStore = require('./lib/factStore')
const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.use(express.static('public')) // static file server
app.use(express.urlencoded({extended: true})) // all POST bodies are expected to be URL-encoded

const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const store = new FactStore(dbUrl);

app.get('/pastweek', getWeek)

app.get('/facts', getAll);

/*async function showEntries(){
  const display = document.getElementById('recentEntries');
  console.log(display)
  //call getWeek() then format the response,
  thisWeek = await getWeek();
  console.log(thisWeek)
  //thisWeek.forEach(create list item? with title, time, and text)
    //display.innerHTML += item
  thisWeek.forEach(item => {
    console.log(item)
    display.innerHTML += '<div>{item.when} {item.title}: {item.text}</div>'
  });
};*/

app.get('/week', (request, response) => {
  showEntries();
  //this isn't the right way to get to the index file
  response.send(public/index.html)
})

async function getWeek(request, response) {
  let cursor = await store.thisWeek();
  let output = [];
  cursor.forEach((entry) => {
    //this is just a test for how to target elements when we shift to react, it works
    let item = `<div>${entry.when}: <a href=${entry._id}>${entry.title}</a></div>`
    output.push(item);
  }, function (err) {
    assert.equal(null, err);
    console.log("Sending " + output.length + " records to client");
    response.type('text/javascript')
      .send(JSON.stringify(output))
  });
}

async function getAll(request, response) {
  let cursor = await store.all();
  let output = [];
  cursor.forEach((entry) => {
    output.push(entry);
  }, function (err) {
    assert.equal(null, err);
    console.log("Sending " + output.length + " records to client");
    response.type('application/json')
      .send(JSON.stringify(output))
  });
}

app.post('/facts', addFact);

app.post('/comment', addComment);

async function addComment(request, response) {
  let result = await store.comment(request.body.title/*this will be reaplaced by the ID of the post that you're on, eventually*/, request.body.name.trim(), request.body.comment.trim())
  let output = {
    status: 'ok'
  }
  console.log("result: " + result)
  response.type('application/json').send(JSON.stringify(output))
}

async function addFact(request, response) {
  let result = await store.addEntry(request.body.title.trim(), request.body.text.trim())
  let output = {
    status: 'ok',
    id: result.id
  }
  response
    .type('application/json')
    .send(JSON.stringify(output))
}

app.listen(port, () => console.log(`TIL web app listening on port ${port}!`))
