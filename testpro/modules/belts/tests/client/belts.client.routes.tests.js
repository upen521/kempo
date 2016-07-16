(function () {
  'use strict';

  describe('Belts Route Tests', function () {
    // Initialize global variables
    var $scope,
      BeltsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _BeltsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      BeltsService = _BeltsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('belts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/belts');
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
          BeltsController,
          mockBelt;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('belts.view');
          $templateCache.put('modules/belts/client/views/view-belt.client.view.html', '');

          // create mock Belt
          mockBelt = new BeltsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Belt Name'
          });

          //Initialize Controller
          BeltsController = $controller('BeltsController as vm', {
            $scope: $scope,
            beltResolve: mockBelt
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:beltId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.beltResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            beltId: 1
          })).toEqual('/belts/1');
        }));

        it('should attach an Belt to the controller scope', function () {
          expect($scope.vm.belt._id).toBe(mockBelt._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/belts/client/views/view-belt.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          BeltsController,
          mockBelt;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('belts.create');
          $templateCache.put('modules/belts/client/views/form-belt.client.view.html', '');

          // create mock Belt
          mockBelt = new BeltsService();

          //Initialize Controller
          BeltsController = $controller('BeltsController as vm', {
            $scope: $scope,
            beltResolve: mockBelt
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.beltResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/belts/create');
        }));

        it('should attach an Belt to the controller scope', function () {
          expect($scope.vm.belt._id).toBe(mockBelt._id);
          expect($scope.vm.belt._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/belts/client/views/form-belt.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          BeltsController,
          mockBelt;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('belts.edit');
          $templateCache.put('modules/belts/client/views/form-belt.client.view.html', '');

          // create mock Belt
          mockBelt = new BeltsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Belt Name'
          });

          //Initialize Controller
          BeltsController = $controller('BeltsController as vm', {
            $scope: $scope,
            beltResolve: mockBelt
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:beltId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.beltResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            beltId: 1
          })).toEqual('/belts/1/edit');
        }));

        it('should attach an Belt to the controller scope', function () {
          expect($scope.vm.belt._id).toBe(mockBelt._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/belts/client/views/form-belt.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
