package com.real_time.kanban_board.config;

public class JwtAuthenticationResponse {

    private String token;
    private String refreshToken;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

}
