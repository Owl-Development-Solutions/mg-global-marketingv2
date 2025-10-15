import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-breakpoint-observer',
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
})
export class BreakpointObserverComponent {
  breakpoint$!: Observable<BreakpointState>;

  constructor(protected breakpointObserver: BreakpointObserver) {
    this.breakpoint$ = breakpointObserver.observe([Breakpoints.Handset]);
  }
}
