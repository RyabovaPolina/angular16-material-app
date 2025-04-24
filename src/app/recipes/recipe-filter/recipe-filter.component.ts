import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { RecipeService } from '../recipe-service';

@Component({
  selector: 'app-recipe-filter',
  standalone: false,

  templateUrl: './recipe-filter.component.html',
  styleUrl: './recipe-filter.component.css',
})
export class RecipeFilterComponent implements OnInit {
  selectedCategory: string = '';
  isDropdownVisible = false;
  isLargeScreen = true; // Флаг для отслеживания размера экрана
  categories!: string[];

  constructor(private recipeService: RecipeService) {}

  @Output() categoryChange = new EventEmitter<string>(); // Отправляем выбранную категорию родителю

  ngOnInit(): void {
    // Присваиваем categories напрямую из сервиса, если это обычный массив
    this.categories = this.recipeService.categories$ || [];
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateScreenSize();
  }

  updateScreenSize(): void {
    // если ширина экрана меньше 768px, то переключаем на мобильный режим
    this.isLargeScreen = window.innerWidth > 768;
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.categoryChange.emit(category === 'Все' ? '' : category); // Если выбрано "Все", отправляем пустую строку
  }

  onCategoryChange2(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCategory = value;
    this.categoryChange.emit(value === 'Все' ? '' : value);
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
}
