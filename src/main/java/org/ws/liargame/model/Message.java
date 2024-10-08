package org.ws.liargame.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Message {
    private String senderName;
    private String message;
    private String date;
    private Status status;

    enum Status {
        JOIN,
        MESSAGE,
        LEAVE
    }
}
