import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

@InputType()

export class CreateUserInput {

	@Field()
	@IsString()
	@IsNotEmpty()
	@Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/, { message: 'username can only contain alpha numeric characters and underscores' })
	username: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string
}