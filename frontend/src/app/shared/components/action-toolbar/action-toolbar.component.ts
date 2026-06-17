import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-column md:flex-row align-items-stretch md:align-items-center justify-content-between gap-3 mb-4 p-3 border-round-xl border-1 border-surface bg-surface shadow-sm transition-colors transition-duration-300">
      <div class="flex flex-column sm:flex-row align-items-stretch sm:align-items-center gap-3 flex-1">
        <ng-content select="[filters]"></ng-content>
      </div>
      <div class="flex align-items-center gap-3 justify-content-end">
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class ActionToolbarComponent {}
