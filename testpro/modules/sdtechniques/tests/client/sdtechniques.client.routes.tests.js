(function () {
  'use strict';

  describe('Sdtechniques Route Tests', function () {
    // Initialize global variables
    var $scope,
      SdtechniquesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SdtechniquesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SdtechniquesService = _SdtechniquesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('sdtechniques');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/sdtechniques');
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
          SdtechniquesController,
          mockSdtechnique;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('sdtechniques.view');
          $templateCache.put('modules/sdtechniques/client/views/view-sdtechnique.client.view.html', '');

          // create mock Sdtechnique
          mockSdtechnique = new SdtechniquesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Sdtechnique Name'
          });

          //Initialize Controller
          SdtechniquesController = $controller('SdtechniquesController as vm', {
            $scope: $scope,
            sdtechniqueResolve: mockSdtechnique
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:sdtechniqueId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.sdtechniqueResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            sdtechniqueId: 1
          })).toEqual('/sdtechniques/1');
        }));

        it('should attach an Sdtechnique to the controller scope', function () {
          expect($scope.vm.sdtechnique._id).toBe(mockSdtechnique._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/sdtechniques/client/views/view-sdtechnique.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SdtechniquesController,
          mockSdtechnique;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('sdtechniques.create');
          $templateCache.put('modules/sdtechniques/client/views/form-sdtechnique.client.view.html', '');

          // create mock Sdtechnique
          mockSdtechnique = new SdtechniquesService();

          //Initialize Controller
          SdtechniquesController = $controller('SdtechniquesController as vm', {
            $scope: $scope,
            sdtechniqueResolve: mockSdtechnique
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.sdtechniqueResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/sdtechniques/create');
        }));

        it('should attach an Sdtechnique to the controller scope', function () {
          expect($scope.vm.sdtechnique._id).toBe(mockSdtechnique._id);
          expect($scope.vm.sdtechnique._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/sdtechniques/client/views/form-sdtechnique.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SdtechniquesController,
          mockSdtechnique;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('sdtechniques.edit');
          $templateCache.put('modules/sdtechniques/client/views/form-sdtechnique.client.view.html', '');

          // create mock Sdtechnique
          mockSdtechnique = new SdtechniquesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Sdtechnique Name'
          });

          //Initialize Controller
          SdtechniquesController = $controller('SdtechniquesController as vm', {
            $scope: $scope,
            sdtechniqueResolve: mockSdtechnique
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:sdtechniqueId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.sdtechniqueResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            sdtechniqueId: 1
          })).toEqual('/sdtechniques/1/edit');
        }));

        it('should attach an Sdtechnique to the controller scope', function () {
          expect($scope.vm.sdtechnique._id).toBe(mockSdtechnique._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/sdtechniques/client/views/form-sdtechnique.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
