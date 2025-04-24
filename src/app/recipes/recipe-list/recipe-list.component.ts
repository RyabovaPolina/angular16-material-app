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
  searchTerm: string = '';
  selectedCategory: string = '';
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  loading: boolean = true;
  selectedRecipeId: number | null = null;
  flag: string = '';

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.recipes$.subscribe(
      // Подписывается (subscribe) на изменения списка рецептов из RecipeService.
      // когда в сервисе изменяется recipesSubject, этот компонент автоматически получает новый список рецептов
      // и обновляет отображение.
      (recipes) => {
        this.recipes = recipes;
        this.filteredRecipes = [...this.recipes];
        this.loading = false;
      },
      (error) => {
        console.error('Ошибка при получении рецептов:', error);
        this.loading = false;
      }
    );
  }


  // Обрабатываем событие поиска от RecipeSearchComponent
  onSearch(searchTerm: string): void {
    this.recipeService.searchRecipes(searchTerm);
  }

  onCategoryChange(categoryTerm: string): void {
    this.recipeService.filterRecipes(categoryTerm);
  }

  editRecipe(recipe: Recipe): void {
    this.recipeService.editingRecipe$.next(recipe); // Передаём рецепт в поток
    //отправляет (эмитит) новое значение всем подписчикам.
  }

  deleteRecipe(recipe: Recipe): void {
    this.recipeService.deleteRecipe(recipe); // Передаём рецепт в поток
  }

  getFlagUrl(cuisine: string): string {
    this.flag = this.recipeService.getFlagUrl(cuisine);
    return this.flag;
  }

  goToRecipe(id: number): void {
    this.recipeService.goToRecipe(id);
  }

  getIngredientNames(ingredients: { name: string }[]): string {
    return ingredients.map((i) => i.name).join(', ');
  }
}
