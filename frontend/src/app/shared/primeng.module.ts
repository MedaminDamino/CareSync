import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { ToolbarModule } from 'primeng/toolbar';
import { DrawerModule } from 'primeng/drawer';
import { MenubarModule } from 'primeng/menubar';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { TextareaModule } from 'primeng/textarea';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';
import { ChipModule } from 'primeng/chip';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';

const PRIMENG_MODULES = [
  TableModule,
  DialogModule,
  CardModule,
  ButtonModule,
  ToastModule,
  ConfirmDialogModule,
  SelectModule,
  DatePickerModule,
  TagModule,
  BadgeModule,
  ToolbarModule,
  DrawerModule,
  MenubarModule,
  ChartModule,
  PanelModule,
  TabsModule,
  InputTextModule,
  PasswordModule,
  ProgressSpinnerModule,
  TooltipModule,
  TextareaModule,
  IconFieldModule,
  InputIconModule,
  FloatLabelModule,
  DividerModule,
  AvatarModule,
  RippleModule,
  SkeletonModule,
  ChipModule,
];

@NgModule({
  imports: [...PRIMENG_MODULES, SkeletonLoaderComponent],
  exports: [...PRIMENG_MODULES, SkeletonLoaderComponent],
})
export class SharedPrimeNgModule {}
