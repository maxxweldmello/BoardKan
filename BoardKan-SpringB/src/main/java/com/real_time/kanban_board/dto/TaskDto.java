package com.real_time.kanban_board.dto;

import com.real_time.kanban_board.entity.Priority;
import com.real_time.kanban_board.entity.Status;
import com.real_time.kanban_board.entity.Tasks;
import com.real_time.kanban_board.entity.Users;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class TaskDto {
    private Integer id;
    private String title;
    private String description;
    private Priority priority;
    private Status status;
    private List<String> assigneeUsernames;
    private List<Integer> assigneeIds;
    private Date dueDate;

    public TaskDto(Tasks task) {
        this.id = task.getId();
        this.title = task.getTitle();
        this.description = task.getDescription();
        this.priority = task.getPriority();
        this.status = task.getStatus();
        this.assigneeUsernames = task.getAssignees().stream()
                .map(Users::getUsername)
                .collect(Collectors.toList());
        this.assigneeIds = task.getAssignees().stream()
                .map(Users::getId)
                .collect(Collectors.toList());
        this.dueDate = task.getDueDate();
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public List<String> getAssigneeUsernames() { return assigneeUsernames; }
    public void setAssigneeUsernames(List<String> assigneeUsernames) { this.assigneeUsernames = assigneeUsernames; }

    public List<Integer> getAssigneeIds() { return assigneeIds; }
    public void setAssigneeIds(List<Integer> assigneeIds) { this.assigneeIds = assigneeIds; }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }
}
