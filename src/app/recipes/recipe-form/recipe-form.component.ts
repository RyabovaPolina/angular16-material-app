import { Component, OnInit, OnDestroy, numberAttribute } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Recipe } from '../../models/reciepe.model';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../models/ingredient.model';
import { RecipeService } from '../recipe-service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-recipe-form',
  standalone: false,

  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.css',
})
export class RecipeFormComponent implements OnInit, OnDestroy {
  recipeForm!: FormGroup;
  units = ['гр', 'мл', 'шт', 'л', 'кг'];
  private subscription!: Subscription;
  categories: string[] = [];

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private router: Router
  ) {
    this.categories = this.recipeService.categories$;
  }

  ngOnInit(): void {
    // Инициализация формы
    this.recipeForm = this.fb.group({
      id: [null], // добавляем поле id
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      cookingTime: ['', Validators.required],
      servings: [1, [Validators.required, Validators.min(1)]],
      ingredients: this.fb.array([]),
      image: [''],
      steps: this.fb.array([]),
    });

    // Подписка на редактируемый рецепт
    this.subscription = this.recipeService.editingRecipe$.subscribe(
      //Подписывается на editingRecipe$ из RecipeService, чтобы загружать данные в форму
      // при редактировании рецепта
      (recipe) => {
        if (recipe) {
          this.populateForm(recipe); // Заполняем форму для редактирования
        } else {
          // Если нет рецепта, сбрасываем форму
          this.recipeForm.reset();
          this.ingredients.clear();
          this.addIngredient();
        }
      }
    );
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get steps() {
    return this.recipeForm.get('steps') as FormArray;
  }

  // Метод для заполнения формы при редактировании
  populateForm(recipe: Recipe): void {
    this.recipeForm.patchValue({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      category: recipe.category,
      image: recipe.image || '',
      steps: recipe.steps,
      cookingTime: recipe.cookingTime,
      servings: recipe.servings,
    });

    this.imagePreview = recipe.image || null;

    // Очищаем старые ингредиенты
    this.ingredients.clear();
    recipe.ingredients.forEach((ingredient) => {
      this.addIngredient();
      this.ingredients.at(-1)?.patchValue(ingredient); // Присваиваем значение каждому ингредиенту
    });

    this.steps.clear();
    recipe.steps.forEach((step) => {
      this.addStep();
      this.steps.at(-1)?.patchValue({ description: step.description }); // Присваиваем значение каждому ингредиенту
    });
  }

  addIngredient() {
    const ingredientGroup = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      unit: ['', Validators.required],
    });
    this.ingredients.push(ingredientGroup);
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  addStep() {
    const stepGroup = this.fb.group({
      num: Math.random(),
      description: ['', Validators.required],
    });
    this.steps.push(stepGroup);
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
  }

  // Метод для отправки формы
  onSubmit() {
    if (this.recipeForm.valid && this.imageError == false) {
      const formValue = this.recipeForm.value;
      const newRecipe: Recipe = {
        ...formValue,
        id: formValue.id || null, // Если id нет, это новый рецепт
      };

      if (newRecipe.id) {
        // Если id существует, редактируем рецепт
        this.recipeService.updateRecipe(newRecipe);
        console.log('Рецепт обновлён:', newRecipe);
      } else {
        // Если id нет, создаём новый рецепт
        this.recipeService.addRecipe(newRecipe);
        console.log('Новый рецепт добавлен:', newRecipe);
      }

      // После отправки сбрасываем форму
      this.recipeForm.reset();
      this.ingredients.clear();

      // Перенаправляем на страницу рецептов
      this.router.navigate(['/recipes']).then(() => {
        window.location.reload();
      });
    } else {
      console.log('Форма не валидна');
    }
  }

  imagePreview: string | null = null;
  imageError: boolean = false; // Переменная для отображения ошибки

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Проверяем, является ли файл изображением
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Проверяем размеры изображения
          if (img.width === 700 && img.height === 700) {
            this.imagePreview = reader.result as string;
            this.imageError = false; // Нет ошибки
            this.recipeForm.patchValue({ image: this.imagePreview });
          } else {
            this.imagePreview = null; // Очищаем превью
            this.imageError = true; // Устанавливаем ошибку
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  clearImage() {
    this.imagePreview = null;
    this.recipeForm.patchValue({ image: null });
    this.imageError = false; // Очистка ошибки
  }

  // Очистка ресурсов при уничтожении компонента
  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Освобождаем ресурсы
  }

  goBack() {
    this.recipeService.goBack();
  }
}
