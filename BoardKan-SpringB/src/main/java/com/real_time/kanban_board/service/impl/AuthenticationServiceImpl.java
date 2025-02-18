package com.real_time.kanban_board.service.impl;

import com.real_time.kanban_board.config.JwtAuthenticationResponse;
import com.real_time.kanban_board.dto.SignInRequest;
import com.real_time.kanban_board.dto.SignUpRequest;
import com.real_time.kanban_board.entity.Users;
import com.real_time.kanban_board.repository.UsersRepository;
import com.real_time.kanban_board.service.AuthenticationService;
import com.real_time.kanban_board.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    @Autowired
    private UsersRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    public Users signUp(SignUpRequest signUpRequest){
        Users user = new Users();

        user.setId(signUpRequest.getId());
        user.setUsername(signUpRequest.getUsername());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

        return repo.save(user);
    }

    public JwtAuthenticationResponse signIn(SignInRequest signInRequest){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signInRequest.getUsername(), signInRequest.getPassword())
        );

        var user = repo.findByUsername(signInRequest.getUsername())
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid Email or Password")
                );

        var jwt = jwtService.generateToken((UserDetails) user);


        JwtAuthenticationResponse jwtAuthenticationResponse = new JwtAuthenticationResponse();

        jwtAuthenticationResponse.setToken(jwt);

        return jwtAuthenticationResponse;
    }

    @Override
    public Users getUserByUsername(String username) {
        return (Users) repo.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
