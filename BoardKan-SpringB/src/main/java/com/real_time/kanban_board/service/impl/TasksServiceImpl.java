package com.real_time.kanban_board.service.impl;

import com.real_time.kanban_board.entity.Tasks;
import com.real_time.kanban_board.entity.Users;
import com.real_time.kanban_board.repository.TasksRepository;
import com.real_time.kanban_board.repository.UsersRepository;
import com.real_time.kanban_board.service.TasksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import java.util.Date;

@Service
public class TasksServiceImpl implements TasksService {

    @Autowired
    UsersRepository usersRepository;

    @Autowired
    TasksRepository repo;

    public List<Tasks> getTasks() {
        return repo.findAll();
    }

    public void addTask(Tasks task) {
        if (task.getDueDate() == null || task.getDueDate().before(new Date())) {
            throw new IllegalArgumentException("Due date must be a future date");
        }

        if (task.getAssignees() != null && !task.getAssignees().isEmpty()) {
            Set<Users> existingUsers = task.getAssignees().stream()
                    .map(user -> usersRepository.findById(user.getId()).orElse(null))
                    .filter(user -> user != null)
                    .collect(Collectors.toSet());

            task.setAssignees(existingUsers);
        }

        repo.save(task);
    }

    public void updateTask(int id, Tasks task) {
        Optional<Tasks> existingTaskOpt = repo.findById(id);

        if (!existingTaskOpt.isPresent()) {
            throw new IllegalArgumentException("Task not found");
        }

        Tasks existingTask = existingTaskOpt.get();

        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());
        existingTask.setStatus(task.getStatus());
        existingTask.setPriority(task.getPriority());
        existingTask.setAssignees(task.getAssignees());
        existingTask.setDueDate(task.getDueDate());

        repo.save(existingTask);
    }

    public void deleteTask(int id) {
        repo.deleteById(id);
    }
}
