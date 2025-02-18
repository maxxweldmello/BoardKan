import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '../../../../../services/task.service';

@Component({
  selector: 'app-delete-task-form-dailog',
  templateUrl: './delete-task-form-dailog.component.html',
  styleUrls: ['./delete-task-form-dailog.component.css']
})
export class DeleteTaskFormDailogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteTaskFormDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { taskId: number }, 
    private taskService: TaskService
  ) {}

    
  deleteTask() {
    this.taskService.deleteTask(this.data.taskId).subscribe({
      next: () => {
        this.dialogRef.close(true); 
      },
      error: (err) => {
        console.error("Error deleting task:", err);
      }
    });
  }

  closeDialog() {
    this.dialogRef.close(false);  
  }
}
