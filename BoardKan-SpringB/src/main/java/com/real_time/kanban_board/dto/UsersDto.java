package com.real_time.kanban_board.dto;

import com.real_time.kanban_board.entity.Users;

public class UsersDto {

    private Integer id;
    private String username;
    private String password;

    public UsersDto(Users users) {
        this.id = users.getId();
        this.username = users.getUsername();
        this.password = users.getPassword();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
