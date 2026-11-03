package com.hospital;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
@Entity public class Patient {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @NotBlank public String name;
 @NotBlank public String phone;
 public Integer age;
 public String gender;
 public String email;
 public Patient(){}
}