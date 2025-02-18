import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-form-dialog',
  templateUrl: './task-form-dialog.component.html',
  styleUrls: ['./task-form-dialog.component.css']
})
export class TaskFormDialogComponent implements OnInit {
  taskForm!: FormGroup;
  users: any[] = [];
  minDate: Date = new Date(); // Prevent selecting past dates

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private usersService: AuthService,
    public dialogRef: MatDialogRef<TaskFormDialogComponent>
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      description: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      priority: ['', Validators.required],
      status: ['', Validators.required],
      dueDate: ['', [Validators.required, this.futureDateValidator]],
      assigneeUsernames: [[], Validators.required] 
    });

    this.usersService.getUsers().subscribe({
      next: (users: any) => { this.users = users; },
      error: (err) => { console.error('Error fetching users:', err); }
    });
  }

  futureDateValidator(control: any): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate && selectedDate > today ? null : { invalidDate: true };
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    const taskData = this.taskForm.value;
    taskData.assignees = this.taskForm.value.assigneeUsernames.map((username: string) => {
      const user = this.users.find(u => u.username === username);
      return user ? { id: user.id, username: user.username } : null;
    }).filter((user: any) => user !== null);

    this.taskService.addTask(taskData).subscribe({
      next: () => { this.dialogRef.close(); },
      error: (err) => { console.error('Error adding task:', err); }
    });
  }
}
