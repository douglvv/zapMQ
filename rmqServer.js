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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var amqplib_1 = require("amqplib");
require('dotenv').config();
// definir URL no arquivo dotenv
if (!process.env.URL)
    throw new Error('Environment variable URL is not defined.');
var URL = process.env.URL;
var RMQServer = /** @class */ (function () {
    function RMQServer(url) {
        this.url = url;
    }
    // singleton para acessar o objeto da conexão com o rmq
    RMQServer.getInstance = function () {
        if (!RMQServer.instance)
            RMQServer.instance = new RMQServer(URL);
        return RMQServer.instance;
    };
    /**
     * inicia uma conexão e cria um channel no RMQ
     */
    RMQServer.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, (0, amqplib_1.connect)(this.url)];
                    case 1:
                        _a.conn = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.conn.createChannel()];
                    case 2:
                        _b.channel = _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * cria uma fila no servidor do RMQ
     * @param queueName: string
     * @returns queue object
     */
    RMQServer.prototype.createQueue = function (queueName) {
        return __awaiter(this, void 0, void 0, function () {
            var rmqServer, queue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // inicia a conexão caso já não 
                        // tenha sido iniciada
                        if (!this.conn || !this.channel) {
                            rmqServer = RMQServer.getInstance();
                            rmqServer.start();
                        }
                        return [4 /*yield*/, this.channel.assertQueue(queueName, { durable: true })];
                    case 1:
                        queue = _a.sent();
                        return [2 /*return*/, queue];
                }
            });
        });
    };
    /**
     * envia uma mensagem para uma fila
     * @param queueName: string
     * @param message {message: string, timestamp: Date, sender: string}
     */
    RMQServer.prototype.sendMessage = function (queueName, message) {
        return __awaiter(this, void 0, void 0, function () {
            var rmqServer, queue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.conn || !this.channel) {
                            rmqServer = RMQServer.getInstance();
                            rmqServer.start();
                        }
                        return [4 /*yield*/, this.channel.assertQueue(queueName)];
                    case 1:
                        queue = _a.sent();
                        if (!queue)
                            return [2 /*return*/, false];
                        this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * começa a consumir a fila passada por
     * parâmetro
     * @param queueName: string
     * @returns
     */
    RMQServer.prototype.consumeQueue = function (queueName) {
        return __awaiter(this, void 0, void 0, function () {
            var messages, queue;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        messages = [];
                        return [4 /*yield*/, this.channel.assertQueue(queueName)];
                    case 1:
                        queue = _a.sent();
                        if (!queue)
                            return [2 /*return*/, false];
                        _a.label = 2;
                    case 2:
                        if (!true) return [3 /*break*/, 5];
                        // consome a fila
                        return [4 /*yield*/, new Promise(function (resolve) {
                                _this.channel.consume(queueName, function (msg) { return __awaiter(_this, void 0, void 0, function () {
                                    var message;
                                    return __generator(this, function (_a) {
                                        if (!msg) {
                                            // caso nao tenha mensagem continua ouvindo
                                            return [2 /*return*/];
                                        }
                                        try {
                                            message = JSON.parse(msg.content.toString());
                                            console.log("Received message: ".concat(message.message, " from queue ").concat(queueName));
                                            // salva a mensagem na array
                                            messages.push(message);
                                            // Acknowledge na mensagem para remover da fila
                                            // this.channel.ack(msg);
                                            resolve();
                                        }
                                        catch (error) {
                                            console.error('Error processing message:', error);
                                            resolve();
                                        }
                                        return [2 /*return*/];
                                    });
                                }); });
                            })];
                    case 3:
                        // consome a fila
                        _a.sent();
                        // aguarda 10ms antes de procurar por novas mensagens
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10); })];
                    case 4:
                        // aguarda 10ms antes de procurar por novas mensagens
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return RMQServer;
}());
exports["default"] = RMQServer;
