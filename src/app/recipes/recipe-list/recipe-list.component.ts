import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe-service';
import { Recipe } from '../../models/reciepe.model';

@Component({
  selector: 'app-recipe-list',
  standalone: false,

  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css',
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  loading: boolean = true;
  selectedRecipeId: number | null = null; // ID выбранного рецепта

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.recipes$.subscribe(
      (recipes) => {
        this.recipes = recipes;
        this.loading = false;
      },
      (error) => {
        console.error('Ошибка при получении рецептов:', error);
        this.loading = false;
      }
    );
  }

  toggleRecipeDetails(recipeId: number): void {
    // Переключение между показом и скрытием деталей
    this.selectedRecipeId =
      this.selectedRecipeId === recipeId ? null : recipeId;
  }

  editRecipe(recipe: Recipe): void {
    this.recipeService.editingRecipe$.next(recipe); // Передаём рецепт в поток
  }
  deleteRecipe(recipe: Recipe): void {
    this.recipeService.deleteRecipe(recipe); // Передаём рецепт в поток
  }
}
