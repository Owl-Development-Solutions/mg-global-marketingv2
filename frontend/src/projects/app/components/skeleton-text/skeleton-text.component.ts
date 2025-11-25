import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-skeleton-text',
  template: `
    @for (width of lineWidths; track width) {
      <p
        class="skeleton--text bg-gray-100 dark:!bg-gray-900 skeleton-loading"
        [style.width]="fullWidth ? '100%' : width"
        [style.height.px]="lineHeight"
      ></p>
    }
  `,
  imports: [],
  styleUrls: ['./skeleton-text.component.scss'],
})
export class SkeletonTextComponent implements OnChanges {
  @Input() lines = 5;

  @Input() minLineWidth = 100;

  @Input() maxLineWidth = 300;

  @Input() lineHeight = 16;

  @Input() fullWidth = false;

  lineWidths!: Array<string>;

  /**
   * Returns a random width in pixels based off a min width, and a max width.
   */
  getRandomInt = (min: number, max: number) => {
    return `${`${Math.floor(Math.random() * (max - min + 1) + min)}px`}`;
  };

  ngOnChanges() {
    // Creates an array of length defined by input lines with content from
    // 0 to lines - 1, maps each value to a random width in pixels.
    this.lineWidths = Array.from(Array(this.lines).keys()).map(() =>
      this.getRandomInt(this.minLineWidth, this.maxLineWidth),
    );
  }
}
