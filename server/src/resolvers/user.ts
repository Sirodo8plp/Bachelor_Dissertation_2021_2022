import { User } from "../entities/User"
import { DbContext } from "../types"
import {Arg, Ctx, Query, Resolver, Mutation, InputType, Field, ObjectType } from "type-graphql"
import * as argon2 from "argon2"
import { DbError } from "./error"

@InputType()
class UserDataInput {
    @Field()
    username: string
    @Field()
    password: string
    @Field()
    email: string
    @Field()
    firstName: string
    @Field()
    lastName: string
}

@ObjectType()
class UserReturnType {
    @Field(() => User, {nullable: true})
    user?: User
    @Field(() => [DbError] , {nullable: true})
    errors?: DbError[]
}


@Resolver()
export class UserResolver {
    @Query(() => User,{nullable: true})
    async me(
        @Ctx() {em,req}: DbContext
    ) {
        if(!req.session.userId){
            return null;
        }
        const user = await em.findOne(User,{userID: req.session.userId});
        return user;
    }

    @Query(() => [User])
    users(
        @Ctx() {em}: DbContext
    ): Promise<User[]> {
        return em.find(User,{});
    }

    @Query(() => User, {nullable: true})
    user(
        @Arg('id') id: number,
        @Ctx() {em}: DbContext
    ): Promise<User | null> {
        return em.findOne(User,{userID: id})
    }

    @Mutation(() => UserReturnType)
    async register(
        @Arg("inputs") {username,password,firstName,lastName,email} : UserDataInput, 
        @Ctx() {em,req}: DbContext
    ): Promise<UserReturnType> {
        try {

            if(!username || !password || !firstName || !lastName || !email){
                return {
                    errors: [{
                        field: "empty",
                        message: "All fields are required in order to proceed."
                    }]
                }; 
            }

            const hashedPassword = await argon2.hash(password);
            const user = em.create(User,{username,password: hashedPassword,firstName,lastName,email});
            await em.persistAndFlush(user);
            req.session.userId = user.userID;
            return  {user,};
        } catch (error) {
            console.error(error);
            if(error.constraint === "user_email_unique")
            return {
                errors: [{
                    field: "email",
                    message: "This email is used by another user."
                }]
            }
            if(error.constraint === "user_username_unique")
            return {
                errors: [{
                    field: "username",
                    message: "This username is taken."
                }]
            }
            return {
                errors: [{
                    field: "database",
                    message: "An internal server error occured. Please, try again later!"
                }]
            }
        }
    }

    @Mutation(() => UserReturnType)
    async login(
        @Arg("username") username: string,
        @Arg("password") password: string,
        @Ctx() {em,req} : DbContext
    ): Promise<UserReturnType> {
        try{
            const user = await em.findOne(User,{username: username});
            if(!user){
                return {
                    errors:[{
                        field: "username",
                        message: "This username does not exist."
                    }]
                }
            }
            const passwordIsValid = await argon2.verify(user.password,password);
            if(!passwordIsValid){
                return {
                    errors: [{
                        field: "password",
                        message: "Your credentials are invalid."
                    }]
                }
            }

            req.session.userId = user.userID;

            return {
                user,
            }
        }
        catch(error) {
            console.log("error");
            return {
                errors: [{
                    field: " database",
                    message: "An internal server error occured. Please, try again later!"
                }]
            };
        }
    }
}
