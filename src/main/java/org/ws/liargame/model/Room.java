package org.ws.liargame.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@ToString
@Getter
@Setter
@AllArgsConstructor
public class Room {
    private String roomNo;
    private List<String> userList = new ArrayList<>();
    private Subject subject;
    private int count;

    public Room() {}


    public enum Subject {
        GAME,
        ANIMAL,
        FOOD,
        PLACE,
        JOB,
        SPRORT,
        MOVE,
        CELEBRITY
    }
}
