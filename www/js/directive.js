"use strict"

var app = angular.module('proweaver.directive',[]);

app.directive('onValidSubmit', ['$parse', '$timeout', function($parse, $timeout) {
  return {
  require: '^form',
  restrict: 'A',
    link: function(scope, element, attrs, form) {
      form.$submitted = false;
      var fn = $parse(attrs.onValidSubmit);
      element.on('submit', function(event) {
        scope.$apply(function() {
        element.addClass('ng-submitted');
        form.$submitted = true;
          if (form.$valid) {
            if (typeof fn === 'function') {
              fn(scope, {$event: event});
            }
          }
        });
      });
    }
  }
}])

app.directive('validated', ['$parse', function($parse) {
  return {
  restrict: 'AEC',
  require: '^form',
    link: function(scope, element, attrs, form) {
    var inputs = element.find("*");
      for(var i = 0; i < inputs.length; i++) {
        (function(input){
          var attributes = input.attributes;
          if (attributes.getNamedItem('ng-model') != void 0 && attributes.getNamedItem('name') != void 0) {
            var field = form[attributes.name.value];
            if (field != void 0) {
              scope.$watch(function() {
              return form.$submitted + "_" + field.$valid;
              }, function() {
                if (form.$submitted != true) return;
                  var inp = angular.element(input);
                if (inp.hasClass('ng-invalid')) {
                  element.removeClass('has-success');
                  element.addClass('has-error');
                } else {
                  element.removeClass('has-error').addClass('has-success');
                }
              });
            }
          }
        })(inputs[i]);
      }
    }
  }
}])

app.directive("myRequired", function() {
  return {
    restrict: 'AE',
    require: 'ngModel',
    link: function(scope, elm, attr, ctrl) {

      if (!ctrl) return;
        attr.requiredSelect = true; // force truthy in case we are on non input element

        var validator = function(value) {
          if (attr.requiredSelect && ctrl.$isEmpty(value)) {
            ctrl.$setValidity('requiredSelect', false);
            return;
          } else {
            ctrl.$setValidity('requiredSelect', true);
            return value;
          }
        };

        ctrl.$formatters.push(validator);
        ctrl.$parsers.unshift(validator);

        attr.$observe('requiredSelect', function() {
          validator(ctrl.$viewValue);
        });
    }
  };
});