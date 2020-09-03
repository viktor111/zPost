import { Users } from './entities/User';
import { MikroORM } from '@mikro-orm/core';
import { Post } from "./entities/Post";
import { __pord__ } from "./constants";
import path from "path";

export default {
    migrations: {
        path: path.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/, 
    },
    entities:[Post, Users],
    dbName: "zPost",
    user: "postgres",
    password: "viktor11",
    type: "postgresql",
    debug: !__pord__
} as Parameters<typeof MikroORM.init>[0];