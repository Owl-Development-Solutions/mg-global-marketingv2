import { CommonModule, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  imports: [CommonModule],
  templateUrl: './app-logo.component.html',
  styleUrl: './app-logo.component.scss',
})
export class AppLogoComponent {
  @Input() title!: string;

  @Input() expanded!: boolean | undefined;
}
