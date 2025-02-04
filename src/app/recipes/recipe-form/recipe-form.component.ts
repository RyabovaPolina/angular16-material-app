import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Recipe } from '../../models/reciepe.model';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../models/ingredient.model';
import { RecipeService } from '../recipe-service';

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

  constructor(private fb: FormBuilder, private recipeService: RecipeService) {}

  ngOnInit(): void {
    // Инициализация формы
    this.recipeForm = this.fb.group({
      id: [null], // добавляем поле id
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      ingredients: this.fb.array([]),
      image: [''],
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
          this.addIngredient(); // Добавляем пустой ингредиент при создании нового рецепта
        }
      }
    );

    // Добавляем первый ингредиент при создании нового рецепта
    this.addIngredient();
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  // Метод для заполнения формы при редактировании
  populateForm(recipe: Recipe): void {
    this.recipeForm.patchValue({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      image: recipe.image || '',
    });

    // Очищаем старые ингредиенты
    this.ingredients.clear();
    recipe.ingredients.forEach((ingredient) => {
      this.addIngredient();
      this.ingredients.at(-1)?.patchValue(ingredient); // Присваиваем значение каждому ингредиенту
    });
  }

  // Метод для добавления нового ингредиента
  addIngredient() {
    const ingredientGroup = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      unit: ['', Validators.required],
    });
    this.ingredients.push(ingredientGroup);
  }

  // Метод для удаления ингредиента
  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  // Метод для отправки формы
  onSubmit() {
    if (this.recipeForm.valid) {
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
      this.addIngredient(); // Добавляем пустой ингредиент для новой формы
    } else {
      console.log('Форма не валидна');
    }
  }

  // Очистка ресурсов при уничтожении компонента
  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Освобождаем ресурсы
  }
}
