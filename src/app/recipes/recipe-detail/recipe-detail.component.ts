import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../recipe-service';
import { Recipe } from '../../models/reciepe.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  standalone: false,

  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css',
})
export class RecipeDetailComponent {
  recipeId!: number;
  recipe!: Recipe;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recipeId = Number(this.route.snapshot.paramMap.get('id')); // Получаем ID рецепта из URL
    this.recipeService.getRecipeById(this.recipeId).subscribe((recipe) => {
      if (recipe) {
        this.recipe = recipe;
      } else {
        console.error('Recipe not found');
      }
    });
    console.log('Recipe ID:', this.recipeId);
  }

  getFlagUrl(cuisine: string): string {
    return this.recipeService.getFlagUrl(cuisine);
  }

  goBack() {
    this.recipeService.goBack();
  }

  editRecipe(recipe: Recipe): void {
    this.recipeService.editingRecipe$.next(recipe); // Передаём рецепт в поток
    this.router.navigate(['/edit-recipe']); // Переход на страницу добавления рецепта
    //отправляет (эмитит) новое значение всем подписчикам.
  }

  deleteRecipe(recipe: Recipe): void {
    this.recipeService.deleteRecipe(recipe); // Передаём рецепт в поток
    this.router.navigate(['/recipes']); // Переход на страницу добавления рецепта
    //отправляет (эмитит) новое значение всем подписчикам.
  }
}
