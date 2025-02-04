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
      // Подписывается (subscribe) на изменения списка рецептов из RecipeService.
      // когда в сервисе изменяется recipesSubject, этот компонент автоматически получает новый список рецептов
      // и обновляет отображение.
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
    //отправляет (эмитит) новое значение всем подписчикам.
  }
  deleteRecipe(recipe: Recipe): void {
    this.recipeService.deleteRecipe(recipe); // Передаём рецепт в поток
  }
}
