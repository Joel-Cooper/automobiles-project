import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutomobilesService } from '../services/automobiles.service';

@Component({
  selector: 'app-add-automobile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-automobile.component.html',
  styleUrl: './add-automobile.component.scss'
})
export class AddAutomobileComponent {
  constructor(private automobileService: AutomobilesService) {}

  onSubmit(form: any) {
    if (form.invalid) return;

    const newAutomobile = form.value;
    ['mpg', 'cylinders', 'displacement', 'horsepower', 'weight', 'acceleration', 'model_year']
      .forEach(field => newAutomobile[field] = Number(newAutomobile[field]));

    this.automobileService.addAutomobile(newAutomobile).subscribe({
      next: () => {
        alert('Automobile added!');
        form.resetForm();
      },
      error: err => console.error(err)
    });
  }
}
