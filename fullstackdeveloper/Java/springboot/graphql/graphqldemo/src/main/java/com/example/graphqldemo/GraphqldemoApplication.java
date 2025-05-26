package com.example.graphqldemo;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer; 

@SpringBootApplication
public class GraphqldemoApplication {

    
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOriginPatterns("*")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}

	public static void main(String[] args) {
		SpringApplication.run(GraphqldemoApplication.class, args);
	}

	
}

record Book(String id, String name, int pageCount, String authorId) {

    private static List<Book> books = Arrays.asList(
        new Book("book-1", "Harry Potter and the Philosopher's Stone", 223, "author-1"),
        new Book("book-2", "Moby Dick", 635, "author-2"),
        new Book("book-3", "Interview with the vampire", 371, "author-3")
    );

    public static Book getById(String id) {
        return books.stream().filter(book -> book.id().equals(id)).findFirst().orElse(null);
    }
}

/*
 
query MyQuery {
  bookById(id: "book-1") {
    name
  }
}

curl -X POST \
  -H "Content-Type: application/json" \
  --data '{ "query": "query { bookById(id: \"book-1\") { id name pageCount author { id firstName lastName } } }" }' \
  http://localhost:9999/graphql

 * 
 */
@Controller
class BookController {

    @QueryMapping
    public Book bookById(@Argument String id) {
        return Book.getById(id);
    }

@Controller // Marks this class as a Spring MVC controller.
class HelloWorldController {

    @GetMapping("/hello") // Maps HTTP GET requests to the /hello path to this method.
    @ResponseBody // Indicates that the return value of this method should be bound directly to the web response body.
    public String sayHello(@RequestParam(value = "name", defaultValue = "World") String name) {
        return String.format("Hello, %s!", name); // Returns a formatted string as the response body.
    }

    @GetMapping("/welcome") // Maps HTTP GET requests to the root path to this method.
    @ResponseBody // Indicates that the return value of this method should be bound directly to the web response body.
    public String welcome() {
        return "Welcome to the Spring Boot REST API!";
    }
}
/* *

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new GraphQlWebSocketHandler(null, null, null), "/subscriptions").setAllowedOrigins("*");
    }
}*/

}

