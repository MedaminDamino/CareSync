import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedPrimeNgModule } from '../../primeng.module';

@Component({
  selector: 'app-details-drawer',
  standalone: true,
  imports: [CommonModule, SharedPrimeNgModule],
  template: `
    <p-drawer
      [(visible)]="visible"
      position="right"
      styleClass="details-drawer"
      [style]="{ width: '440px' }"
      (onHide)="close.emit()">

      <ng-template pTemplate="header">
        <div class="drawer-header">
          <div class="drawer-avatar">
            <p-avatar
              [label]="avatarLabel"
              shape="circle"
              size="xlarge"
              styleClass="drawer-avatar-custom">
            </p-avatar>
          </div>
          <div class="drawer-header-text">
            <h2 class="drawer-name font-outfit">{{ title }}</h2>
            <span class="drawer-role-badge" [ngClass]="'badge-' + (badgeType || 'default')">
              {{ subtitle }}
            </span>
          </div>
        </div>
      </ng-template>

      <div class="drawer-body">
        <ng-content></ng-content>
      </div>

      <ng-template pTemplate="footer">
        <div class="drawer-footer">
          <p-button
            label="Close Drawer"
            icon="pi pi-times"
            [outlined]="true"
            severity="secondary"
            styleClass="dialog-footer-btn-secondary w-full"
            (onClick)="close.emit()">
          </p-button>
        </div>
      </ng-template>

    </p-drawer>
  `,
  styles: [`
    :host ::ng-deep .details-drawer .p-drawer {
      border-radius: 20px 0 0 20px !important;
      box-shadow: -10px 0 50px rgba(0,0,0,0.15) !important;
      border-left: 1px solid var(--border-color, #e2e8f0) !important;
      background: var(--card-bg, #ffffff) !important;
    }

    :host ::ng-deep .details-drawer .p-drawer-header {
      padding: 24px 24px 20px !important;
      border-bottom: 1px solid var(--border-color, #e2e8f0) !important;
      background: var(--card-bg, #ffffff) !important;
    }

    :host ::ng-deep .details-drawer .p-drawer-content {
      padding: 0 !important;
      background: transparent !important;
    }

    :host ::ng-deep .details-drawer .p-drawer-footer {
      padding: 16px 24px !important;
      border-top: 1px solid var(--border-color, #e2e8f0) !important;
      background: var(--bg-main, #f8fafc) !important;
    }

    .drawer-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 12px;
      width: 100%;
    }

    ::ng-deep .drawer-avatar-custom {
      background-color: var(--primary-color) !important;
      color: #ffffff !important;
      font-weight: 700 !important;
      font-size: 1.5rem !important;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
    }

    .drawer-header-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .drawer-name {
      font-size: 1.35rem;
      font-weight: 700;
      margin: 0;
      color: var(--text-main);
      font-family: 'Outfit', sans-serif;
      letter-spacing: -0.01em;
    }

    .drawer-role-badge {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 3px 12px;
      border-radius: 99px;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    .badge-active {
      background: var(--success-bg, #d1fae5);
      color: var(--success-text, #065f46);
    }

    .badge-blocked {
      background: var(--danger-bg, #fee2e2);
      color: var(--danger-text, #991b1b);
    }

    .badge-suspended {
      background: var(--warning-bg, #fef3c7);
      color: var(--warning-text, #92400e);
    }

    .badge-patient {
      background: #ede9fe;
      color: #5b21b6;
    }

    .badge-doctor {
      background: var(--primary-light, #dbeafe);
      color: var(--primary-hover, #1e40af);
    }

    .badge-default {
      background: var(--border-light, #f1f5f9);
      color: var(--text-muted, #64748b);
    }

    .drawer-body {
      padding: 24px;
      background: var(--card-bg, #ffffff);
      color: var(--text-main);
      box-sizing: border-box;
    }

    .drawer-footer {
      display: flex;
      width: 100%;
    }

    ::ng-deep .dialog-footer-btn-secondary.p-button {
      background: transparent !important;
      border: 1px solid var(--border-color) !important;
      color: var(--text-muted) !important;
      padding: 10px 18px !important;
      font-weight: 500 !important;
    }
  `]
})
export class DetailsDrawerComponent {
  @Input() visible = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() badgeType = 'default';
  @Input() avatarLabel = '?';

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() close = new EventEmitter<void>();
}
