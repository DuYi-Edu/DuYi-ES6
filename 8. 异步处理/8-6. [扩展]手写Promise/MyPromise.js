const MyPromise = (() => {
    const PENDING = "pending",
        RESOLVED = "resolved",
        REJECTED = "rejected",
        PromiveValue = Symbol("PromiseValue"), //状态数据
        PromiseStatus = Symbol("PromiseStatus"),
        thenables = Symbol("thenables"), //thenable
        catchables = Symbol("catchbles"), //catchables
        changeStatus = Symbol("changeStatus"),//当前状态
        settleHandle = Symbol("settleHandle"), //后续处理的通用函数
        linkPromise = Symbol("linkPromise");  //创建串联的Promise

    return class MyPromise {

        /**
         * 改变当前Promise的状态
         * @param {*} newStatus 
         * @param {*} newValue 
         * @param {*} queue 执行的作业队列
         */
        [changeStatus](newStatus, newValue, queue) {
            if (this[PromiseStatus] !== PENDING) {
                //状态无法变更
                return;
            }
            this[PromiseStatus] = newStatus;
            this[PromiveValue] = newValue;
            //执行相应队列中的函数
            queue.forEach(handler => handler(newValue));
        }

        /**
         * 
         * @param {*} executor 未决阶段（pending状态）下的处理函数
         */
        constructor(executor) {
            this[PromiseStatus] = PENDING;
            this[PromiveValue] = undefined;
            this[thenables] = []; //后续处理函数的数组 -> resolved
            this[catchables] = []; //后续处理函数的数组 -> rejected

            const resolve = data => {
                this[changeStatus](RESOLVED, data, this[thenables]);
            }

            const reject = reason => {
                this[changeStatus](REJECTED, reason, this[catchables]);
            }
            try {
                executor(resolve, reject)
            }
            catch (err) {
                reject(err);
            }
        }

        /**
         * 处理 后续处理函数
         * @param {*} handler 后续处理函数
         * @param {*} immediatelyStatus 需要立即执行的状态
         * @param {*} queue 作业队列
         */
        [settleHandle](handler, immediatelyStatus, queue) {
            if (typeof handler !== "function") {
                return;
            }
            if (this[PromiseStatus] === immediatelyStatus) {
                //直接运行
                setTimeout(() => {
                    handler(this[PromiveValue]);
                }, 0);
            }
            else {
                queue.push(handler);
            }
        }

        [linkPromise](thenalbe, catchable) {
            function exec(data, handler, resolve, reject) {
                try {
                    const result = handler(data); //得到当前Promise的处理结果
                    if (result instanceof MyPromise) {
                        result.then(d => {
                            resolve(d)
                        }, err => {
                            reject(err);
                        })
                    }
                    else {
                        resolve(result);
                    }
                }
                catch (err) {
                    reject(err);
                }
            }

            return new MyPromise((resolve, reject) => {
                this[settleHandle](data => {
                    exec(data, thenalbe, resolve, reject);
                }, RESOLVED, this[thenables])

                this[settleHandle](reason => {
                    exec(reason, catchable, resolve, reject);
                }, REJECTED, this[catchables])
            })
        }

        then(thenable, catchable) {
            return this[linkPromise](thenable, catchable);
        }

        catch(catchable) {

            return this[linkPromise](undefined, catchable);
        }


        static All(proms) {

        }

        static race(proms) {

        }

        static resolve(data) {

        }

        static reject(reason) {
            
        }
    }
})();