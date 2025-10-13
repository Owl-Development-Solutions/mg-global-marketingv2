import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PageTitlePortalService } from '../../services';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-page-title',
  imports: [CommonModule, MatExpansionModule, CdkPortalOutlet],
  templateUrl: './page-title.component.html',
  styleUrl: './page-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTitleComponent implements OnInit {
  portal$!: Observable<TemplatePortal>;

  constructor(private pageTitlePortal: PageTitlePortalService) {}

  ngOnInit(): void {
    this.portal$ = this.pageTitlePortal.portal$;
  }
}
