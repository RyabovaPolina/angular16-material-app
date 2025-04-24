import { Ingredient } from './ingredient.model';
import { Step } from './step.model';

export interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: Ingredient[];
  image?: string;
  category: string;
  steps: Step[];
  cookingTime: string;
  servings: number;
}
