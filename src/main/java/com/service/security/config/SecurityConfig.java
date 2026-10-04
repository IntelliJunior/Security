package com.service.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.Set;

@Configuration
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtil);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:8888"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Disable CSRF (because JWT is stateless)
                .csrf(csrf -> csrf.disable())

                // Enable CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Stateless session (JWT)
                .sessionManagement(sess ->
                        sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // ✅ Docs (also bypassed entirely below via WebSecurityCustomizer;
                        // listed here too so the two mechanisms stay consistent if that
                        // customizer is ever narrowed or removed)
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        // ✅ H2 console: was permitAll for anyone who could reach this
                        // server at all, letting them browse/edit the raw database.
                        // It's a browser page reached by plain navigation, so it can't
                        // carry the Authorization header our JWT filter needs -- gating
                        // it with hasRole("ADMIN") would make it just as unusable as
                        // gating Swagger would (see the comment on that above), without
                        // actually restricting anything an attacker couldn't route
                        // around. Restricting by network origin instead closes the
                        // real exposure (reachable from elsewhere on a network) while
                        // leaving local browser access (the actual dev workflow this
                        // exists for) untouched.
                        .requestMatchers("/h2-console/**").access((authentication, context) ->
                                new AuthorizationDecision(isLoopbackAddress(context.getRequest().getRemoteAddr())))

                        // ✅ Public auth endpoints only — NOT the whole /api/auth/** tree.
                        // Registration used to be under this same permitAll() rule,
                        // meaning anyone could create themselves a full ADMIN account
                        // with no restriction at all. It now requires an existing admin
                        // (see the explicit rule below).
                        .requestMatchers("/api/auth/login", "/api/auth/ping").permitAll()

                        // ✅ Creating a new admin account now requires being logged in
                        // as an admin already. The seeded account in data.sql can create
                        // further admins this way.
                        .requestMatchers("/api/auth/register").hasRole("ADMIN")

                        // ✅ React app (Vite build copied into static/) and its assets
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/assets/**",
                                "/vite.svg",
                                "/*.ico",
                                "/*.svg",
                                "/*.png",
                                "/*.json",
                                "/*.webmanifest"
                        ).permitAll()

                        // ✅ React client-side routes. On a browser refresh the browser asks
                        // the SERVER for e.g. /dashboard, and a plain page request cannot
                        // carry the JWT (it lives in localStorage), so these must be public
                        // or Spring answers 403. They only serve index.html (see
                        // SpaForwardController); all real data stays behind /api/**.
                        // If you add a new top-level React route, add it here too.
                        .requestMatchers(HttpMethod.GET,
                                "/login",
                                "/dashboard",
                                "/dashboard/**"
                        ).permitAll()

                        // ✅ Admin secured
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // ✅ Other APIs
                        .requestMatchers("/api/**").authenticated()

                        // Anything else (including /uploads/** — nothing in this app's
                        // frontend actually references it over HTTP, it's only ever read
                        // from disk server-side for PDF generation) now defaults to
                        // "must be authenticated" instead of the previous
                        // anyRequest().permitAll(), which made every current AND future
                        // unlisted endpoint public by default.
                        .anyRequest().authenticated()
                )

                // Allow H2 console to work in browser
                .headers(headers ->
                        headers.frameOptions(frame -> frame.disable())
                )

                // Add JWT filter
                .addFilterBefore(
                        jwtAuthenticationFilter(),
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
                .requestMatchers(
                        "/swagger-ui/**",
                        "/v3/api-docs/**",
                        "/swagger-ui.html"
                );
    }

    private static final Set<String> LOOPBACK_ADDRESSES = Set.of("127.0.0.1", "0:0:0:0:0:0:0:1", "::1");

    private boolean isLoopbackAddress(String remoteAddr) {
        return remoteAddr != null && LOOPBACK_ADDRESSES.contains(remoteAddr);
    }

}
