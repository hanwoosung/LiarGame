package org.ws.liargame.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.ws.liargame.model.Message;
import java.util.HashSet;
import java.util.Set;

@Controller
public class ChatController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private SimpMessagingTemplate simpMessagingTemplate; //구독한 유저한데 모두 메시지 날리는 거
    private Set<String> userList = new HashSet<>(); //TODO: 일단은 닉네임만 받도록 추후 수정

    @Autowired
    public ChatController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/message") // /app/message 로 전송된 주소
    @SendTo("/chatroom/public")
    private Message receivePublicMessage(@Payload Message message) {
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


}
