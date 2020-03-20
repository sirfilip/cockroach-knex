const knex = require('./knex');

module.exports = {
  getAll() {
    return knex('sticker').select('*');
  },
  find(id) {
    return knex('sticker')
      .where({id})
      .first();
  },
  create(sticker) {
    return knex('sticker').insert(sticker, 'id');
  },
  delete(id) {
    return knex('sticker')
      .where({id})
      .del();
  },
  update(sticker) {
    return knex('sticker')
      .where('id', sticker.id)
      .update({
        title: sticker.title,
        description: sticker.description,
        rating: sticker.rating,
        url: sticker.url,
      });
  },
};
