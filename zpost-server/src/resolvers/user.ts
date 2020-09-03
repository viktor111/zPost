import { Users } from './../entities/User';
import { MyContext } from 'src/types';
import { Resolver, Mutation, InputType, Field, Arg, Ctx, ObjectType, Query } from "type-graphql";
import argon2 from 'argon2';

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

@ObjectType()
class FieldError{
    @Field()
    field: string
    @Field()
    message: string
}

@ObjectType()
class UserResponse{

    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => Users, {nullable: true})
    user?: Users;
}

@Resolver()
export class UserResolver {

    @Query(() => Users, {nullable: true})
    async me(@Ctx() {req, em}: MyContext){
        if(!req.session!.userId){
            return null
        }
       const user = await em.findOne(Users, {id: req.session!.userId});
       return user
    }

    @Mutation(() => UserResponse)    
    async register(
        @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ): Promise<UserResponse>{
        if(options.username.length <= 2){
            return {
                errors:[{
                    field: "username",
                    message: "you need more charectars in your username"
                }]
            }
        }

        if(options.password.length <= 2){
            return {
                errors:[{
                    field: "password",
                    message: "you    need more charectars in your password"
                }]
            }
        }
        const hashedPassword = await argon2.hash(options.password)
        const user = em.create(Users, 
            {
                username: options.username, 
                password: hashedPassword
            });
        
        
        const userExist = em.findOne(Users, {username: options.username})
        if(!userExist){
            return {
                errors: [{
                    field: "username",
                    message: "user already exists"
                }]
            }
        }
        await em.persist(user);
        await em.flush();
        return { user };
    }

    @Mutation(() => UserResponse)    
    async login(
        @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() { em, req}: MyContext
    ): Promise<UserResponse>{
        const user = await em.findOne(Users, {username: options.username})
        if(!user){
            return{
                errors: [{
                    field: 'username',
                    message: 'username dosent exist'
                }]
            }
        }
        const valid = await argon2.verify(user.password,options.password) 
        if (!valid){
            return{
                errors: [{
                    field: 'password',
                    message: 'incorect password'
                }]
            }
        }   

        req.session!.userId = user.id;

        return {
            user,
        };
    }
}

