'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Kata = mongoose.model('Kata'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, kata;

/**
 * Kata routes tests
 */
describe('Kata CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Kata
    user.save(function () {
      kata = {
        name: 'Kata name'
      };

      done();
    });
  });

  it('should be able to save a Kata if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Kata
        agent.post('/api/katas')
          .send(kata)
          .expect(200)
          .end(function (kataSaveErr, kataSaveRes) {
            // Handle Kata save error
            if (kataSaveErr) {
              return done(kataSaveErr);
            }

            // Get a list of Katas
            agent.get('/api/katas')
              .end(function (katasGetErr, katasGetRes) {
                // Handle Kata save error
                if (katasGetErr) {
                  return done(katasGetErr);
                }

                // Get Katas list
                var katas = katasGetRes.body;

                // Set assertions
                (katas[0].user._id).should.equal(userId);
                (katas[0].name).should.match('Kata name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Kata if not logged in', function (done) {
    agent.post('/api/katas')
      .send(kata)
      .expect(403)
      .end(function (kataSaveErr, kataSaveRes) {
        // Call the assertion callback
        done(kataSaveErr);
      });
  });

  it('should not be able to save an Kata if no name is provided', function (done) {
    // Invalidate name field
    kata.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Kata
        agent.post('/api/katas')
          .send(kata)
          .expect(400)
          .end(function (kataSaveErr, kataSaveRes) {
            // Set message assertion
            (kataSaveRes.body.message).should.match('Please fill Kata name');

            // Handle Kata save error
            done(kataSaveErr);
          });
      });
  });

  it('should be able to update an Kata if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Kata
        agent.post('/api/katas')
          .send(kata)
          .expect(200)
          .end(function (kataSaveErr, kataSaveRes) {
            // Handle Kata save error
            if (kataSaveErr) {
              return done(kataSaveErr);
            }

            // Update Kata name
            kata.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Kata
            agent.put('/api/katas/' + kataSaveRes.body._id)
              .send(kata)
              .expect(200)
              .end(function (kataUpdateErr, kataUpdateRes) {
                // Handle Kata update error
                if (kataUpdateErr) {
                  return done(kataUpdateErr);
                }

                // Set assertions
                (kataUpdateRes.body._id).should.equal(kataSaveRes.body._id);
                (kataUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Katas if not signed in', function (done) {
    // Create new Kata model instance
    var kataObj = new Kata(kata);

    // Save the kata
    kataObj.save(function () {
      // Request Katas
      request(app).get('/api/katas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Kata if not signed in', function (done) {
    // Create new Kata model instance
    var kataObj = new Kata(kata);

    // Save the Kata
    kataObj.save(function () {
      request(app).get('/api/katas/' + kataObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', kata.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Kata with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/katas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Kata is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Kata which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Kata
    request(app).get('/api/katas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Kata with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Kata if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Kata
        agent.post('/api/katas')
          .send(kata)
          .expect(200)
          .end(function (kataSaveErr, kataSaveRes) {
            // Handle Kata save error
            if (kataSaveErr) {
              return done(kataSaveErr);
            }

            // Delete an existing Kata
            agent.delete('/api/katas/' + kataSaveRes.body._id)
              .send(kata)
              .expect(200)
              .end(function (kataDeleteErr, kataDeleteRes) {
                // Handle kata error error
                if (kataDeleteErr) {
                  return done(kataDeleteErr);
                }

                // Set assertions
                (kataDeleteRes.body._id).should.equal(kataSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Kata if not signed in', function (done) {
    // Set Kata user
    kata.user = user;

    // Create new Kata model instance
    var kataObj = new Kata(kata);

    // Save the Kata
    kataObj.save(function () {
      // Try deleting Kata
      request(app).delete('/api/katas/' + kataObj._id)
        .expect(403)
        .end(function (kataDeleteErr, kataDeleteRes) {
          // Set message assertion
          (kataDeleteRes.body.message).should.match('User is not authorized');

          // Handle Kata error error
          done(kataDeleteErr);
        });

    });
  });

  it('should be able to get a single Kata that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Kata
          agent.post('/api/katas')
            .send(kata)
            .expect(200)
            .end(function (kataSaveErr, kataSaveRes) {
              // Handle Kata save error
              if (kataSaveErr) {
                return done(kataSaveErr);
              }

              // Set assertions on new Kata
              (kataSaveRes.body.name).should.equal(kata.name);
              should.exist(kataSaveRes.body.user);
              should.equal(kataSaveRes.body.user._id, orphanId);

              // force the Kata to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Kata
                    agent.get('/api/katas/' + kataSaveRes.body._id)
                      .expect(200)
                      .end(function (kataInfoErr, kataInfoRes) {
                        // Handle Kata error
                        if (kataInfoErr) {
                          return done(kataInfoErr);
                        }

                        // Set assertions
                        (kataInfoRes.body._id).should.equal(kataSaveRes.body._id);
                        (kataInfoRes.body.name).should.equal(kata.name);
                        should.equal(kataInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Kata.remove().exec(done);
    });
  });
});
