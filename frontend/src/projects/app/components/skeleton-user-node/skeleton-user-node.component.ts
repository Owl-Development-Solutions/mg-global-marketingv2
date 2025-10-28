import { Component, Input } from '@angular/core';
import { SkeletonTextComponent } from '../skeleton-text/skeleton-text.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-user-node',
  imports: [SkeletonTextComponent, MatIconModule, CommonModule],
  template: `
    <div class="flex w-full flex-col items-center !w-[400px]">
      <div
        class="cursor-default flex flex-col items-center relative z-20 opacity-75"
      >
        <div
          class="relative inline-flex items-center justify-center rounded-full bg-gray-200 skeleton-loading opacity-75"
          [ngClass]="'h-12 w-12'"
        ></div>

        <div class="mt-2 space-y-1 text-center w-full">
          <app-skeleton-text
            [lines]="1"
            [lineHeight]="isSmallNode ? 10 : 14"
            [minLineWidth]="isSmallNode ? 60 : 80"
            [maxLineWidth]="isSmallNode ? 80 : 120"
          ></app-skeleton-text>

          <app-skeleton-text
            [lines]="1"
            [lineHeight]="isSmallNode ? 8 : 12"
            [minLineWidth]="isSmallNode ? 40 : 60"
            [maxLineWidth]="isSmallNode ? 60 : 100"
          ></app-skeleton-text>

          <div
            class="bg-gray-200 rounded border border-transparent px-2 py-1 skeleton-loading mx-auto"
            [ngClass]="isSmallNode ? 'w-16 h-4' : 'w-20 h-5'"
          ></div>
        </div>
      </div>

      @if (currentDepth < 4) {
        <div class="flex w-full flex-col items-center">
          <div class="bg-gray-300 h-6 w-px"></div>

          <div class="flex w-full justify-center relative gap-12">
            <div class="absolute top-0 h-px bg-gray-300 w-full z-0"></div>

            <div class="flex flex-col items-center relative z-10 pt-6">
              <div class="absolute top-0 left-1/2 w-px h-6 bg-gray-300"></div>

              <div
                class="relative inline-flex items-center justify-center rounded-full bg-gray-200 skeleton-loading opacity-75"
                [ngClass]="isSmallNode ? 'h-8 w-8' : 'h-12 w-12'"
              ></div>
              <div class="mt-2 space-y-1 text-center w-full">
                <app-skeleton-text
                  [lines]="1"
                  [lineHeight]="isSmallNode ? 10 : 14"
                  [minLineWidth]="isSmallNode ? 60 : 80"
                  [maxLineWidth]="isSmallNode ? 80 : 120"
                ></app-skeleton-text>

                <app-skeleton-text
                  [lines]="1"
                  [lineHeight]="isSmallNode ? 8 : 12"
                  [minLineWidth]="isSmallNode ? 40 : 60"
                  [maxLineWidth]="isSmallNode ? 60 : 100"
                ></app-skeleton-text>

                <div
                  class="bg-gray-200 rounded border border-transparent px-2 py-1 skeleton-loading mx-auto"
                  [ngClass]="isSmallNode ? 'w-16 h-4' : 'w-20 h-5'"
                ></div>
              </div>
            </div>

            <div class="flex flex-col items-center relative z-10 pt-6">
              <div class="absolute top-0 left-1/2 w-px h-6 bg-gray-300"></div>

              <div
                class="relative inline-flex items-center justify-center rounded-full bg-gray-200 skeleton-loading opacity-75"
                [ngClass]="isSmallNode ? 'h-8 w-8' : 'h-12 w-12'"
              ></div>
              <div class="mt-2 space-y-1 text-center w-full">
                <app-skeleton-text
                  [lines]="1"
                  [lineHeight]="isSmallNode ? 10 : 14"
                  [minLineWidth]="isSmallNode ? 60 : 80"
                  [maxLineWidth]="isSmallNode ? 80 : 120"
                ></app-skeleton-text>

                <app-skeleton-text
                  [lines]="1"
                  [lineHeight]="isSmallNode ? 8 : 12"
                  [minLineWidth]="isSmallNode ? 40 : 60"
                  [maxLineWidth]="isSmallNode ? 60 : 100"
                ></app-skeleton-text>

                <div
                  class="bg-gray-200 rounded border border-transparent px-2 py-1 skeleton-loading mx-auto"
                  [ngClass]="isSmallNode ? 'w-16 h-4' : 'w-20 h-5'"
                ></div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './skeleton-user-node.component.scss',
})
export class SkeletonUserNodeComponent {
  @Input() isSmallNode: boolean = false;
  @Input() currentDepth: number = 0;
}
