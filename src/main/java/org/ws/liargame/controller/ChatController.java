package org.ws.liargame.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.ws.liargame.model.Message;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

@Controller
public class ChatController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private SimpMessagingTemplate simpMessagingTemplate; // 구독한 유저에게 모두 메시지 보내는 역할
    private Set<String> userList = new HashSet<>(); // 닉네임 관리

    @Autowired
    public ChatController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/message") // /app/message로 전송된 주소
    @SendTo("/chatroom/public")
    public Message receivePublicMessage(@Payload Message message) {
        logger.info("유저 닉네임 : " + message.getSenderName());
        logger.info("유저 상태 : " + message.getStatus());

        if (Message.Status.JOIN == message.getStatus()) {
            userList.add(message.getSenderName());
        } else if (Message.Status.LEAVE == message.getStatus()) {
            userList.remove(message.getSenderName());
        }

        logger.info("유저 닉네임 리스트 " + userList);
        simpMessagingTemplate.convertAndSend("/chatroom/user-name", userList);
        return message;
    }

    @PostMapping("/leave")
    public ResponseEntity<String> handleLeave(@RequestBody String messageBody) {
        logger.info("message body: " + messageBody);

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            Message message = objectMapper.readValue(messageBody, Message.class);
            logger.info("유저가 게임을 떠났습니다: " + message.getSenderName());
            userList.remove((message.getSenderName()));
        } catch (IOException e) {
            logger.error("메시지 파싱 오류: " + e.getMessage());
            return ResponseEntity.badRequest().body("Invalid message format"); //실패 코드와 실패이유 전달
        }

        return ResponseEntity.ok("성공");//200코드 전달, 성공메시지
    }
}
