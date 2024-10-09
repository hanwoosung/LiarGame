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

    public enum Status { //public
        JOIN,
        MESSAGE,
        LEAVE
    }
}
