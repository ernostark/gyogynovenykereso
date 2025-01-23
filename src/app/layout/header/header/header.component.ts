import { Component } from '@angular/core';
import { SearchComponent } from "../search/search.component";
import { AuthComponent } from "../auth/auth.component";
import { LogoComponent } from "../logo/logo.component";

@Component({
  selector: 'app-header',
  imports: [SearchComponent, AuthComponent, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
