import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedPrimeNgModule } from '../../primeng.module';
import { DialogHeaderComponent } from '../dialog-header/dialog-header.component';

export type DialogWidth = 'sm' | 'md' | 'lg';

const WIDTH_MAP: Record<DialogWidth, string> = {
  sm: '560px',
  md: '760px',
  lg: '980px'
};

@Component({
  selector: 'app-dialog-shell',
  standalone: true,
  imports: [CommonModule, SharedPrimeNgModule, DialogHeaderComponent],
  template: `
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [closable]="false"
      [style]="{ width: widthPx, maxWidth: '95vw' }"
      [contentStyle]="{ padding: '0' }"
      [appendTo]="'body'"
      styleClass="dialog-shell"
      (onHide)="close.emit()">

      <!-- HEADER -->
      <ng-template pTemplate="header">
        <app-dialog-header
          [icon]="icon"
          [title]="title"
          [subtitle]="subtitle"
          [showClose]="true"
          (close)="close.emit()"
          class="w-full">
        </app-dialog-header>
      </ng-template>

      <!-- CONTENT BODY & FOOTER -->
      <ng-content></ng-content>

    </p-dialog>
  `,
  styles: [`
    :host ::ng-deep .dialog-shell.p-dialog {
      border-radius: 24px !important;
      overflow: hidden;
      box-shadow: 0 40px 100px rgba(15, 23, 42, 0.18) !important;
      border: 1px solid var(--border-color, #e2e8f0) !important;
      background: var(--card-bg, #ffffff) !important;
    }

    :host ::ng-deep .dialog-shell .p-dialog-header {
      padding: 0 !important;
      border-bottom: none !important;
      background: transparent !important;
    }

    :host ::ng-deep .dialog-shell .p-dialog-content {
      padding: 0 !important;
      background: transparent !important;
    }

    :host ::ng-deep .dialog-shell .p-dialog-footer {
      padding: 0 !important;
      border-top: none !important;
      background: transparent !important;
    }
  `]
})
export class DialogShellComponent {
  @Input() visible = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = '';
  @Input() width: DialogWidth = 'md';

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() close = new EventEmitter<void>();

  get widthPx(): string {
    return WIDTH_MAP[this.width];
  }
}
