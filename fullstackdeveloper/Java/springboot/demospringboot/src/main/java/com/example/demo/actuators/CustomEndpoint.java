package com.example.demo.actuators;

import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

/**
 * Custom actuator endpoint
 */
@Component
@Endpoint(id = "custom")
public class CustomEndpoint {

    private final Random random = new Random();
    private final String[] statuses = {"GOOD", "AVERAGE", "WARNING", "CRITICAL"};
    
    /**
     * GET operation for the custom endpoint
     */
    @ReadOperation
    public Map<String, Object> getCustomInfo() {
        Map<String, Object> details = new HashMap<>();
        
        details.put("timestamp", LocalDateTime.now().toString());
        details.put("status", statuses[random.nextInt(statuses.length)]);
        details.put("requestCount", random.nextInt(10000));
        details.put("uptime", System.currentTimeMillis() - ManagementMetrics.START_TIME);
        
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("cpuUsage", random.nextDouble() * 100);
        metrics.put("memoryUsage", random.nextDouble() * 100);
        metrics.put("diskSpace", random.nextDouble() * 100);
        
        details.put("metrics", metrics);
        
        return details;
    }
    
    /**
     * Static class to hold application metrics
     */
    private static class ManagementMetrics {
        static final long START_TIME = System.currentTimeMillis();
    }
}