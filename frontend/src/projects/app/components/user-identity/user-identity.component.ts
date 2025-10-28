import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatMenuPanel } from '@angular/material/menu';

@Component({
  selector: 'app-user-identity',
  imports: [CommonModule],
  templateUrl: './user-identity.component.html',
  styleUrl: './user-identity.component.scss',
})
export class UserIdentityComponent {
  @Input() userName!: { firstName: string; lastName: string } | null;

  @Input() clickEnabled = false;

  @Input() matMenuPanel!: MatMenuPanel;

  @Input() isSmall?: boolean = false;

  @Input() skeleton: boolean = false;

  @Input() skeletonMinLineWidth = 100;

  @Input() skeletonMaxLineWidth = 300;

  @Input() enableContainerQuery = false;

  @Output() clicked: EventEmitter<any> = new EventEmitter<any>();
}
