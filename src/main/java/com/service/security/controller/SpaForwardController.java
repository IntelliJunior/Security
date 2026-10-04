package com.service.security.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Forwards React (client-side) routes to index.html.
 *
 * Why this exists: when you navigate inside the app, React Router changes the
 * page without asking the server. But on a browser refresh (or when opening
 * /dashboard directly) the browser asks the *server* for "/dashboard". There
 * is no such file, and the JWT lives in localStorage so the browser cannot
 * attach it to a plain page request -> Spring Security answered 403.
 *
 * Forwarding these paths to index.html lets React load and then decide
 * (using the token in localStorage) whether to show the page or redirect to
 * /login. The real data is still protected, because every /api/** call
 * requires the JWT.
 *
 * If you add a new top-level React route, add it here and in SecurityConfig.
 */
@Controller
public class SpaForwardController {

    @GetMapping({
            "/login",
            "/dashboard",
            "/dashboard/**"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
