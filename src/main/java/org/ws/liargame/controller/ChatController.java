package org.ws.liargame.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.ws.liargame.model.Message;

@Controller
public class ChatController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private SimpMessagingTemplate simpMessagingTemplate;
/**
 * ▶ TRACE < DEBUG < INFO < WARN < ERROR
 * 1) ERROR : 요청을 처리하는 중 오류가 발생한 경우 표시한다.
 * 2) WARN: 처리 가능한 문제, 향후 시스템 에러의 원인이 될 수 있는 경고성 메시지를 나타낸다.
 * 3) INFO: 상태변경과 같은 정보성 로그를 표시한다. 4) DEBUG : 프로그램을 디버깅하기 위한 정보를 표시한다.5) TRACE : 추적 레벨은 Debug보다 훨씬 상세한 정보를 나타낸다.
 */

    @MessageMapping("/message") // /app/message 로 전송된 주소
    @SendTo("/chatroom/public")
    private Message receivePublicMessage(@Payload Message message) {
        logger.info("유저 닉네임 : " + message.getSenderName());
        logger.info("유저 상태 : " + message.getStatus());
        return message;
    }

    //TODO: 방 생성 현재는 하나의 방

    //TODO: 유저 접속 시 전체 유저 닉네임 반환

    //TODO: /MESSAGE 를  JOIN할 때 와  분리 필요 함 (아마도)

    //TODO: 방관련 모델 제작



}
