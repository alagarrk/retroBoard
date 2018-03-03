import { Directive } from '@angular/core';

@Directive({
  selector: '[appNgEnter]'
})
export class NgEnterDirective {
  constructor() {

  }
  ngOnInit() {
    return function (scope, element, attrs) {
      element.bind("keydown", function (e) {
        if (e.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.ngEnter, { 'e': e });
          });
          e.preventDefault();
        }
      });
    };
  }

}
