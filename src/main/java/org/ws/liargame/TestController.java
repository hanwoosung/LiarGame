package org.ws.liargame;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/data")
    public String test() {
        return "Hello World";
    }


}
