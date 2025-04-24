import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Recipe } from '../models/reciepe.model';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage-service';
import { Router } from '@angular/router';
import { Step } from '../models/step.model';

@Injectable({
  providedIn: 'root', // Это значит, что сервис доступен в любом месте приложения
})
export class RecipeService {
  private recipes: Recipe[] = [
    {
      id: 1,
      title: 'Паста с томатным соусом',
      ingredients: [
        { name: 'Томаты', quantity: 2, unit: 'шт' },
        { name: 'Паста', quantity: 150, unit: 'гр' },
        { name: 'Чеснок', quantity: 3, unit: 'зубчика' },
        { name: 'Оливковое масло', quantity: 20, unit: 'мл' },
        { name: 'Соль', quantity: 5, unit: 'гр' },
        { name: 'Перец', quantity: 3, unit: 'гр' },
      ],
      description:
        'Паста с томатным соусом — традиционное блюдо итальянской кухни. Оно появилось в Южной Италии и стало популярным благодаря простоте и насыщенному вкусу. Сочетание свежих томатов и чеснока придает блюду особый аромат.Секрет идеального блюда заключается в правильном балансе кислотности томатов и сладости овощей. При подаче пасту обычно посыпают тёртым пармезаном или пекорино романо.',
      steps: [
        {
          num: 1,
          description:
            'Отварите пасту в подсоленной воде до состояния аль денте.',
        },
        {
          num: 2,
          description:
            'Обжарьте мелко нарезанный чеснок на оливковом масле до золотистого цвета.',
        },
        {
          num: 3,
          description:
            'Добавьте нарезанные томаты и тушите на среднем огне 10 минут.',
        },
        {
          num: 4,
          description:
            'Смешайте пасту с соусом, добавьте соль и перец по вкусу.',
        },
        { num: 5, description: 'Подавайте горячим, украсив свежей зеленью.' },
      ],
      cookingTime: '30 минут',
      servings: 2,
      category: 'Итальянская кухня',
      image: '/assets/pasta.jpg',
    },
  ];

  private categories: string[] = [
    'Все',
    'Итальянская кухня',
    'Кавказская кухня',
    'Русская кухня',
    'Греческая кухня',
    'Грузинская кухня',
    'Украинская кухня',
  ];

  get categories$(): string[] {
    return this.categories;
  }

  private filteredRecipes: Recipe[] = [...this.recipes]; //  массив для фильтрации

  private recipesSubject = new BehaviorSubject<Recipe[]>(this.recipes); //нужен для автоматического обновления

  get recipes$(): Observable<Recipe[]> {
    return this.recipesSubject.asObservable(); // Возвращаем Observable, чтобы подписчики могли читать, но не менять поток
  }

  private readonly storageKey = 'recipes'; // Ключ для хранения данных

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.initializeRecipes();
  }

  private initializeRecipes(): void {
    if (typeof window !== 'undefined') {
      const storedRecipes = this.localStorageService.getItem<Recipe[]>(
        this.storageKey
      );

      console.log(storedRecipes);

      // Если рецептов в локальном хранилище нет — записываем их туда
      if (!storedRecipes || storedRecipes.length === 0) {
        this.localStorageService.setItem(this.storageKey, this.recipes); // Записываем в localStorage
      } else {
        this.recipes = storedRecipes; // Иначе берём из localStorage
        this.filteredRecipes = [...this.recipes]; // Обновляем filteredRecipes при загрузке

        this.recipesSubject.next(this.recipes); // Обновляем поток
      }
    }
  }

  // Поток для передачи редактируемого рецепта
  editingRecipe$ = new BehaviorSubject<Recipe | null>(null);

  updateRecipe(updatedRecipe: Recipe): void {
    const index = this.recipes.findIndex((r) => r.id === updatedRecipe.id);
    if (index !== -1) {
      this.recipes[index] = updatedRecipe;
    }
    this.filteredRecipes = [...this.recipes]; // Синхронизируем filteredRecipes

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
    this.filteredRecipes = [...this.recipes]; // Синхронизируем filteredRecipes

    this.saveRecipesToLocalStorage(); // Сохраняем изменения в localStorage
  }

  deleteRecipe(recipe: Recipe) {
    this.recipes = this.recipes.filter((r) => r.id !== recipe.id);
    this.filteredRecipes = [...this.recipes]; // Синхронизируем filteredRecipes

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

  //  метод для поиска рецептов
  searchRecipes(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredRecipes = [...this.recipes]; // Показать все рецепты, если строка пуста
    } else {
      this.filteredRecipes = this.recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    this.recipesSubject.next(this.filteredRecipes); // Обновляем поток для всех подписчиков
  }

  filterRecipes(filterTerm: string): void {
    if (filterTerm == 'Все') {
      this.filteredRecipes = [...this.recipes]; // Показать все рецепты, если строка пуста
    } else {
      this.filteredRecipes = this.recipes.filter((recipe) =>
        recipe.category?.toLowerCase().includes(filterTerm.toLowerCase())
      );
    }
    this.recipesSubject.next(this.filteredRecipes); // Обновляем поток для всех подписчиков
  }

  getFlagUrl(cuisine: string): string {
    const flagMap: { [key: string]: string } = {
      'Итальянская кухня': '/assets/f-italy.png',
      'Кавказская кухня': '/assets/f-azerbaijan.png',
      'Русская кухня': '/assets/f-russia.png',
      'Греческая кухня': '/assets/f-greece.png',
      'Грузинская кухня': '/assets/f-georgia.png',
      'Украинская кухня': '/assets/f-ukraine.png',
    };

    return flagMap[cuisine] || '/assets/f-usa.png';
  }

  goToRecipe(id: number): void {
    this.router.navigate(['/recipes', id]); // путь должен совпадать с маршрутом в routing.module
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
