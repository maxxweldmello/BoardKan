package com.real_time.kanban_board.repository;

import com.real_time.kanban_board.entity.Tasks;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TasksRepository extends JpaRepository<Tasks, Integer> {

}
