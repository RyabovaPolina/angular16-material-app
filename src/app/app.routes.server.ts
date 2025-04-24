import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'recipes/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      // Пример: возвращаем список id рецептов как строку
      const recipeIds = await getRecipeIdsFromDatabase(); // Псевдокод, замените на свой способ получения id
      return recipeIds.map((id) => ({ id: id.toString() })); // Преобразуем id в строку
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];

async function getRecipeIdsFromDatabase() {
  // Получение всех id рецептов, для которых нужно сделать prerendering
  return [1, 2, 3]; // Пример
}
