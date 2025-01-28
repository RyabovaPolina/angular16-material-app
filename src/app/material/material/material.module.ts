import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

const MaterialComponents = [
  MatButtonModule,
  MatInputModule,
  MatDialogModule,
  MatCardModule,
  MatIconModule,
  MatSelectModule,
  MatToolbarModule,
  ReactiveFormsModule,
  BrowserModule,
];

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [MaterialComponents],
})
export class MaterialModule {}
