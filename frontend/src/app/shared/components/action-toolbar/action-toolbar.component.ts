import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="action-toolbar-row">
      <div class="action-toolbar-filters">
        <ng-content select="[filters]"></ng-content>
      </div>
      <div class="action-toolbar-actions">
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .action-toolbar-row {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border-color, #e2e8f0);
      width: 100%;
      box-sizing: border-box;
      transition: border-color 0.2s ease;
    }

    @media (min-width: 768px) {
      .action-toolbar-row {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .action-toolbar-filters {
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1;
      width: 100%;
    }

    @media (min-width: 640px) {
      .action-toolbar-filters {
        flex-direction: row;
        align-items: center;
      }
    }

    .action-toolbar-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      justify-content: flex-start;
      width: 100%;
    }

    @media (min-width: 768px) {
      .action-toolbar-actions {
        justify-content: flex-end;
        width: auto;
      }
    }
  `]
})
export class ActionToolbarComponent {}
