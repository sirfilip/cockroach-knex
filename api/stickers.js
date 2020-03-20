const express = require('express');
const validate = require('validate.js');
const repo = require('../db/repo');

const router = express.Router();

const validateId = (req, res, next) => {
  if (!isNaN(req.params.id)) return next();
  res.status(400).end('Bad request');
};

router.get('/', (req, res) => {
  repo.getAll().then(stickers => {
    res.json(stickers);
  });
});

router.get('/:id', validateId, (req, res, next) => {
  repo.find(req.params.id).then(sticker => {
    if (!sticker) {
      next();
      return;
    }
    res.json(sticker);
  });
});

const StickerConstraints = {
  title: {
    presence: {
      allowEmpty: false,
      message: 'is required',
    },
  },
  description: {
    presence: {
      allowEmpty: false,
      message: 'is required',
    },
  },
  rating: {
    presence: {
      allowEmpty: false,
      message: 'is required',
    },
    numericality: true,
  },
  url: {
    presence: {
      allowEmpty: false,
      message: 'is required',
    },
    url: true,
  },
};

const validateCreateSticker = (req, res, next) => {
  validate
    .async(req.body, StickerConstraints)
    .then(() => next())
    .catch(e => {
      res.status(400).json(e);
    });
};

router.post('/', validateCreateSticker, (req, res, next) => {
  repo
    .create({
      title: req.body.title,
      description: req.body.description,
      rating: req.body.rating,
      url: req.body.url,
    })
    .then(sticker => res.status(201).end(''))
    .catch(e => next(e));
});

router.delete('/:id', validateId, (req, res, next) => {
  repo
    .delete(req.params.id)
    .then(() => {
      res.status(204).end('');
    })
    .catch(next);
});

const validateUpdate = (req, res, next) => {
  repo
    .find(req.params.id)
    .then(sticker => {
      const updatedSticker = Object.assign({}, sticker, req.body);
      validate
        .async(updatedSticker, StickerConstraints)
        .then(() => {
          req.updatedSticker = updatedSticker;
          next();
        })
        .catch(e => res.status(400).json(e));
    })
    .catch(e => res.status(404).end(''));
};

router.patch('/:id', validateId, validateUpdate, (req, res, next) => {
  repo
    .update(req.updatedSticker)
    .then(() => res.status(200).json(req.updatedSticker))
    .catch(next);
});

module.exports = router;
