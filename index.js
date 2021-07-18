const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');

const app = express();

// Bodyparser Middleware
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Signup Route
app.post('/signup', (req, res) => {
  const { firstName, lastName, email } = req.body;

  // Make sure fields are filled
  if (!firstName || !lastName || !email) {
    res.redirect('/fail.html');
    return;
  }

  // Construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  fetch('https://us6.api.mailchimp.com/3.0/lists/327053fff3', {
    method: 'POST',
    headers: {
      Authorization: 'auth 330dd50a2a1cd8b41672e7a3b16945ec-us6'
    },
    body: postData
  })
    .then(res.statusCode === 200 ?
      res.redirect('/success.html') :
      res.redirect('/fail.html'))
    .catch(err => console.log(err))
})

const PORT = process.env.PORT || 5050;

app.listen(PORT, console.log(`Server started on ${PORT}`));
