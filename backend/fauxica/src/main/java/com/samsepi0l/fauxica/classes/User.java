package com.samsepi0l.fauxica.classes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Users")
@Data
@AllArgsConstructor
@NoArgsConstructor
/**
 * Class used to represent the user
 */
public class User {
    @Id
    private String _id;
    private String username;
    private String password;
    private String email;
    private String card;
}
