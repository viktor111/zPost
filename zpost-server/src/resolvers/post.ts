import { Post } from './../entities/Post';
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { MyContext } from 'src/types';

@Resolver()
export class PostResolver {
    @Query(() => [Post])    
    posts(@Ctx() ctx: MyContext): Promise<Post[]>{
        return  ctx.em.find(Post, {});
    }

   @Query(() => Post)
   post(
       @Arg('id', () => Int) id: number,
       @Ctx() ctx: MyContext
       ): Promise<Post | null>{
       return ctx.em.findOne(Post, { id });
    }

    @Mutation(() => Post)
    async createPost(
        @Arg("title") title: string,
        @Ctx() { em }: MyContext
    ): Promise<Post>{
        const post = em.create(Post, {title})
        await em.persistAndFlush(post)
        return post;
    }

    @Mutation(() => Post, {nullable: true})
    async updatePost(
        @Arg("id") id: number,
        @Arg("title") title: string,
        @Ctx() { em }: MyContext
    ): Promise<Post | null>{
        const post = await em.findOne(Post, {id});
        if(!post){
            return null;
        }
        if(typeof title !== 'undefined'){
            post.title = title;
            await em.persistAndFlush(post)
        }
        return post;
    } 

    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id") id: number,    
        @Ctx() { em }: MyContext
    ): Promise<boolean>{
        try{
            await  em.nativeDelete(Post, {id});
            return true;
        }
        catch{
            return false;
        }
       
    } 
}
