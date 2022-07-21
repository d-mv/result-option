interface ResultSuccess<Payload> {
  payload: Payload;
}
interface ResultFail<ErrorType = Error> {
  error: ErrorType;
  message: string;
}

/**
 * Class Result to wrap the return that may contain an error. To
 * extract information safely, one has to first check instance.isOK
 * to identify if the instance contains payload or error
 *
 * @name Result
 * @class
 * @param {ResultSuccess|ResultFail} args arguments in either formats: { payload: ... } or { error: ..., message: ...}
 * @example
 * ```typescript
 * const success = new Result({ payload: ['payload'] });
 * const fail = new Result({ error: new Error('Some error message'),
 * message: 'Error details message' });
 *
 * const successChecked = success.isOK ? success.payload : []
 * const failChecked = fail.isOK ? fail.error : new Error('some')
 * ```
 */
export class Result<Payload = never, ErrorType = never> {
  #isOK = false;
  #payload: Payload | undefined;
  #error: ErrorType | undefined;
  #message = '';
  constructor(args: ResultSuccess<Payload> | ResultFail<ErrorType>) {
    if ('payload' in args) {
      this.#payload = args.payload;
      this.#isOK = true;
    } else {
      if (!('error' in args))
        throw new Error('To create a failed Result provide error');
      this.#error = args.error;
      if ('message' in args) this.#message = args.message;
      else this.#message = 'No message has been provided';
    }
  }

  get isOK() {
    return this.#isOK;
  }
  get payload() {
    if (!this.#isOK || !this.#payload)
      throw new Error('Payload is not available');
    return this.#payload;
  }
  get error() {
    if (this.#isOK || !this.#error)
      throw new Error('No error information is available');
    return this.#error;
  }
  get message() {
    if (this.#isOK || !this.message)
      throw new Error('No error message is available');
    return this.#message;
  }
}

/**
 * Class Option to wrap the return in case return might be undefined
 * or null. This is needed to avoid bringing undefined/null into the
 * application
 *
 * @name Option
 * @class
 * @param {Payload | undefined | null} payload any payload
 * @example
 * ```typescript
 * const a = new Option('some');
 *
 * console.log(a.isSome ? a.payload : []); // some
 *
 * const b = new Option(undefined);
 *
 * console.log(b.unwrap()); // undefined
 *
 * const result = b.isSome ? b.payload : [] // []
 * ```
 */
export class Option<Payload = never> {
  #isSome = false;
  #payload: Payload | undefined | null;
  constructor(payload: Payload | undefined | null) {
    this.#payload = payload;
    if (typeof payload !== 'undefined' && payload !== null) this.#isSome = true;
  }

  get isSome() {
    return this.#isSome;
  }

  get payload() {
    if (!this.#isSome) throw new Error('No payload provided or null');
    return this.#payload as Payload;
  }

  unwrap() {
    return this.#payload;
  }
}