"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./resolvers/user");
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const hello_1 = require("./resolvers/hello");
const post_1 = require("./resolvers/post");
require("reflect-metadata");
const redis_1 = __importDefault(require("redis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orm = yield core_1.MikroORM.init(mikro_orm_config_1.default);
        yield orm.getMigrator().up();
        const app = express_1.default();
        const RedisStore = connect_redis_1.default(express_session_1.default);
        const redisClient = redis_1.default.createClient();
        app.use(cors_1.default({
            origin: 'http://localhost:3000',
            credentials: true
        }));
        app.use(express_session_1.default({
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
        }));
        const appoloServer = new apollo_server_express_1.ApolloServer({
            schema: yield type_graphql_1.buildSchema({
                resolvers: [hello_1.HelloResolver, post_1.PostResolver, user_1.UserResolver],
                validate: false
            }),
            context: ({ req, res }) => ({ em: orm.em, req, res })
        });
        appoloServer.applyMiddleware({ app, cors: { origin: false } });
        app.listen(3030, () => {
            console.log("Server listens on port 3030");
        });
    }
    catch (err) {
        if (err.code === "ECONNREFUSED") {
            const errArgs = {
                dbName: "zPost",
                errCode: "ECONNREFUSED",
            };
            console.error("ERROR: Connection refused check if postgre service is up", [errArgs]);
        }
    }
});
main().catch(err => {
    console.error(err);
});
//# sourceMappingURL=index.js.map