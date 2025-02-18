package com.real_time.kanban_board.service;


import com.real_time.kanban_board.config.JwtAuthenticationResponse;
import com.real_time.kanban_board.dto.SignInRequest;
import com.real_time.kanban_board.dto.SignUpRequest;
import com.real_time.kanban_board.entity.Users;

public interface AuthenticationService {
    Users signUp(SignUpRequest signUpRequest);

    JwtAuthenticationResponse signIn(SignInRequest signInRequest);

    Users getUserByUsername(String username);
}
