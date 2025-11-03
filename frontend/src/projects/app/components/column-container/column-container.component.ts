import {
  Component,
  EventEmitter,
  Input,
  input,
  Output,
  TemplateRef,
} from '@angular/core';
import { SkeletonTextComponent } from '../skeleton-text/skeleton-text.component';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BreakpointObserverComponent } from '../breakpoint-observer/breakpoint-observer.component';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-column-container',
  imports: [
    CommonModule,
    SkeletonTextComponent,
    MatButtonModule,
    MatDivider,
    MatIcon,
  ],
  templateUrl: './column-container.component.html',
  styleUrl: './column-container.component.scss',
})
export class ColumnContainerComponent extends BreakpointObserverComponent {
  @Input() title!: string;

  @Input() titleId?: string;

  @Input() subtitle!: string;

  @Input() removeHeader = false;

  @Input() isCollapsible: boolean = false;

  @Input() headerAction!: TemplateRef<any>;

  @Input() skeleton: boolean = false;

  @Input() isCollapsed: boolean = false;

  @Output() collapseContainer: EventEmitter<any> = new EventEmitter<any>();

  collapse() {
    this.collapseContainer.emit();
  }

  constructor(protected override breakpointObserver: BreakpointObserver) {
    super(breakpointObserver);
  }
}
