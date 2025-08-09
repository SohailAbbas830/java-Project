package com.example.clinic.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;

@Service
public class TokenService {

    @Value("${app.jwt.secret:defaultsecretkeydefaultsecretkey}")
    private String secret;

    private Key signingKey;

    @PostConstruct
    public void init() {
        // In real app use a secure way to load the secret
        signingKey = Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Generate JWT token using user's email
    public String generateToken(String email) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + 1000L * 60 * 60 * 24)) // 1 day
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // Return signing key (example method required by task)
    public Key getSigningKey() {
        return signingKey;
    }
}
