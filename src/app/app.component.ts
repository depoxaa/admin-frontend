import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    template: `<router-outlet />`,
    styles: [`
    :host {
      display: block;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
  `]
})
export class AppComponent { }
