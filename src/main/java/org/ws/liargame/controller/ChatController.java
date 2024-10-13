package org.ws.liargame.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.ws.liargame.model.Message;
import org.ws.liargame.model.Room;

import java.io.IOException;
import java.util.*;

/**
 * ChatController - 채팅 관련 요청을 처리하는 컨트롤러
 */
@Controller
public class ChatController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final Map<String, Room> roomMap = new HashMap<>();
    private static final int MAX_USERS = 8; // 방 최대 인원 제한

    @Autowired
    public ChatController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    /**
     * 클라이언트로부터 메시지를 수신하여 처리하고 방의 유저 목록을 갱신합니다.
     * @param message - 클라이언트에서 보낸 메시지
     * @param roomId - 방 번호
     * @return 처리된 메시지
     */
    @MessageMapping("/message/{roomId}")
    @SendTo("/chatroom/{roomId}")
    public Message receivePublicMessage(@Payload Message message, @DestinationVariable String roomId) {
        logger.info("유저 닉네임: {}", message.getSenderName());
        logger.info("방 번호: {}", roomId);

        Room room = roomMap.get(roomId);
        if (room == null) {
            logger.error("존재하지 않는 방입니다: {}", roomId);
            return null;
        }

        if (Message.Status.JOIN == message.getStatus()) {
            if (room.getUserList().contains(message.getSenderName())) {
                message.setMessage("중복된 닉네임입니다. 다른 닉네임을 사용해 주세요.");
                message.setStatus(Message.Status.ERROR);
                return message;
            }

            if (room.getUserList().size() >= MAX_USERS) {
                message.setMessage("방의 최대 인원을 초과했습니다. 최대 8명까지 입장 가능합니다.");
                message.setStatus(Message.Status.ERROR);
                return message;
            }

            room.getUserList().add(message.getSenderName());
            message.setMessage(message.getSenderName() + "님이 입장하셨습니다.");
        } else if (Message.Status.LEAVE == message.getStatus()) {
            room.getUserList().remove(message.getSenderName());
            message.setMessage(message.getSenderName() + "님이 퇴장하셨습니다.");
        }

        simpMessagingTemplate.convertAndSend("/chatroom/" + roomId + "/user-list", room.getUserList());
        return message;
    }

    /**
     * 클라이언트가 퇴장 요청 시 처리합니다.
     * @param messageBody - 퇴장 메시지
     * @return 처리 결과
     */
    @PostMapping("/leave")
    public ResponseEntity<String> handleLeave(@RequestBody String messageBody) {
        logger.info(messageBody);
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            Message message = objectMapper.readValue(messageBody, Message.class);
            Room room = roomMap.get(message.getRoomId());
            if (room != null) {
                room.getUserList().remove(message.getSenderName());
                Message leaveMessage = new Message();
                leaveMessage.setSenderName(message.getSenderName());
                leaveMessage.setRoomId(message.getRoomId());
                leaveMessage.setStatus(Message.Status.LEAVE);
                leaveMessage.setMessage(message.getSenderName() + "님이 퇴장하셨습니다.");
                simpMessagingTemplate.convertAndSend("/chatroom/" + message.getRoomId(), leaveMessage);
            }
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("실패");
        }
        return ResponseEntity.ok("성공");
    }

    /**
     * 방을 생성하는 요청을 처리합니다.
     * @param room - 생성할 방 정보
     * @return 처리 결과
     */
    @PostMapping("/create-room")
    public ResponseEntity<String> createRoom(@RequestBody Room room) {
        if (roomMap.containsKey(room.getRoomNo())) {
            return ResponseEntity.badRequest().body("이미 있는 방 번호입니다.");
        }

        roomMap.put(room.getRoomNo(), room);
        return ResponseEntity.ok("방 생성 성공");
    }

    /**
     * 빈 자리가 있는 방을 랜덤으로 찾아 반환합니다.
     * @return 빈 방 정보
     */
    @GetMapping("/random-room")
    public ResponseEntity<Room> randomRoom() {
        if (roomMap.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        List<Room> availableRooms = new ArrayList<>();
        for (Room room : roomMap.values()) {
            if (room.getUserList().size() < MAX_USERS) {
                availableRooms.add(room);
            }
        }

        if (availableRooms.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        Room room = availableRooms.get(new Random().nextInt(availableRooms.size()));
        return ResponseEntity.ok(room);
    }

    /**
     * 유저 닉네임 중복 체크를 처리합니다.
     * @param roomId - 방 번호
     * @param username - 체크할 유저 이름
     * @return 닉네임 중복 여부
     */
    @GetMapping("/check-username")
    public ResponseEntity<Map<String, Boolean>> checkUsername(
            @RequestParam String roomId,
            @RequestParam String username) {

        Room room = roomMap.get(roomId);
        if (room == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("isDuplicate", false));
        }

        boolean isDuplicate = room.getUserList().contains(username);
        return ResponseEntity.ok(Collections.singletonMap("isDuplicate", isDuplicate));
    }
}
