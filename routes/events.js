var express = require('express');
var router = express.Router();
var Event = require('../models/Event');

/** Affichage du formulaire de création */
router.get('/new', (req, res) => {
  res.render('events/new', { event: new Event() });
});

/** Enregistrement des données du formulaire de création */
router.post('/new', async (req, res) => {
  try {
    let event = new Event({
      title: req.body.title,
      slug: req.body.slug,
      user: req.user._id
    });
    let newEvent = await event.save();
    res.redirect('/events/edit/' + newEvent.slug);
  } catch (err) {
    console.log(err);
    res.render('events/new', { event: req.body, err: err });
  }
});

/** autre méthode sans "async await"
let event = new Event(req.body);
event.save((err, newEvent) => {
  if (err) {
    res.render('events/new', { event: req.body, err: err });
  } else {
    res.redirect('/edit/' + newEvent.slug);
  }
})
});*/

/** Affichage du formulaire de modification */
router.get('/edit/:slug', async (req, res) => {
  let event = await Event.findOne({slug: req.params.slug}).exec();
  res.render('events/edit', {event : event})
});

router.post('/edit/:slug', async (req, res) => {
  const result = await Event.updateOne(
    {slug : req.params.slug}, 
    { $addToSet: {dates : req.body.date}}
    );
  res.redirect('/events/edit/' + req.params.slug)
});

router.post('/search', async (req, res) => 
{
  res.redirect('/events/' + req.body.slug )
})

router.get('/:slug', async( req, res) => {
  let event = await Event.findOne({slug: req.params.slug}).populate('user').exec();

  if(!event) {
    res.sendStatus(404)
  }

  res.render('events/show', {
    event: event,
    persons : event.persons,
    dates: event.dates.sort((date1, date2) => new Date(date1) - new Date(date2))
  });
});

router.post('/:slug/dates/new', async (req, res) => {
  const result = await Event.updateOne(
    { slug: req.params.slug },
    { $push: { persons: req.body } }
  );
  res.json(req.body); //TODO: ça renvoyait vers une page html, et maintenant ça renvoit du json (pour socket io)
  // res.redirect('/events/' + req.params.slug); 
})

module.exports = router;
