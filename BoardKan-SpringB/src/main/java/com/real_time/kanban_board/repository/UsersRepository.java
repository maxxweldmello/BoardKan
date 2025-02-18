package com.real_time.kanban_board.repository;

import com.real_time.kanban_board.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, Integer> {
    Optional<Object> findByUsername(String username);
}
