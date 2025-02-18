package com.real_time.kanban_board.config;

import com.real_time.kanban_board.entity.Tasks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class WebSocketTaskHandler {
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketTaskHandler(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendTaskUpdate(Tasks task) {
        try {
            messagingTemplate.convertAndSend("/topic/tasks", task);
        } catch (Exception e) {
            System.err.println("Error sending WebSocket message: " + e.getMessage());
        }
    }

    public void sendTaskDelete(int taskId) {
        messagingTemplate.convertAndSend("/topic/tasks", taskId);
    }
}
