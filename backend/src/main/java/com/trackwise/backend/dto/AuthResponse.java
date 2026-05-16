package com.trackwise.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserDto user;

    @Data
    @AllArgsConstructor
    public static class UserDto {
        private Long id;
        private String name;
        private String email;

        @com.fasterxml.jackson.annotation.JsonProperty("created_at")
        private java.sql.Timestamp createdAt;
    }
}
