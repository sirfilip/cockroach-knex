const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app');
const knex = require('../db/knex');
const stickers = require('../fixtures/stickers');

describe('CRUD Stickers', () => {
  before(() => {
    return knex.seed.run();
  });

  it('lists all records', done => {
    request(app)
      .get('/api/v1/stickers')
      .set('Accept', 'application/json')
      .expect('Content-type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).to.deep.equal(stickers);
        done();
      })
      .catch(done);
  });

  it('finds the existing record', done => {
    const sticker = stickers[0];
    request(app)
      .get('/api/v1/stickers/' + sticker.id)
      .set('Accept', 'application/json')
      .expect('Content-type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).to.deep.equal(sticker);
        done();
      })
      .catch(done);
  });

  it('returns 404 if sticker does not exists', done => {
    const sticker = stickers[0];
    request(app)
      .get('/api/v1/stickers/12345' + sticker.id)
      .set('Accept', 'application/json')
      .expect(404, done);
  });

  it('returns 400 if id is invalid', done => {
    request(app)
      .get('/api/v1/stickers/nonvalidid')
      .set('Accept', 'application/json')
      .expect(400, done);
  });

  it('creates new sticker', done => {
    request(app)
      .post('/api/v1/stickers')
      .send({
        title: 'New sticker',
        description: 'Description',
        rating: 23,
        url: 'https://url.com',
      })
      .set('Accept', 'application/json')
      .expect(201, done);
  });

  describe('validation', () => {
    it('makes every field mandatory', done => {
      request(app)
        .post('/api/v1/stickers')
        .send({})
        .set('Accept', 'application/json')
        .expect(400)
        .then(response => {
          expect(response.body).to.deep.equal({
            title: ['Title is required'],
            description: ['Description is required'],
            rating: ['Rating is required'],
            url: ['Url is required'],
          });
          done();
        })
        .catch(done);
    });
    it('requires rating to be number', done => {
      request(app)
        .post('/api/v1/stickers')
        .send({rating: 'not a number'})
        .set('Accept', 'application/json')
        .expect(400)
        .then(response => {
          expect(response.body.rating).to.deep.equal([
            'Rating is not a number',
          ]);
          done();
        })
        .catch(done);
    });

    it('requires a valid url', done => {
      request(app)
        .post('/api/v1/stickers')
        .send({url: 'invalid url'})
        .set('Accept', 'application/json')
        .expect(400)
        .then(response => {
          expect(response.body.url).to.deep.equal(['Url is not a valid url']);
          done();
        })
        .catch(done);
    });
  });

  it('requires a valid id', done => {
    request(app)
      .delete(`/api/v1/stickers/invalidid`)
      .set('Content-type', 'application/json')
      .expect(400, done);
  });

  it('updates a sticker', done => {
    const sticker = stickers[0];
    request(app)
      .patch(`/api/v1/stickers/${sticker.id}`)
      .send({
        title: 'Updated title',
      })
      .set('Accept', 'application/json')
      .set('Content-type', 'application/json')
      .expect(200)
      .then(res => {
        expect(res.body).to.deep.equal(
          Object.assign({}, sticker, {title: 'Updated title'}),
        );
        done();
      })
      .catch(done);
  });

  it('deletes a sticker', done => {
    const sticker = stickers[0];
    request(app)
      .delete(`/api/v1/stickers/${sticker.id}`)
      .set('Content-type', 'application/json')
      .expect(204, done);
  });
});
