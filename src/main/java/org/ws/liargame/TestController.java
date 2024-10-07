package org.ws.liargame;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*", methods = RequestMethod.GET)
public class TestController {

    @GetMapping("/api/data")
    public String test() {
        return "Hello World";
    }


}
