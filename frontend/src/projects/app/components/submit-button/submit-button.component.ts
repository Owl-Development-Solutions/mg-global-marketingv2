import { Component, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-submit-button',
  imports: [MatButton, MatIcon, MatProgressSpinner],
  templateUrl: './submit-button.component.html',
})
export class SubmitButtonComponent {
  @Input()
  text: string = 'Submit';

  @Input()
  isDisabled: boolean | null = false;

  @Input()
  isHandset: boolean = false;

  @Input()
  isLoading: boolean | null = false;

  @Input()
  icon?: string;

  @Input() color?: ThemePalette = 'primary';

  @Input() type = 'submit';

  @Input() form!: string;
}
