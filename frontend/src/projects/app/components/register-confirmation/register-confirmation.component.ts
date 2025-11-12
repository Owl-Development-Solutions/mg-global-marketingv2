import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RegisterFormGeneral } from 'projects/app/models/register-form.model';

@Component({
  selector: 'app-register-confirmation',
  imports: [MatIcon, DatePipe, MatButton, CommonModule],
  templateUrl: './register-confirmation.component.html',
  styleUrl: './register-confirmation.component.scss',
})
export class RegisterConfirmationComponent {
  data = input.required<RegisterFormGeneral>();

  @Output() edit = new EventEmitter<void>();
}
