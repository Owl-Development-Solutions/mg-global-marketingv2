import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { GeonologyNode } from '../../models';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddMemberModalComponent } from '../add-member-modal/add-member-modal.component';
import { SkeletonUserNodeComponent } from '../skeleton-user-node/skeleton-user-node.component';

@Component({
  selector: 'app-geonology-tree',
  imports: [CommonModule, MatIcon, SkeletonUserNodeComponent],
  templateUrl: './geonology-tree.component.html',
  styleUrl: './geonology-tree.component.scss',
})
export class GeonologyTreeComponent {
  private dialog = inject(MatDialog);

  userNode = input.required<GeonologyNode | null>();
  loading = input<boolean | null>();

  @Output() handleAddMember: EventEmitter<{
    data: any;
    side: any;
  }> = new EventEmitter<{
    data: any;
    side: any;
  }>();

  @Output() routeToMember: EventEmitter<{ userId: string | undefined }> =
    new EventEmitter<{
      userId: string | undefined;
    }>();

  getAvatarInitials(node: GeonologyNode) {
    return node.firstName.charAt(0) + node.lastName.charAt(0).toUpperCase();
  }

  get currentDepth() {
    if (this.userNode()!.side === 'root') return 0;

    return this.userNode()!.side.length / 3;
  }

  get isSmallNode(): boolean {
    return this.currentDepth >= 3;
  }

  //refactor
  addMember(data: any, side: string) {
    this.handleAddMember.emit({
      data,
      side,
    });
  }

  handleClickMember(userId: string | undefined) {
    this.routeToMember.emit({ userId });
  }
}
