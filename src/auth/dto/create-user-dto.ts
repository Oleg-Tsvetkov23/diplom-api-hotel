import { Users } from "../../user/users.interface";

export class UserCreateDto {
    email : Users['email'];
    passwordHash : Users['passwordHash'];
    name : Users['name'];
    contactPhone? : Users['contactPhone'];
    role : Users['role']
}
