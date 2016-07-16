'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Sdtechnique = mongoose.model('Sdtechnique'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, sdtechnique;

/**
 * Sdtechnique routes tests
 */
describe('Sdtechnique CRUD tests', function () {

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

    // Save a user to the test db and create new Sdtechnique
    user.save(function () {
      sdtechnique = {
        name: 'Sdtechnique name'
      };

      done();
    });
  });

  it('should be able to save a Sdtechnique if logged in', function (done) {
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

        // Save a new Sdtechnique
        agent.post('/api/sdtechniques')
          .send(sdtechnique)
          .expect(200)
          .end(function (sdtechniqueSaveErr, sdtechniqueSaveRes) {
            // Handle Sdtechnique save error
            if (sdtechniqueSaveErr) {
              return done(sdtechniqueSaveErr);
            }

            // Get a list of Sdtechniques
            agent.get('/api/sdtechniques')
              .end(function (sdtechniquesGetErr, sdtechniquesGetRes) {
                // Handle Sdtechnique save error
                if (sdtechniquesGetErr) {
                  return done(sdtechniquesGetErr);
                }

                // Get Sdtechniques list
                var sdtechniques = sdtechniquesGetRes.body;

                // Set assertions
                (sdtechniques[0].user._id).should.equal(userId);
                (sdtechniques[0].name).should.match('Sdtechnique name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Sdtechnique if not logged in', function (done) {
    agent.post('/api/sdtechniques')
      .send(sdtechnique)
      .expect(403)
      .end(function (sdtechniqueSaveErr, sdtechniqueSaveRes) {
        // Call the assertion callback
        done(sdtechniqueSaveErr);
      });
  });

  it('should not be able to save an Sdtechnique if no name is provided', function (done) {
    // Invalidate name field
    sdtechnique.name = '';

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

        // Save a new Sdtechnique
        agent.post('/api/sdtechniques')
          .send(sdtechnique)
          .expect(400)
          .end(function (sdtechniqueSaveErr, sdtechniqueSaveRes) {
            // Set message assertion
            (sdtechniqueSaveRes.body.message).should.match('Please fill Sdtechnique name');

            // Handle Sdtechnique save error
            done(sdtechniqueSaveErr);
          });
      });
  });

  it('should be able to update an Sdtechnique if signed in', function (done) {
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

        // Save a new Sdtechnique
        agent.post('/api/sdtechniques')
          .send(sdtechnique)
          .expect(200)
          .end(function (sdtechniqueSaveErr, sdtechniqueSaveRes) {
            // Handle Sdtechnique save error
            if (sdtechniqueSaveErr) {
              return done(sdtechniqueSaveErr);
            }

            // Update Sdtechnique name
            sdtechnique.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Sdtechnique
            agent.put('/api/sdtechniques/' + sdtechniqueSaveRes.body._id)
              .send(sdtechnique)
              .expect(200)
              .end(function (sdtechniqueUpdateErr, sdtechniqueUpdateRes) {
                // Handle Sdtechnique update error
                if (sdtechniqueUpdateErr) {
                  return done(sdtechniqueUpdateErr);
                }

                // Set assertions
                (sdtechniqueUpdateRes.body._id).should.equal(sdtechniqueSaveRes.body._id);
                (sdtechniqueUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Sdtechniques if not signed in', function (done) {
    // Create new Sdtechnique model instance
    var sdtechniqueObj = new Sdtechnique(sdtechnique);

    // Save the sdtechnique
    sdtechniqueObj.save(function () {
      // Request Sdtechniques
      request(app).get('/api/sdtechniques')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Sdtechnique if not signed in', function (done) {
    // Create new Sdtechnique model instance
    var sdtechniqueObj = new Sdtechnique(sdtechnique);

    // Save the Sdtechnique
    sdtechniqueObj.save(function () {
      request(app).get('/api/sdtechniques/' + sdtechniqueObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', sdtechnique.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Sdtechnique with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sdtechniques/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Sdtechnique is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Sdtechnique which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Sdtechnique
    request(app).get('/api/sdtechniques/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Sdtechnique with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Sdtechnique if signed in', function (done) {
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

        // Save a new Sdtechnique
        agent.post('/api/sdtechniques')
          .send(sdtechnique)
          .expect(200)
          .end(function (sdtechniqueSaveErr, sdtechniqueSaveRes) {
            // Handle Sdtechnique save error
            if (sdtechniqueSaveErr) {
              return done(sdtechniqueSaveErr);
            }

            // Delete an existing Sdtechnique
            agent.delete('/api/sdtechniques/' + sdtechniqueSaveRes.body._id)
              .send(sdtechnique)
              .expect(200)
              .end(function (sdtechniqueDeleteErr, sdtechniqueDeleteRes) {
                // Handle sdtechnique error error
                if (sdtechniqueDeleteErr) {
                  return done(sdtechniqueDeleteErr);
                }

                // Set assertions
                (sdtechniqueDeleteRes.body._id).should.equal(sdtechniqueSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Sdtechnique if not signed in', function (done) {
    // Set Sdtechnique user
    sdtechnique.user = user;

    // Create new Sdtechnique model instance
    var sdtechniqueObj = new Sdtechnique(sdtechnique);

    // Save the Sdtechnique
    sdtechniqueObj.save(function () {
      // Try deleting Sdtechnique
      request(app).delete('/api/sdtechniques/' + sdtechniqueObj._id)
        .expect(403)
        .end(function (sdtechniqueDeleteErr, sdtechniqueDeleteRes) {
          // Set message assertion
          (sdtechniqueDeleteRes.body.message).should.match('User is not authorized');

          // Handle Sdtechnique error error
          done(sdtechniqueDeleteErr);
        });

    });
  });

  it('should be able to get a single Sdtechnique that has an orphaned user reference', function (done) {
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

          // Save a new Sdtechnique
          agent.post('/api/sdtechniques')
            .send(sdtechnique)
            .expect(200)
            .end(function (sdtechniqueSaveErr, sdtechniqueSaveRes) {
              // Handle Sdtechnique save error
              if (sdtechniqueSaveErr) {
                return done(sdtechniqueSaveErr);
              }

              // Set assertions on new Sdtechnique
              (sdtechniqueSaveRes.body.name).should.equal(sdtechnique.name);
              should.exist(sdtechniqueSaveRes.body.user);
              should.equal(sdtechniqueSaveRes.body.user._id, orphanId);

              // force the Sdtechnique to have an orphaned user reference
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

                    // Get the Sdtechnique
                    agent.get('/api/sdtechniques/' + sdtechniqueSaveRes.body._id)
                      .expect(200)
                      .end(function (sdtechniqueInfoErr, sdtechniqueInfoRes) {
                        // Handle Sdtechnique error
                        if (sdtechniqueInfoErr) {
                          return done(sdtechniqueInfoErr);
                        }

                        // Set assertions
                        (sdtechniqueInfoRes.body._id).should.equal(sdtechniqueSaveRes.body._id);
                        (sdtechniqueInfoRes.body.name).should.equal(sdtechnique.name);
                        should.equal(sdtechniqueInfoRes.body.user, undefined);

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
      Sdtechnique.remove().exec(done);
    });
  });
});
