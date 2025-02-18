package com.real_time.kanban_board.controller;

import com.real_time.kanban_board.config.JwtAuthenticationResponse;
import com.real_time.kanban_board.dto.SignInRequest;
import com.real_time.kanban_board.dto.SignUpRequest;
import com.real_time.kanban_board.dto.TaskDto;
import com.real_time.kanban_board.dto.UsersDto;
import com.real_time.kanban_board.entity.Tasks;
import com.real_time.kanban_board.entity.Users;
import com.real_time.kanban_board.exception.CustomException;
import com.real_time.kanban_board.service.AuthenticationService;
import com.real_time.kanban_board.service.JwtService;
import com.real_time.kanban_board.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationService service;

    @Autowired
    private UsersService usersService;

    @Autowired
    JwtService jwtService;

    @GetMapping("/users")
    public ResponseEntity<?> gettingUsers() {
        try {
            List<Users> users = usersService.getUsers();
            if (users != null && !users.isEmpty()) {
                List<UsersDto> usersDTOs = users.stream()
                        .map(UsersDto::new)
                        .collect(Collectors.toList());
                return new ResponseEntity<>(usersDTOs, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("No Tasks found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching Tasks: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            if (token == null || !token.startsWith("Bearer ")) {
                return new ResponseEntity<>("Invalid token format", HttpStatus.BAD_REQUEST);
            }

            String username = jwtService.extractUsername(token.substring(7));
            Users user = service.getUserByUsername(username);

            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching user: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> signup(@RequestBody SignUpRequest signUpRequest) {
        try {
            service.signUp(signUpRequest);

            ApiResponse response = new ApiResponse("User registered successfully");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            ApiResponse errorResponse = new ApiResponse("Error during signup: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody SignInRequest signInRequest) {
        try {
            JwtAuthenticationResponse authResponse = service.signIn(signInRequest);
            return new ResponseEntity<>(authResponse, HttpStatus.OK);
        } catch (CustomException e) {
            return new ResponseEntity<>("Invalid credentials: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error during sign-in: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    static class ApiResponse {
        private String message;

        public ApiResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}

