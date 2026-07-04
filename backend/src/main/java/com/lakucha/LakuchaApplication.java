package com.lakucha;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class LakuchaApplication {

    public static void main(String[] args) {
        SpringApplication.run(LakuchaApplication.class, args);
    }
}
