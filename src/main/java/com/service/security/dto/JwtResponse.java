package com.service.security.dto;

public class JwtResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String role;

    public JwtResponse(String token, Long id, String username, String email, String role) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }
    // getters and setters
    public String getToken(){ return token; }
    public void setToken(String token){ this.token = token; }
    public String getTokenType(){ return tokenType; }
    public void setTokenType(String tokenType){ this.tokenType = tokenType; }
    public Long getId(){ return id; }
    public String getUsername(){ return username; }
    public String getEmail(){ return email; }
    public String getRole(){ return role; }
}
