package com.real_time.kanban_board.service;

import com.real_time.kanban_board.entity.Tasks;

import java.util.List;
import java.util.Optional;

public interface TasksService {

    List<Tasks> getTasks();

    void addTask(Tasks task);

    void updateTask(int id, Tasks task);

    void deleteTask(int id);
}
