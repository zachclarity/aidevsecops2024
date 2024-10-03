package com.example.graphqldemo;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;
import org.springframework.context.annotation.Configuration;
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

curl "http://localhost:9999/graphql" ^
  -H "Accept-Language: en-US,en;q=0.9" ^
  -H "Connection: keep-alive" ^
  -H "Origin: http://localhost:9999" ^
  -H "Referer: http://localhost:9999/graphiql?path=/graphql" ^
  -H "Sec-Fetch-Dest: empty" ^
  -H "Sec-Fetch-Mode: cors" ^
  -H "Sec-Fetch-Site: same-origin" ^
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" ^
  -H "accept: application/json, multipart/mixed" ^
  -H "content-type: application/json" ^
  -H ^"sec-ch-ua: ^\^"Chromium^\^";v=^\^"122^\^", ^\^"Not(A:Brand^\^";v=^\^"24^\^", ^\^"Google Chrome^\^";v=^\^"122^\^"^" ^
  -H "sec-ch-ua-mobile: ?0" ^
  -H ^"sec-ch-ua-platform: ^\^"Windows^\^"^" ^
  --data-raw ^"^{^\^"query^\^":^\^"query MyQuery ^{^\^\n  bookById(id: ^\^\^\^"book-1^\^\^\^") ^{^\^\n    name^\^\n  ^}^\^\n^}^\^",^\^"operationName^\^":^\^"MyQuery^\^"^}^"
 * 
 */
@Controller
class BookController {

    @QueryMapping
    public Book bookById(@Argument String id) {
        return Book.getById(id);
    }



}

