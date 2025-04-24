import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecipeService } from './recipe-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { RecipeSearchComponent } from './recipe-search/recipe-search.component';
import { RecipeFilterComponent } from './recipe-filter/recipe-filter.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';

@NgModule({
  declarations: [
    RecipeListComponent,
    RecipeFormComponent,
    RecipeSearchComponent,
    RecipeFilterComponent,
    RecipeDetailComponent,
  ],
  imports: [
    CommonModule,
    RecipesRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatExpansionModule,
    FormsModule,
    RecipesRoutingModule,
  ],
  exports: [RecipeFormComponent, RecipeListComponent],
})
export class RecipesModule {}
