import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-search',
  standalone: false,

  templateUrl: './recipe-search.component.html',
  styleUrl: './recipe-search.component.css',
})
export class RecipeSearchComponent {
  @Output() searchEvent = new EventEmitter<string>(); // Для передачи события в родительский компонент
  searchTerm: string = ''; // Связана с input через ngModel

  constructor(private router: Router) {}

  onSearch(): void {
    this.searchEvent.emit(this.searchTerm.trim()); // Отправляем строку родителю
  }

  onAdd(): void {
    this.router.navigate(['/add-recipe']); // Переход на страницу добавления рецепта
  }
}
