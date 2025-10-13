import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-member-modal',
  imports: [
    MatInputModule,
    MatIcon,
    MatDialogModule,
    MatCardModule,
    MatFormField,
    MatLabel,
    MatButtonModule,
  ],
  templateUrl: './add-member-modal.component.html',
  styleUrl: './add-member-modal.component.scss',
})
export class AddMemberModalComponent {}
