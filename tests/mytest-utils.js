const request = require('supertest');
const WS = require('ws');


function stubFetch(
    status,
    payload,
    predicate) {
        global.fetch = (url, init) => {
            if(predicate !== null) {
                predicate(url, init);
            }
            return new Promise((resolve, reject) => {
                const httpResponse = {
                    status: status,
                    json: () => {return new Promise(
                        (res, rej) => {res(payload);}
                    )}
                };
                resolve(httpResponse);
            });
        };
    }

function overrideFetch(app){
    const agent = request.agent(app);
        global.fetch = async (url, init) => {
            let response;
            if(!init || !init.method || init.method.toUpperCase() === "GET"){
                response = await agent.get(url);
            } else if(init.method.toUpperCase() === "POST"){
                response = await agent.post(url)
                    .send(init.body)
                    .set('Content-Type', init.headers ? init.headers['Content-Type'] : "application/json");
            } else if(init.method.toUpperCase() === "PUT"){
                response = await agent.put(url)
                    .send(init.body)
                    .set('Content-Type', init.headers ? init.headers['Content-Type'] : "application/json");
            } else if(init.method.toUpperCase() === "DELETE"){
                response = await agent.delete(url);
            } else {
                throw "Unhandled HTTP method: " + init.method;
            }
            const payload = response.body;

            return new Promise( (resolve, reject) => {

                const httpResponse = {
                    status: response.statusCode,
                    json: () => {return new Promise(
                        (res, rej) => {res(payload);}
                    )}
                };

                resolve(httpResponse);
            });
        };
}

function asyncCheckCondition(predicate, totalTimeMS, intervalMS){
        const start = Date.now();
        return new Promise((resolve) => {
            recursiveTimeoutCheck(predicate, totalTimeMS, intervalMS, start, resolve);
        });
}

function recursiveTimeoutCheck(predicate, totalTimeMS, intervalMS, start, resolve){
        const elapsed = Date.now() - start;
        if(elapsed > totalTimeMS){
            resolve(false);
        } else if(predicate()){
            resolve(true);
        } else {
            setTimeout(() => {
                recursiveTimeoutCheck(predicate, totalTimeMS, intervalMS, start, resolve);
            }, intervalMS);
        }
}


function flushPromises() {
        return new Promise(resolve => setImmediate(resolve));
}


function checkConnectedWS(ws, timeoutMs){
        let id;
        const timedOut = new Promise(resolve => {
            id = setTimeout(() => resolve(false), timeoutMs);
        });

        const opened = new Promise(resolve => {
            ws.on('open', () => resolve(true));
        });
        return Promise.race([opened, timedOut])
            .then(result => {
                if(result) {
                    clearTimeout(id);
                }
                return result;
            });
}


class WsStub extends WS{
    constructor(url){
        super(url);

        this.on('message', data => {
            this.onmessage({data});
        });

        this.on('open', data => {
            this.onopen({data});
        });

        this.close = () => this.terminate();
    }
}


function overrideWebSocket(){
    global.WebSocket = WsStub;
}

module.exports = {stubFetch, flushPromises, overrideFetch, asyncCheckCondition, checkConnectedWS, overrideWebSocket};