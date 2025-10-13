import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  input,
  Output,
} from '@angular/core';
import { GeonologyNode } from '../../models';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddMemberModalComponent } from '../add-member-modal/add-member-modal.component';

@Component({
  selector: 'app-geonology-tree',
  imports: [CommonModule, MatIcon, MatButton, AddMemberModalComponent],
  templateUrl: './geonology-tree.component.html',
  styleUrl: './geonology-tree.component.scss',
})
export class GeonologyTreeComponent {
  private dialog = inject(MatDialog);

  userNode = input.required<GeonologyNode>();

  @Output() addMember = new EventEmitter<{
    userNode: any;
  }>();

  getAvatarInitials(node: GeonologyNode) {
    return node.firstName.charAt(0) + node.lastName.charAt(0).toUpperCase();
  }

  get currentDepth() {
    if (this.userNode().side === 'root') return 0;

    return this.userNode().side.length / 3;
  }

  get isSmallNode(): boolean {
    return this.currentDepth >= 3;
  }

  //refactor
  handleAddMember(userNode: any) {
    // console.log('clicl');
    // this.addMember.emit({ userNode });
    this.dialog.open(AddMemberModalComponent, {
      width: '500px',
      data: {},
    });
  }
}
