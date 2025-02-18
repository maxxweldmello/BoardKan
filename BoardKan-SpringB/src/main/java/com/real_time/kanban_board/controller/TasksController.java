package com.real_time.kanban_board.controller;

import com.real_time.kanban_board.dto.TaskDto;
import com.real_time.kanban_board.entity.Tasks;
import com.real_time.kanban_board.service.TasksService;
import com.real_time.kanban_board.config.WebSocketTaskHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class TasksController {

    @Autowired
    TasksService service;

    @Autowired
    WebSocketTaskHandler webSocketTaskHandler;

    @GetMapping("/tasks")
    public ResponseEntity<List<TaskDto>> gettingTasks() {
        List<Tasks> tasks = service.getTasks();
        List<TaskDto> taskDTOs = tasks.stream().map(TaskDto::new).collect(Collectors.toList());
        return ResponseEntity.ok(taskDTOs);
    }

    @PostMapping("/tasks")
    public ResponseEntity<String> addingTask(@RequestBody Tasks task) {
        if (task == null) {
            return ResponseEntity.badRequest().body("Invalid task data.");
        }
        service.addTask(task);
        webSocketTaskHandler.sendTaskUpdate(task);
        return ResponseEntity.ok("Task added successfully");
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<String> updatingTask(@PathVariable int id, @RequestBody Tasks task) {
        if (task == null) {
            return ResponseEntity.badRequest().body("Invalid task data.");
        }
        service.updateTask(id, task);
        webSocketTaskHandler.sendTaskUpdate(task);
        return ResponseEntity.ok("Task updated successfully");
    }


    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<String> deletingTask(@PathVariable int id) {
        service.deleteTask(id);
        webSocketTaskHandler.sendTaskDelete(id);
        return ResponseEntity.ok("Task deleted successfully");
    }

    @MessageMapping("/updateTask")
    @SendTo("/topic/tasks")
    public Tasks broadcastTaskUpdate(Tasks task) {
        return task;
    }
}
