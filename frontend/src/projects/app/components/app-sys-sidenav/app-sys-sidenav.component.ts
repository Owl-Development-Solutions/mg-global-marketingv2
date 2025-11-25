import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
  Input,
  Output,
} from '@angular/core';
import { Params, RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButton } from '@angular/material/button';

export interface SidenavMenuItem {
  label: string;
  icon?: string;
  routerLink?: string[];
  hasFilters?: boolean;
  exactMatchHighlight?: boolean;
  children?: SidenavMenuItem[];
}

@Component({
  selector: 'app-sys-sidenav',
  imports: [
    MatExpansionModule,
    MatIconModule,
    RouterModule,
    MatTooltipModule,
    MatBadgeModule,
    CommonModule,
    MatDividerModule,
    MatListModule,
    MatButton,
  ],
  templateUrl: './app-sys-sidenav.component.html',
  styleUrl: './app-sys-sidenav.component.scss',
  host: { class: 'flex flex-col justify-betweeb gap-4' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSysSidenavComponent {
  userId = input<string>();

  @Input() isExpanded: boolean | undefined = false;

  @Input() menuItems: SidenavMenuItem[] = [];

  @Input() secondaryMenuItems: SidenavMenuItem[] = [];

  @Input() queryParams?: { [routerLink: string]: Params };

  @Input() canClose = true;

  @Input() sidenavBadges?: { [path: string]: number };

  @Output() toggleSidenav = new EventEmitter<void>();

  @Output() toggleExpansion = new EventEmitter();
}
