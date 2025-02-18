import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TaskService } from '../../../../services/task.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTaskFormDailogComponent } from './delete-task/delete-task-form-dailog.component';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, OnChanges {
  tasks: any[] = [];
  users: any[] = [];  
  
  @Input() username: string = '';
  loggedInUsername: string = ''; 


  backlogTasks: any[] = [];
  inProgressTasks: any[] = [];
  completedTasks: any[] = [];

  sortAscendingPriority: boolean = true;
  sortAscendingDate: boolean = true;

  constructor(private taskService: TaskService, private userService: AuthService, public dialog: MatDialog) {}

  filterForm = new FormGroup({
    priority: new FormControl(''),
    assignees: new FormControl([]),
    dateRange: new FormGroup({
      start: new FormControl(null),
      end: new FormControl(null)
    })
  });

  ngOnInit(): void {
    this.loadTasks();
    this.loadUsers();  
    this.loadCurrentUser();
    this.subscribeToTaskUpdates();

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });  
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['username'] && changes['username'].currentValue) {
      this.loadTasks();
    }
  }

  applyFilters() {
    const { priority, assignees, dateRange } = this.filterForm.value;

    const startDate = dateRange?.start ? new Date(dateRange.start) : null;
    const endDate = dateRange?.end ? new Date(dateRange.end) : null;
  
    const filteredTasks = this.tasks.filter(task => {
  
      const priorityMatch = !priority || task.priority === priority;
      const assigneeMatch = (assignees?.length ?? 0) === 0 || assignees?.some((a: any) => task.assigneeUsernames?.includes(a));
      
      const dueDate = task.dueDate ? new Date(task.dueDate) : null;
      const dateMatch = !dateRange || 
                        (!startDate || (dueDate && dueDate >= startDate)) &&
                        (!endDate || (dueDate && dueDate <= endDate));
    
      return priorityMatch && assigneeMatch && dateMatch;
    });
  
    this.updateTaskLists(filteredTasks);
  }
  
  
  sortByPriority(column: string) {
    const priorityOrder: { [key: string]: number } = {
      High: 3,
      Medium: 2,
      Low: 1,
    };
  
    if (column === 'backlog') {
      this.backlogTasks.sort((a, b) => 
        this.sortAscendingPriority ? 
        (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0) : 
        (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0)
      );
    } else if (column === 'inProgress') {
      this.inProgressTasks.sort((a, b) => 
        this.sortAscendingPriority ? 
        (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0) : 
        (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0)
      );
    } else if (column === 'completed') {
      this.completedTasks.sort((a, b) => 
        this.sortAscendingPriority ? 
        (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0) : 
        (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0)
      );
    }
  
    this.sortAscendingPriority = !this.sortAscendingPriority;
  }
  
  sortByDate(column: string) {
    if (column === 'backlog') {
      this.backlogTasks.sort((a, b) => {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return this.sortAscendingDate ? dateA - dateB : dateB - dateA;
      });
    } else if (column === 'inProgress') {
      this.inProgressTasks.sort((a, b) => {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return this.sortAscendingDate ? dateA - dateB : dateB - dateA;
      });
    } else if (column === 'completed') {
      this.completedTasks.sort((a, b) => {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return this.sortAscendingDate ? dateA - dateB : dateB - dateA;
      });
    }
  
    this.sortAscendingDate = !this.sortAscendingDate;
  }  
  
  loadTasks() {
    this.taskService.getTasks().subscribe(
      (response) => {
  
        let assignedTasks = response
          .map((task: any) => ({
            ...task,
            isEditing: false,
            assigneeUsernames: task.assigneeUsernames || []
          }))
          .filter((task: any) => 
            Array.isArray(task.assigneeUsernames) && task.assigneeUsernames.includes(this.username)
          );
  
        this.tasks = assignedTasks; 
        this.applyFilters(); 
      },
      (error) => {
        console.error("Error fetching tasks:", error);
      }
    );
  }
        
  loadUsers() {
    this.userService.getUsers().subscribe(
      (response: any) => {
        this.users = response; 
      },
      (error) => {
        console.error("Error fetching users:", error);
      }
    );
  }

  loadCurrentUser() {
    this.userService.getCurrentUser().subscribe({
      next: (user: any) => {
        this.loggedInUsername = user.username; 
      },
      error: (err) => {
        console.error('Error fetching logged-in user:', err);
      }
    });
  }


  subscribeToTaskUpdates() {
    this.taskService.getTaskUpdates().subscribe(
      () => {

        this.loadTasks();
        this.applyFilters();
      },
      (error) => {
        console.error("Error receiving task updates:", error);
      }
    );
  }

  updateTaskLists(tasks: any) {
    this.backlogTasks = tasks.filter((task: any) => task.status === 'Backlog');
    this.inProgressTasks = tasks.filter((task: any) => task.status === 'InProgress');
    this.completedTasks = tasks.filter((task: any) => task.status === 'Completed');
    }
  
  editTask(task: any) {
    task.isEditing = true;
  }

  saveTask(task: any) {  
    const assignedUsers = this.users
      .filter(user => task.assigneeUsernames.includes(user.username))
      .map(user => ({ id: user.id, username: user.username })); 
  
    this.taskService.updateTask(task.id, {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      assignees: assignedUsers
    }).subscribe({
        next: () => {
          task.isEditing = false;
        },
        error: (err) => {
          console.error('Error updating task:', err);
        }
      });
  }
        
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];  
      const newStatus = this.getStatusFromList(event.container.id);
      const assignees = task.assigneeIds.map((id: any) => ({ id }));
      const updatedTask = {
        ...task,
        status: newStatus,
        assignees: assignees 
      };
  
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
  
      this.taskService.updateTask(task.id, updatedTask).subscribe({
        next: () => {
          console.log("Task Updated Successfully");
        },
        error: (err) => {
          console.error('Error updating task:', err);
        }
      }
      );
    }
  }
    
  getStatusFromList(listId: string) {
    switch (listId) {
      case 'backlogList': return 'Backlog';
      case 'inProgressList': return 'InProgress';
      case 'completedList': return 'Completed';
      default: return 'InProgress';
    }
  }

  getStatusClass(status: string) {
  switch (status) {
    case 'Backlog':
      return 'backlog';
    case 'InProgress':
      return 'inProgress';
    case 'Completed':
      return 'completed';
    default:
      return '';
  }
}


  openDeleteDialog(taskId: number): void {
    const dialogRef = this.dialog.open(DeleteTaskFormDailogComponent, {
      data: { taskId } 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();  
      }
    });
  }
}
