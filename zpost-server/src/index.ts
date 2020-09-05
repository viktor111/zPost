import { UserResolver } from './resolvers/user';
import { __pord__ } from './constants';
import { MikroORM } from "@mikro-orm/core";
import microConfig from './mikro-orm.config';
import express from "express";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post'
import 'reflect-metadata';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';
import cors from 'cors'



const main = async () =>{

    try{
        const orm = await MikroORM.init(microConfig);
        await orm.getMigrator().up();

        const app = express()

        const RedisStore = connectRedis(session);
        const redisClient = redis.createClient()

        app.use(cors({
            origin: 'http://localhost:3000',
            credentials: true
        }))

        app.use(
            session({
            name: 'qid',
            store: new RedisStore({ 
                client: redisClient,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 100 * 60 * 60 * 24 * 365 * 10,
                httpOnly: true,
                secure: false,
                sameSite: 'lax'
            },
            secret: "zvado",
            resave: false,
            saveUninitialized: false
        }))
        
        const appoloServer = new ApolloServer({
            schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({req, res}): MyContext => ({em: orm.em, req, res})
        })

        appoloServer.applyMiddleware({ app, cors: {origin: false} })
 
        app.listen(3030, () => {
            console.log("Server listens on port 3030")
        })
    }
    catch(err){
        if(err.code === "ECONNREFUSED"){
            const errArgs = {
                dbName: "zPost",
                errCode: "ECONNREFUSED",
            }
            console.error("ERROR: Connection refused check if postgre service is up", [errArgs])
        }
    }
};

main().catch(err => {
    console.error(err)
})