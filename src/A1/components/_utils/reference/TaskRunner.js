import resolver from './resolvers';

export default class TaskRunner {
    PIPE = '|';

    /** Loaded tasks */
    #input = [];

    /** <string,mixed> Key-value map of environment variables */
    #arguments = [];

    /** <string,bool> Map of used arguments */
    #used = [];

    #editMode = false;

    #extraArgs = {};

    constructor(editMode = false) {
        this.#editMode = editMode;
    }

    // this seems not needed
    #isFieldString = (string) => {
        try {
            return JSON.parse(string) && !!string;
        } catch (e) {
            return false;
        }
    };

    #isFieldObj = (obj) => {
        if ('fieldId' in obj) {
            return true;
        }
    };

    #isTask(array) {
        if (
            Array.isArray(array) &&
            array.length === 2 &&
            typeof array[0] === 'string'
            // &&   !this.#isFieldString(array[0])
        ) {
            if (Array.isArray(array[1]) || (array[1] && typeof array[1] === 'object')) {
                return true;
            }
            return false;
        }

        return false;
    }

    #isTaskList(array) {
        if (Array.isArray(array)) {
            for (const task of array) {
                if (!this.#isTask(task)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    setInput(input) {
        this.#input = input;
    }

    resolve(_arguments, extraArgs = {}) {
        this.#arguments = _arguments;
        this.#used = [];
        this.#extraArgs = extraArgs;

        const resolvedArguments = this.#resolveArguments(this.#input);

        return this.#runTasks(resolvedArguments);
    }

    #resolveArguments(arg) {
        if (typeof arg === 'string') {
            return this.#replaceArgument(arg);
        }

        if (Array.isArray(arg)) {
            arg.forEach((a, index) => {
                arg[index] = this.#resolveArguments(a);
            });
        } else if (arg && typeof arg === 'object') {
            for (const [ak, av] of Object.entries(arg)) {
                arg[ak] = this.#resolveArguments(av);
            }
        }

        return arg;
    }

    #replaceArgument(val) {
        if (val.startsWith('$.')) {
            let name = val.substring(2);

            if (name === '*') {
                val = this.#arguments;
            } else if (name === '?') {
                val = this.#used;
            } else {
                val = this.#getArgumentValue(name);
                this.#used[name] = true;
            }
        }

        return val;
    }

    #getArgumentValue(key) {
        if (this.#arguments[key]) {
            // return JSON.stringify(this.#arguments[key]);
            return this.#arguments[key];
        }
        // console.warn(
        //     'Warning! target argument: ',
        //     key,
        //     ' does not exist in arguments: ',
        //     this.#arguments,
        //     ' this will lead bug when resolve, this field might be disabled, check network and profileDataParser'
        // );

        return undefined;

        // let pos = key.indexOf('.');

        // if (pos === -1) return null;

        // $temp = &$this->arguments;
        // $offset = 0;

        // do {
        //     $word = substr($key, $offset, $pos - $offset);

        //     if (!isset($temp[$word]))
        //         return null;

        //     $temp = &$temp[$word];
        //     $offset = $pos + 1;
        //     $pos = strpos($key, '.', $offset);
        // } while ($pos);

        // $word = substr($key, $offset);

        // if (!isset($temp[$word]))
        //     return null;

        // return $temp[$word];
    }

    #runTasks(input) {
        if (
            !input ||
            (!Array.isArray(input) && input && typeof input !== 'object') ||
            this.#isFieldObj(input) // if it is an field object, simply return it
        ) {
            return input;
        } else if (this.#isTask(input)) {
            return this.#callResolver(input[0], input[1]);
        }

        let result = [];

        if (this.#isTaskList(input)) {
            let cursor = -1;

            input.forEach((task) => {
                if (task[1]['@'] === this.PIPE) {
                    task[1]['@'] = result[cursor] ?? null;
                    if (cursor < 0) cursor = 0;
                } else {
                    cursor++;
                }
                result[cursor] = this.#callResolver(task[0], task[1]);
            });

            // If pipes were used, and the is only one element, flatten the result
            if (cursor === 0 && input.length > 1) result = result[0];
        } else {
            if (Array.isArray(input)) {
                input.forEach((i) => {
                    result.push(this.#runTasks(i));
                });
            } else if (input && typeof input === 'object') {
                for (const [ik, iv] of Object.entries(input)) {
                    result[ik] = this.#runTasks(iv);
                }
            }
        }

        return result;
    }

    #callResolver(action, params) {
        // Check the $params before resolving them to see if their
        // RESULT needs to be passed to the RESOLVER via a DATA key
        const isData = this.#isTask(params) || this.#isTaskList(params);

        // Run any nested tasks recursively
        params = this.#runTasks(params);

        if (isData) params = { '@': params };

        return resolver(action, params, { editMode: this.#editMode, ...this.#extraArgs });
    }

    getUnusedArguments(_arguments = null) {
        if (_arguments !== null) {
            this.#arguments = _arguments;
            this.#used = [];
            this.#resolveArguments(this.#input);
        }

        let args = [];

        for (const [ak, av] of Object.entries(this.#arguments)) {
            if (!this.#used[ak]) {
                args[ak] = av;
            }
        }

        return args;
    }
}
