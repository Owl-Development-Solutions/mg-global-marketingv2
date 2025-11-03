import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-empty-history-message',
  imports: [MatIcon],
  template: `
    <div class="flex flex-col justify-center items-center h-full w-full">
      <mat-icon class="mb-7">{{ icon() }}</mat-icon>

      <p class="text-2xl">{{ message() }}</p>
    </div>
  `,
})
export class EmptyHistoryMessageComponent {
  icon = input<string>();

  message = input<string>();
}
