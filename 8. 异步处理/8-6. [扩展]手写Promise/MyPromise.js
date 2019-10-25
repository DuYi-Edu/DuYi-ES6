const MyPromise = (() => {
    const PENDING = "pending",
        RESOLVED = "resolved",
        REJECTED = "rejected",
        PromiveValue = Symbol("PromiseValue"), //状态数据
        PromiseStatus = Symbol("PromiseStatus"),
        changeStatus = Symbol("changeStatus"); //当前状态

    return class MyPromise {

        /**
         * 改变当前Promise的状态
         * @param {*} newStatus 
         * @param {*} newValue 
         */
        [changeStatus](newStatus, newValue) {
            if (this[PromiseStatus] !== PENDING) {
                //状态无法变更
                return;
            }
            this[PromiseStatus] = newStatus;
            this[PromiveValue] = newValue;
        }

        /**
         * 
         * @param {*} executor 未决阶段（pending状态）下的处理函数
         */
        constructor(executor) {
            this[PromiseStatus] = PENDING;
            this[PromiveValue] = undefined;

            const resolve = data => {
                this[changeStatus](RESOLVED, data);
            }

            const reject = reason => {
                this[changeStatus](REJECTED, reason);
            }
            try {
                executor(resolve, reject)
            }
            catch (err) {
                reject(err);
            }
        }
    }
})();