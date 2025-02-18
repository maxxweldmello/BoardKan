package com.real_time.kanban_board.service;

import com.real_time.kanban_board.entity.Users;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UsersService {

    List<Users> getUsers();

    UserDetailsService userDetailsService();
}
