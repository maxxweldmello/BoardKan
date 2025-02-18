import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Users } from '../../auth/users-interface';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {
  users: Users[] = [];
  selectedUsername: string = '';  

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadCurrentUser();
  }

  private loadUsers(): void {
    this.authService.getUsers().subscribe({
      next: (users: any) => {
        this.users = users;
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      }
    });
  }

  private loadCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user: Users) => {
        this.selectedUsername = user.username;
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
        this.selectedUsername = 'No USER';
      }
    });
  }


  selectUser(username: string): void {
    this.selectedUsername = username; 
  }
}
