'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Belt = mongoose.model('Belt'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, belt;

/**
 * Belt routes tests
 */
describe('Belt CRUD tests', function () {

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

    // Save a user to the test db and create new Belt
    user.save(function () {
      belt = {
        name: 'Belt name'
      };

      done();
    });
  });

  it('should be able to save a Belt if logged in', function (done) {
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

        // Save a new Belt
        agent.post('/api/belts')
          .send(belt)
          .expect(200)
          .end(function (beltSaveErr, beltSaveRes) {
            // Handle Belt save error
            if (beltSaveErr) {
              return done(beltSaveErr);
            }

            // Get a list of Belts
            agent.get('/api/belts')
              .end(function (beltsGetErr, beltsGetRes) {
                // Handle Belt save error
                if (beltsGetErr) {
                  return done(beltsGetErr);
                }

                // Get Belts list
                var belts = beltsGetRes.body;

                // Set assertions
                (belts[0].user._id).should.equal(userId);
                (belts[0].name).should.match('Belt name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Belt if not logged in', function (done) {
    agent.post('/api/belts')
      .send(belt)
      .expect(403)
      .end(function (beltSaveErr, beltSaveRes) {
        // Call the assertion callback
        done(beltSaveErr);
      });
  });

  it('should not be able to save an Belt if no name is provided', function (done) {
    // Invalidate name field
    belt.name = '';

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

        // Save a new Belt
        agent.post('/api/belts')
          .send(belt)
          .expect(400)
          .end(function (beltSaveErr, beltSaveRes) {
            // Set message assertion
            (beltSaveRes.body.message).should.match('Please fill Belt name');

            // Handle Belt save error
            done(beltSaveErr);
          });
      });
  });

  it('should be able to update an Belt if signed in', function (done) {
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

        // Save a new Belt
        agent.post('/api/belts')
          .send(belt)
          .expect(200)
          .end(function (beltSaveErr, beltSaveRes) {
            // Handle Belt save error
            if (beltSaveErr) {
              return done(beltSaveErr);
            }

            // Update Belt name
            belt.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Belt
            agent.put('/api/belts/' + beltSaveRes.body._id)
              .send(belt)
              .expect(200)
              .end(function (beltUpdateErr, beltUpdateRes) {
                // Handle Belt update error
                if (beltUpdateErr) {
                  return done(beltUpdateErr);
                }

                // Set assertions
                (beltUpdateRes.body._id).should.equal(beltSaveRes.body._id);
                (beltUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Belts if not signed in', function (done) {
    // Create new Belt model instance
    var beltObj = new Belt(belt);

    // Save the belt
    beltObj.save(function () {
      // Request Belts
      request(app).get('/api/belts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Belt if not signed in', function (done) {
    // Create new Belt model instance
    var beltObj = new Belt(belt);

    // Save the Belt
    beltObj.save(function () {
      request(app).get('/api/belts/' + beltObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', belt.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Belt with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/belts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Belt is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Belt which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Belt
    request(app).get('/api/belts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Belt with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Belt if signed in', function (done) {
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

        // Save a new Belt
        agent.post('/api/belts')
          .send(belt)
          .expect(200)
          .end(function (beltSaveErr, beltSaveRes) {
            // Handle Belt save error
            if (beltSaveErr) {
              return done(beltSaveErr);
            }

            // Delete an existing Belt
            agent.delete('/api/belts/' + beltSaveRes.body._id)
              .send(belt)
              .expect(200)
              .end(function (beltDeleteErr, beltDeleteRes) {
                // Handle belt error error
                if (beltDeleteErr) {
                  return done(beltDeleteErr);
                }

                // Set assertions
                (beltDeleteRes.body._id).should.equal(beltSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Belt if not signed in', function (done) {
    // Set Belt user
    belt.user = user;

    // Create new Belt model instance
    var beltObj = new Belt(belt);

    // Save the Belt
    beltObj.save(function () {
      // Try deleting Belt
      request(app).delete('/api/belts/' + beltObj._id)
        .expect(403)
        .end(function (beltDeleteErr, beltDeleteRes) {
          // Set message assertion
          (beltDeleteRes.body.message).should.match('User is not authorized');

          // Handle Belt error error
          done(beltDeleteErr);
        });

    });
  });

  it('should be able to get a single Belt that has an orphaned user reference', function (done) {
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

          // Save a new Belt
          agent.post('/api/belts')
            .send(belt)
            .expect(200)
            .end(function (beltSaveErr, beltSaveRes) {
              // Handle Belt save error
              if (beltSaveErr) {
                return done(beltSaveErr);
              }

              // Set assertions on new Belt
              (beltSaveRes.body.name).should.equal(belt.name);
              should.exist(beltSaveRes.body.user);
              should.equal(beltSaveRes.body.user._id, orphanId);

              // force the Belt to have an orphaned user reference
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

                    // Get the Belt
                    agent.get('/api/belts/' + beltSaveRes.body._id)
                      .expect(200)
                      .end(function (beltInfoErr, beltInfoRes) {
                        // Handle Belt error
                        if (beltInfoErr) {
                          return done(beltInfoErr);
                        }

                        // Set assertions
                        (beltInfoRes.body._id).should.equal(beltSaveRes.body._id);
                        (beltInfoRes.body.name).should.equal(belt.name);
                        should.equal(beltInfoRes.body.user, undefined);

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
      Belt.remove().exec(done);
    });
  });
});
