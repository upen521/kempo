(function () {
  'use strict';

  describe('Katas Route Tests', function () {
    // Initialize global variables
    var $scope,
      KatasService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _KatasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      KatasService = _KatasService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('katas');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/katas');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          KatasController,
          mockKata;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('katas.view');
          $templateCache.put('modules/katas/client/views/view-kata.client.view.html', '');

          // create mock Kata
          mockKata = new KatasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Kata Name'
          });

          //Initialize Controller
          KatasController = $controller('KatasController as vm', {
            $scope: $scope,
            kataResolve: mockKata
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:kataId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.kataResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            kataId: 1
          })).toEqual('/katas/1');
        }));

        it('should attach an Kata to the controller scope', function () {
          expect($scope.vm.kata._id).toBe(mockKata._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/katas/client/views/view-kata.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          KatasController,
          mockKata;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('katas.create');
          $templateCache.put('modules/katas/client/views/form-kata.client.view.html', '');

          // create mock Kata
          mockKata = new KatasService();

          //Initialize Controller
          KatasController = $controller('KatasController as vm', {
            $scope: $scope,
            kataResolve: mockKata
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.kataResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/katas/create');
        }));

        it('should attach an Kata to the controller scope', function () {
          expect($scope.vm.kata._id).toBe(mockKata._id);
          expect($scope.vm.kata._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/katas/client/views/form-kata.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          KatasController,
          mockKata;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('katas.edit');
          $templateCache.put('modules/katas/client/views/form-kata.client.view.html', '');

          // create mock Kata
          mockKata = new KatasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Kata Name'
          });

          //Initialize Controller
          KatasController = $controller('KatasController as vm', {
            $scope: $scope,
            kataResolve: mockKata
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:kataId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.kataResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            kataId: 1
          })).toEqual('/katas/1/edit');
        }));

        it('should attach an Kata to the controller scope', function () {
          expect($scope.vm.kata._id).toBe(mockKata._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/katas/client/views/form-kata.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
