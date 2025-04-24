import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeFormComponent } from './recipes/recipe-form/recipe-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' }, // Перенаправление на список рецептов при старте
  { path: 'recipes', component: RecipeListComponent }, // Список рецептов
  { path: 'recipes/:id', component: RecipeDetailComponent }, // Детали конкретного рецепта
  { path: 'add-recipe', component: RecipeFormComponent }, // Детали конкретного рецепта
  { path: 'edit-recipe', component: RecipeFormComponent }, // Детали конкретного рецепта
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
