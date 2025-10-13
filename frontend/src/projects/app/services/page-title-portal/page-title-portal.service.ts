import { TemplatePortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageTitlePortalService {
  private activePortal = new BehaviorSubject<TemplatePortal>(null!);

  readonly portal$ = this.activePortal.asObservable();

  constructor() {}

  setPortal(portal: TemplatePortal) {
    this.activePortal.next(portal);
  }
}
