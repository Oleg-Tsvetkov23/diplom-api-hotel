Домашнее задание к занятию «2.6 Аутентификация в NestJS, passport.js. Guards»

1. Регистрация пользователя.

Метод POST {{URL}}/api/users/signup. Входные данные - { email: "string", password: "string", firstName: "string", lastName: "string" }.
Проводится валидация входных параметров. Если пользователь создан, сервер вернет НТТР код 201.

2. Аутентификация пользователя.

Метод POST {{URL}}/api/users/signin. Входные данные - { email: "string", password: "string" }. Если аутентификация успешна - сервер вернет ответ 
с НТТР кодом 201 и токен доступа в виде:
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMDZmZTAxZTdjZWUxMjk5ZTlkMmZmMSIsImVtYWlsIjoidGVzdEB0ZXN0Lm5ldCIsImZpcnN0bmFtZSI6Ikl2YW4iLCJpYXQiOjE2Mjc4NTk3MTd9.2UA2h1n5IxA_l7kagTBgfzbT6ddrnaUBvpIHu1zpSnA"
}
В противном случае, сервер вернет ответ с НТТР кодом 401.

3. Методы работы с книгой защищены. Для доступа к ним требуется токен доступа, полученный после аутентификации.

Данные хранятся в БД mongodb.
Ключ JWT хранится в переменной окружения.