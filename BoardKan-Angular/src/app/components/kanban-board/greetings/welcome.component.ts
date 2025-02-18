import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Users } from '../../auth/users-interface';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormDialogComponent } from '../tabs/task/task-form-dialog/task-form-dialog.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  username: string = '';

  constructor(private authService: AuthService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    this.authService.getCurrentUser().subscribe({
      next: (user: Users) => {
        this.username = user.username;
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
        this.username = 'No USER';
      }
    });
  }

  openTaskFormDialog(): void {
    const dialogRef = this.dialog.open(TaskFormDialogComponent, {
      width: '600px'
    });
  }

}
