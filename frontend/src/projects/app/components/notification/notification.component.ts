import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { StripPrefixPipe } from 'projects/app/pipes';

@Component({
  selector: 'app-notification',
  imports: [CommonModule, MatIcon, StripPrefixPipe],
  template: `
    <div
      class="bg-gray-800 border-l-4 border-solid p-2 items-center flex gap-4"
      [ngClass]="{
        'border-alert': notification.errorType === 'error',
        'border-green-500': notification.errorType === 'success',
        'border-warning': notification.errorType === 'warning',
        'border-accent-200': notification.errorType === 'info',
      }"
    >
      <div class="flex gap-2">
        <div class="w-9">
          @switch (notification.errorType) {
            @case ('error') {
              <mat-icon class="!text-alert">error</mat-icon>
            }
            @case ('success') {
              <mat-icon class="!text-green-500">check_circle</mat-icon>
            }
            @case ('warning') {
              <mat-icon class="!text-warning">warning</mat-icon>
            }
            @default {
              <mat-icon class="!text-accent-200">info</mat-icon>
            }
          }
        </div>
        <div class="flex gap-1">
          <p class="text-gray-50 text-sm">
            <span class="font-bold">{{ notification.title }}:</span>
            {{ notification.message | stripPrefix }}
          </p>
        </div>
      </div>
      @if (notification.showClose) {
        <button
          mat-icon-button
          aria-label="Close this notification"
          (click)="performClose.emit()"
          class="ml-auto mr-0"
        >
          <mat-icon class="text-gray-50">close</mat-icon>
        </button>
      }
    </div>
  `,
})
export class NotificationComponent {
  @Input() notification: any = {
    title: 'Error',
    message: 'Something went wrong',
    showClose: true,
  };

  @Output() performClose: EventEmitter<void> = new EventEmitter<void>();
}
