import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  displayDialog: boolean;

  title = 'primeng-example';

  showDialogToAdd() {
  	this.displayDialog = true;
  }
}
