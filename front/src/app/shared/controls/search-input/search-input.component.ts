import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search-input',
  imports: [CommonModule, FormsModule, MatIconModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInputComponent),
      multi: true,
    },
  ],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent implements ControlValueAccessor {
  placeholder = input.required<string>();

  emitSearch = output<string>();

  value = signal<string>('');

  disabled = signal<boolean>(false);

  onChange = (_: any) => {};

  onTouched = (_: any) => {};

  onSearch(): void {
    this.emitSearch.emit(this.value());
  }

  writeValue(val: any): void {
    this.onChange(val);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
