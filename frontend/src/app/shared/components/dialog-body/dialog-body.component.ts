import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-body',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-body-container">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .dialog-body-container {
      padding: 32px;
      max-height: 65vh;
      overflow-y: auto;
      background: var(--card-bg, #ffffff);
      color: var(--text-main, #0f172a);
      box-sizing: border-box;
    }

    /* Subtle scrollbar */
    .dialog-body-container::-webkit-scrollbar {
      width: 6px;
    }
    .dialog-body-container::-webkit-scrollbar-track {
      background: transparent;
    }
    .dialog-body-container::-webkit-scrollbar-thumb {
      background: var(--border-color, #e2e8f0);
      border-radius: 99px;
    }
    .dialog-body-container::-webkit-scrollbar-thumb:hover {
      background: var(--text-muted, #64748b);
    }
  `]
})
export class DialogBodyComponent {}
