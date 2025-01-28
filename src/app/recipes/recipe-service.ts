import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Recipe } from '../models/reciepe.model';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage-service';

@Injectable({
  providedIn: 'root', // Это значит, что сервис доступен в любом месте приложения
})
export class RecipeService {
  // Это временные данные. В реальном приложении данные могут поступать из API.
  private recipes: Recipe[] = [
    {
      id: 1,
      title: 'Паста с томатным соусом',
      ingredients: [
        { name: 'Томаты', quantity: 2, unit: 'шт' },
        { name: 'Паста', quantity: 50, unit: 'гр' },
        { name: 'Чеснок', quantity: 3, unit: 'шт' },
        { name: 'Оливковое масло', quantity: 20, unit: 'мл' },
        { name: 'Соль', quantity: 10, unit: 'гр' },
        { name: 'Перец', quantity: 10, unit: 'гр' },
      ],
      description:
        'Отварите пасту, обжарьте чеснок, добавьте томаты и готовьте соус.',
    },
  ];

  private recipesSubject = new BehaviorSubject<Recipe[]>(this.recipes);
  get recipes$(): Observable<Recipe[]> {
    return this.recipesSubject.asObservable(); // Возвращаем Observable, чтобы подписчики могли читать, но не менять поток
  }

  private readonly storageKey = 'recipes'; // Ключ для хранения данных

  constructor(private localStorageService: LocalStorageService) {
    this.loadRecipesFromLocalStorage(); // Загружаем рецепты из localStorage
  }

  // Поток для передачи редактируемого рецепта
  editingRecipe$ = new BehaviorSubject<Recipe | null>(null);

  // Метод для загрузки рецептов из localStorage
  private loadRecipesFromLocalStorage(): void {
    const storedRecipes = this.localStorageService.getItem<Recipe[]>(
      this.storageKey
    );
    if (storedRecipes) {
      this.recipes = storedRecipes;
      this.recipesSubject.next(this.recipes); // Обновляем поток
    }
  }

  updateRecipe(updatedRecipe: Recipe): void {
    const index = this.recipes.findIndex((r) => r.id === updatedRecipe.id);
    if (index !== -1) {
      this.recipes[index] = updatedRecipe;
    }
    this.saveRecipesToLocalStorage(); // Сохраняем изменения в localStorage
  }

  // Метод для сохранения рецептов в localStorage
  private saveRecipesToLocalStorage(): void {
    this.localStorageService.setItem(this.storageKey, this.recipes);
  }

  addRecipe(recipe: Recipe) {
    recipe.id = Date.now(); // Генерация уникального ID (или замените своим механизмом)
    this.recipes.push(recipe);
    this.recipesSubject.next(this.recipes);
    this.saveRecipesToLocalStorage(); // Сохраняем изменения в localStorage
  }

  deleteRecipe(recipe: Recipe) {
    console.log(this.recipes);
    this.recipes = this.recipes.filter((r) => r.id !== recipe.id);
    console.log(this.recipes);
    this.recipesSubject.next(this.recipes);
    this.saveRecipesToLocalStorage(); // Сохраняем изменения в localStorage
  }

  getRecipes(): Observable<Recipe[]> {
    return of(this.recipes);
  }

  // Метод для получения рецепта по ID
  getRecipeById(id: number): Observable<Recipe | undefined> {
    const recipe = this.recipes.find((r) => r.id === id); // Ищем рецепт по ID
    return of(recipe); // Возвращаем Observable с найденным рецептом
  }
}
