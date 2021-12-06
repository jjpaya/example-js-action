/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    return inputs;
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issueCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(9925);
const auth_1 = __nccwpck_require__(3702);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 3702:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' +
                Buffer.from(this.username + ':' + this.password).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] = 'Bearer ' + this.token;
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' + Buffer.from('PAT:' + this.token).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;


/***/ }),

/***/ 9925:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const http = __nccwpck_require__(3685);
const https = __nccwpck_require__(5687);
const pm = __nccwpck_require__(6443);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = new URL(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = new URL(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __nccwpck_require__(4294);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    ...((proxyUrl.username || proxyUrl.password) && {
                        proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                    }),
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new HttpClientError(msg, statusCode);
                err.result = response.result;
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),

/***/ 6443:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = new URL(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),

/***/ 9379:
/***/ ((module) => {

module.exports = function parallel(fns, context, callback) {
  if (!callback) {
    if (typeof context === 'function') {
      callback = context
      context = null
    } else {
      callback = noop
    }
  }

  var pending = fns && fns.length
  if (!pending) return callback(null, []);

  var finished = false
  var results = new Array(pending)

  fns.forEach(context ? function (fn, i) {
    fn.call(context, maybeDone(i))
  } : function (fn, i) {
    fn(maybeDone(i))
  })

  function maybeDone(i) {
    return function (err, result) {
      if (finished) return;

      if (err) {
        callback(err, results)
        finished = true
        return
      }

      results[i] = result

      if (!--pending) callback(null, results);
    }
  }
}

function noop() {}


/***/ }),

/***/ 4375:
/***/ ((module) => {

module.exports = function series(fns, context, callback) {
  if (!callback) {
    if (typeof context === 'function') {
      callback = context
      context = null
    } else {
      callback = noop
    }
  }

  if (!(fns && fns.length)) return callback();

  fns = fns.slice(0)

  var call = context
  ? function () {
    fns.length
      ? fns.shift().call(context, next)
      : callback()
  }
  : function () {
    fns.length
      ? fns.shift()(next)
      : callback()
  }

  call()

  function next(err) {
    err ? callback(err) : call()
  }
}

function noop() {}


/***/ }),

/***/ 2746:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var cp = __nccwpck_require__(2081);
var parse = __nccwpck_require__(6855);
var enoent = __nccwpck_require__(4101);

var cpSpawnSync = cp.spawnSync;

function spawn(command, args, options) {
    var parsed;
    var spawned;

    // Parse the arguments
    parsed = parse(command, args, options);

    // Spawn the child process
    spawned = cp.spawn(parsed.command, parsed.args, parsed.options);

    // Hook into child process "exit" event to emit an error if the command
    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    enoent.hookChildProcess(spawned, parsed);

    return spawned;
}

function spawnSync(command, args, options) {
    var parsed;
    var result;

    if (!cpSpawnSync) {
        try {
            cpSpawnSync = __nccwpck_require__(5500);  // eslint-disable-line global-require
        } catch (ex) {
            throw new Error(
                'In order to use spawnSync on node 0.10 or older, you must ' +
                'install spawn-sync:\n\n' +
                '  npm install spawn-sync --save'
            );
        }
    }

    // Parse the arguments
    parsed = parse(command, args, options);

    // Spawn the child process
    result = cpSpawnSync(parsed.command, parsed.args, parsed.options);

    // Analyze if the command does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

    return result;
}

module.exports = spawn;
module.exports.spawn = spawn;
module.exports.sync = spawnSync;

module.exports._parse = parse;
module.exports._enoent = enoent;


/***/ }),

/***/ 4101:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var isWin = process.platform === 'win32';
var resolveCommand = __nccwpck_require__(1819);

var isNode10 = process.version.indexOf('v0.10.') === 0;

function notFoundError(command, syscall) {
    var err;

    err = new Error(syscall + ' ' + command + ' ENOENT');
    err.code = err.errno = 'ENOENT';
    err.syscall = syscall + ' ' + command;

    return err;
}

function hookChildProcess(cp, parsed) {
    var originalEmit;

    if (!isWin) {
        return;
    }

    originalEmit = cp.emit;
    cp.emit = function (name, arg1) {
        var err;

        // If emitting "exit" event and exit code is 1, we need to check if
        // the command exists and emit an "error" instead
        // See: https://github.com/IndigoUnited/node-cross-spawn/issues/16
        if (name === 'exit') {
            err = verifyENOENT(arg1, parsed, 'spawn');

            if (err) {
                return originalEmit.call(cp, 'error', err);
            }
        }

        return originalEmit.apply(cp, arguments);
    };
}

function verifyENOENT(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawn');
    }

    return null;
}

function verifyENOENTSync(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawnSync');
    }

    // If we are in node 10, then we are using spawn-sync; if it exited
    // with -1 it probably means that the command does not exist
    if (isNode10 && status === -1) {
        parsed.file = isWin ? parsed.file : resolveCommand(parsed.original);

        if (!parsed.file) {
            return notFoundError(parsed.original, 'spawnSync');
        }
    }

    return null;
}

module.exports.hookChildProcess = hookChildProcess;
module.exports.verifyENOENT = verifyENOENT;
module.exports.verifyENOENTSync = verifyENOENTSync;
module.exports.notFoundError = notFoundError;


/***/ }),

/***/ 5316:
/***/ ((module) => {

"use strict";


module.exports = (function () {
    if (process.platform !== 'win32') {
        return false;
    }
    var nodeVer = process.version.substr(1).split('.').map(function (num) {
        return parseInt(num, 10);
    });
    return (nodeVer[0] === 0 && nodeVer[1] < 12);
})();


/***/ }),

/***/ 6855:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var fs = __nccwpck_require__(7147);
var LRU = __nccwpck_require__(7129);
var resolveCommand = __nccwpck_require__(1819);
var hasBrokenSpawn = __nccwpck_require__(5316);

var isWin = process.platform === 'win32';
var shebangCache = new LRU({ max: 50, maxAge: 30 * 1000 });  // Cache just for 30sec

function readShebang(command) {
    var buffer;
    var fd;
    var match;
    var shebang;

    // Check if it is in the cache first
    if (shebangCache.has(command)) {
        return shebangCache.get(command);
    }

    // Read the first 150 bytes from the file
    buffer = new Buffer(150);

    try {
        fd = fs.openSync(command, 'r');
        fs.readSync(fd, buffer, 0, 150, 0);
        fs.closeSync(fd);
    } catch (e) { /* empty */ }

    // Check if it is a shebang
    match = buffer.toString().trim().match(/#!(.+)/i);

    if (match) {
        shebang = match[1].replace(/\/usr\/bin\/env\s+/i, '');   // Remove /usr/bin/env
    }

    // Store the shebang in the cache
    shebangCache.set(command, shebang);

    return shebang;
}

function escapeArg(arg, quote) {
    // Convert to string
    arg = '' + arg;

    // If we are not going to quote the argument,
    // escape shell metacharacters, including double and single quotes:
    if (!quote) {
        arg = arg.replace(/([\(\)%!\^<>&|;,"'\s])/g, '^$1');
    } else {
        // Sequence of backslashes followed by a double quote:
        // double up all the backslashes and escape the double quote
        arg = arg.replace(/(\\*)"/g, '$1$1\\"');

        // Sequence of backslashes followed by the end of the string
        // (which will become a double quote later):
        // double up all the backslashes
        arg = arg.replace(/(\\*)$/, '$1$1');

        // All other backslashes occur literally

        // Quote the whole thing:
        arg = '"' + arg + '"';
    }

    return arg;
}

function escapeCommand(command) {
    // Do not escape if this command is not dangerous..
    // We do this so that commands like "echo" or "ifconfig" work
    // Quoting them, will make them unaccessible
    return /^[a-z0-9_-]+$/i.test(command) ? command : escapeArg(command, true);
}

function requiresShell(command) {
    return !/\.(?:com|exe)$/i.test(command);
}

function parse(command, args, options) {
    var shebang;
    var applyQuotes;
    var file;
    var original;
    var shell;

    // Normalize arguments, similar to nodejs
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }

    args = args ? args.slice(0) : [];  // Clone array to avoid changing the original
    options = options || {};
    original = command;

    if (isWin) {
        // Detect & add support for shebangs
        file = resolveCommand(command);
        file = file || resolveCommand(command, true);
        shebang = file && readShebang(file);
        shell = options.shell || hasBrokenSpawn;

        if (shebang) {
            args.unshift(file);
            command = shebang;
            shell = shell || requiresShell(resolveCommand(shebang) || resolveCommand(shebang, true));
        } else {
            shell = shell || requiresShell(file);
        }

        if (shell) {
            // Escape command & arguments
            applyQuotes = (command !== 'echo');  // Do not quote arguments for the special "echo" command
            command = escapeCommand(command);
            args = args.map(function (arg) {
                return escapeArg(arg, applyQuotes);
            });

            // Use cmd.exe
            args = ['/s', '/c', '"' + command + (args.length ? ' ' + args.join(' ') : '') + '"'];
            command = process.env.comspec || 'cmd.exe';

            // Tell node's spawn that the arguments are already escaped
            options.windowsVerbatimArguments = true;
        }
    }

    return {
        command: command,
        args: args,
        options: options,
        file: file,
        original: original,
    };
}

module.exports = parse;


/***/ }),

/***/ 1819:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var path = __nccwpck_require__(1017);
var which = __nccwpck_require__(4207);
var LRU = __nccwpck_require__(7129);

var commandCache = new LRU({ max: 50, maxAge: 30 * 1000 });  // Cache just for 30sec

function resolveCommand(command, noExtension) {
    var resolved;

    noExtension = !!noExtension;
    resolved = commandCache.get(command + '!' + noExtension);

    // Check if its resolved in the cache
    if (commandCache.has(command)) {
        return commandCache.get(command);
    }

    try {
        resolved = !noExtension ?
            which.sync(command) :
            which.sync(command, { pathExt: path.delimiter + (process.env.PATHEXT || '') });
    } catch (e) { /* empty */ }

    commandCache.set(command + '!' + noExtension, resolved);

    return resolved;
}

module.exports = resolveCommand;


/***/ }),

/***/ 8222:
/***/ ((module, exports, __nccwpck_require__) => {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */
// eslint-disable-next-line complexity

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if (match === '%%') {
      return;
    }

    index++;

    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */


function log() {
  var _console;

  // This hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return (typeof console === "undefined" ? "undefined" : _typeof(console)) === 'object' && console.log && (_console = console).log.apply(_console, arguments);
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  var r;

  try {
    r = exports.storage.getItem('debug');
  } catch (error) {} // Swallow
  // XXX (@Qix-) should we be logging these?
  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */


function localstorage() {
  try {
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = __nccwpck_require__(6243)(exports);
var formatters = module.exports.formatters;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};



/***/ }),

/***/ 6243:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */
function setup(env) {
  createDebug.debug = createDebug;
  createDebug.default = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = __nccwpck_require__(900);
  Object.keys(env).forEach(function (key) {
    createDebug[key] = env[key];
  });
  /**
  * Active `debug` instances.
  */

  createDebug.instances = [];
  /**
  * The currently active debug mode names, and names to skip.
  */

  createDebug.names = [];
  createDebug.skips = [];
  /**
  * Map of special "%n" handling functions, for the debug "format" argument.
  *
  * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
  */

  createDebug.formatters = {};
  /**
  * Selects a color for a debug namespace
  * @param {String} namespace The namespace string for the for the debug instance to be colored
  * @return {Number|String} An ANSI color code for the given namespace
  * @api private
  */

  function selectColor(namespace) {
    var hash = 0;

    for (var i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }

  createDebug.selectColor = selectColor;
  /**
  * Create a debugger with the given `namespace`.
  *
  * @param {String} namespace
  * @return {Function}
  * @api public
  */

  function createDebug(namespace) {
    var prevTime;

    function debug() {
      // Disabled?
      if (!debug.enabled) {
        return;
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var self = debug; // Set `diff` timestamp

      var curr = Number(new Date());
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);

      if (typeof args[0] !== 'string') {
        // Anything else let's inspect with %O
        args.unshift('%O');
      } // Apply any `formatters` transformations


      var index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
        // If we encounter an escaped % then don't increase the array index
        if (match === '%%') {
          return match;
        }

        index++;
        var formatter = createDebug.formatters[format];

        if (typeof formatter === 'function') {
          var val = args[index];
          match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

          args.splice(index, 1);
          index--;
        }

        return match;
      }); // Apply env-specific formatting (colors, etc.)

      createDebug.formatArgs.call(self, args);
      var logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
    debug.enabled = createDebug.enabled(namespace);
    debug.useColors = createDebug.useColors();
    debug.color = selectColor(namespace);
    debug.destroy = destroy;
    debug.extend = extend; // Debug.formatArgs = formatArgs;
    // debug.rawLog = rawLog;
    // env-specific initialization logic for debug instances

    if (typeof createDebug.init === 'function') {
      createDebug.init(debug);
    }

    createDebug.instances.push(debug);
    return debug;
  }

  function destroy() {
    var index = createDebug.instances.indexOf(this);

    if (index !== -1) {
      createDebug.instances.splice(index, 1);
      return true;
    }

    return false;
  }

  function extend(namespace, delimiter) {
    return createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
  }
  /**
  * Enables a debug mode by namespaces. This can include modes
  * separated by a colon and wildcards.
  *
  * @param {String} namespaces
  * @api public
  */


  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.names = [];
    createDebug.skips = [];
    var i;
    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    var len = split.length;

    for (i = 0; i < len; i++) {
      if (!split[i]) {
        // ignore empty strings
        continue;
      }

      namespaces = split[i].replace(/\*/g, '.*?');

      if (namespaces[0] === '-') {
        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        createDebug.names.push(new RegExp('^' + namespaces + '$'));
      }
    }

    for (i = 0; i < createDebug.instances.length; i++) {
      var instance = createDebug.instances[i];
      instance.enabled = createDebug.enabled(instance.namespace);
    }
  }
  /**
  * Disable debug output.
  *
  * @api public
  */


  function disable() {
    createDebug.enable('');
  }
  /**
  * Returns true if the given mode name is enabled, false otherwise.
  *
  * @param {String} name
  * @return {Boolean}
  * @api public
  */


  function enabled(name) {
    if (name[name.length - 1] === '*') {
      return true;
    }

    var i;
    var len;

    for (i = 0, len = createDebug.skips.length; i < len; i++) {
      if (createDebug.skips[i].test(name)) {
        return false;
      }
    }

    for (i = 0, len = createDebug.names.length; i < len; i++) {
      if (createDebug.names[i].test(name)) {
        return true;
      }
    }

    return false;
  }
  /**
  * Coerce `val`.
  *
  * @param {Mixed} val
  * @return {Mixed}
  * @api private
  */


  function coerce(val) {
    if (val instanceof Error) {
      return val.stack || val.message;
    }

    return val;
  }

  createDebug.enable(createDebug.load());
  return createDebug;
}

module.exports = setup;



/***/ }),

/***/ 8237:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */
if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
  module.exports = __nccwpck_require__(8222);
} else {
  module.exports = __nccwpck_require__(5332);
}



/***/ }),

/***/ 5332:
/***/ ((module, exports, __nccwpck_require__) => {

"use strict";


/**
 * Module dependencies.
 */
var tty = __nccwpck_require__(6224);

var util = __nccwpck_require__(3837);
/**
 * This is the Node.js implementation of `debug()`.
 */


exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
  // Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
  // eslint-disable-next-line import/no-extraneous-dependencies
  var supportsColor = __nccwpck_require__(9318);

  if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
    exports.colors = [20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221];
  }
} catch (error) {} // Swallow - we only care if `supports-color` is available; it doesn't have to be.

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */


exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // Camel-case
  var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, function (_, k) {
    return k.toUpperCase();
  }); // Coerce string value into JS value

  var val = process.env[key];

  if (/^(yes|on|true|enabled)$/i.test(val)) {
    val = true;
  } else if (/^(no|off|false|disabled)$/i.test(val)) {
    val = false;
  } else if (val === 'null') {
    val = null;
  } else {
    val = Number(val);
  }

  obj[prop] = val;
  return obj;
}, {});
/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
}
/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  var name = this.namespace,
      useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var colorCode = "\x1B[3" + (c < 8 ? c : '8;5;' + c);
    var prefix = "  ".concat(colorCode, ";1m").concat(name, " \x1B[0m");
    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + "\x1B[0m");
  } else {
    args[0] = getDate() + name + ' ' + args[0];
  }
}

function getDate() {
  if (exports.inspectOpts.hideDate) {
    return '';
  }

  return new Date().toISOString() + ' ';
}
/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */


function log() {
  return process.stderr.write(util.format.apply(util, arguments) + '\n');
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  if (namespaces) {
    process.env.DEBUG = namespaces;
  } else {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  return process.env.DEBUG;
}
/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */


function init(debug) {
  debug.inspectOpts = {};
  var keys = Object.keys(exports.inspectOpts);

  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

module.exports = __nccwpck_require__(6243)(exports);
var formatters = module.exports.formatters;
/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .split('\n')
    .map(function (str) { return str.trim(); })
    .join(' ');
};
/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */


formatters.O = function (v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};



/***/ }),

/***/ 2442:
/***/ ((module, exports, __nccwpck_require__) => {


/**
 * Module dependencies.
 */

var Stream = (__nccwpck_require__(2781).Stream);
var EventEmitter = (__nccwpck_require__(2361).EventEmitter);
var util = __nccwpck_require__(3837);

util.inherits(gm, EventEmitter);

/**
 * Constructor.
 *
 * @param {String|Number} path - path to img source or ReadableStream or width of img to create
 * @param {Number} [height] - optional filename of ReadableStream or height of img to create
 * @param {String} [color] - optional hex background color of created img
 */

function gm (source, height, color) {
  var width;

  if (!(this instanceof gm)) {
    return new gm(source, height, color);
  }

  EventEmitter.call(this);

  this._options = {};
  this.options(this.__proto__._options);

  this.data = {};
  this._in = [];
  this._out = [];
  this._outputFormat = null;
  this._subCommand = 'convert';

  if (source instanceof Stream) {
    this.sourceStream = source;
    source = height || 'unknown.jpg';
  } else if (Buffer.isBuffer(source)) {
    this.sourceBuffer = source;
    source = height || 'unknown.jpg';
  } else if (height) {
    // new images
    width = source;
    source = "";

    this.in("-size", width + "x" + height);

    if (color) {
      this.in("xc:"+ color);
    }
  }

  if (typeof source === "string") {
    // then source is a path

    // parse out gif frame brackets from filename
    // since stream doesn't use source path
    // eg. "filename.gif[0]"
    var frames = source.match(/(\[.+\])$/);
    if (frames) {
      this.sourceFrames = source.substr(frames.index, frames[0].length);
      source = source.substr(0, frames.index);
    }
  }

  this.source = source;

  this.addSrcFormatter(function (src) {
    // must be first source formatter

    var inputFromStdin = this.sourceStream || this.sourceBuffer;
    var ret = inputFromStdin ? '-' : this.source;

    if (ret && this.sourceFrames) ret += this.sourceFrames;

    src.length = 0;
    src[0] = ret;
  });
}

/**
 * Subclasses the gm constructor with custom options.
 *
 * @param {options} options
 * @return {gm} the subclasses gm constructor
 */

var parent = gm;
gm.subClass = function subClass (options) {
  function gm (source, height, color) {
    if (!(this instanceof parent)) {
      return new gm(source, height, color);
    }

    parent.call(this, source, height, color);
  }

  gm.prototype.__proto__ = parent.prototype;
  gm.prototype._options = {};
  gm.prototype.options(options);

  return gm;
}

/**
 * Augment the prototype.
 */

__nccwpck_require__(8179)(gm.prototype);
__nccwpck_require__(1057)(gm);
__nccwpck_require__(3348)(gm.prototype);
__nccwpck_require__(6561)(gm.prototype);
__nccwpck_require__(5827)(gm.prototype);
__nccwpck_require__(8176)(gm.prototype);
__nccwpck_require__(1821)(gm.prototype);
__nccwpck_require__(8429)(gm.prototype);
__nccwpck_require__(239)(gm.prototype);

/**
 * Expose.
 */

module.exports = exports = gm;
module.exports.utils = __nccwpck_require__(538);
module.exports.compare = __nccwpck_require__(1821)();
module.exports.version = __nccwpck_require__(1600).version;


/***/ }),

/***/ 3348:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/**
 * Dependencies
 */

var argsToArray = (__nccwpck_require__(538).argsToArray);
var isUtil = (__nccwpck_require__(538).isUtil);
/**
 * Extend proto
 */

module.exports = function (proto) {
  // change the specified frame.
  // See #202.
  proto.selectFrame = function (frame) {
    if (typeof frame === 'number')
      this.sourceFrames = '[' + frame + ']';
    return this;
  }

  // define the sub-command to use, http://www.graphicsmagick.org/utilities.html
  proto.command = proto.subCommand = function subCommand (name){
    this._subCommand = name;
    return this;
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-adjoin
  proto.adjoin = function adjoin () {
    return this.out("-adjoin");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-affine
  proto.affine = function affine (matrix) {
    return this.out("-affine", matrix);
  }

  proto.alpha = function alpha (type) {
    if (!this._options.imageMagick) return new Error('Method -alpha is not supported by GraphicsMagick');
    return this.out('-alpha', type);
  }

  /**
   * Appends images to the list of "source" images.
   *
   * We may also specify either top-to-bottom or left-to-right
   * behavior of the appending by passing a boolean argument.
   *
   * Examples:
   *
   *    img = gm(src);
   *
   *    // +append means left-to-right
   *    img.append(img1, img2)       gm convert src img1 img2 -append
   *    img.append(img, true)        gm convert src img +append
   *    img.append(img, false)       gm convert src img -append
   *    img.append(img)              gm convert src img -append
   *    img.append(img).append()     gm convert src img -append
   *    img.append(img).append(true) gm convert src img +append
   *    img.append(img).append(true) gm convert src img +append
   *    img.append(img).background('#222) gm convert src img -background #222 +append
   *    img.append([img1,img2...],true)

   * @param {String} or {Array} [img]
   * @param {Boolean} [ltr]
   * @see http://www.graphicsmagick.org/GraphicsMagick.html#details-append
   */

  proto.append = function append (img, ltr) {
    if (!this._append) {
      this._append = [];
      this.addSrcFormatter(function (src) {
        this.out(this._append.ltr ? '+append' : '-append');
        src.push.apply(src, this._append);
      });
    }

    if (0 === arguments.length) {
      this._append.ltr = false;
      return this;
    }

    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      switch (isUtil(arg)) {
        case 'Boolean':
          this._append.ltr = arg;
          break;
        case 'String':
          this._append.push(arg);
          break;
        case 'Array':
          for(var j=0,len=arg.length;j<len;j++){
            if(isUtil(arg[j]) == 'String'){
              this._append.push(arg[j]);
            }
          }
          break;
      }
    }

    return this;
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-authenticate
  proto.authenticate = function authenticate (string) {
    return this.out("-authenticate", string);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-average
  proto.average = function average () {
    return this.out("-average");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-backdrop
  proto.backdrop = function backdrop () {
    return this.out("-backdrop");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-black-threshold
  proto.blackThreshold = function blackThreshold (red, green, blue, opacity) {
    return this.out("-black-threshold", argsToArray(red, green, blue, opacity).join(','));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-blue-primary
  proto.bluePrimary = function bluePrimary (x, y) {
    return this.out("-blue-primary", argsToArray(x, y).join(','));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-border
  proto.border = function border (width, height) {
    return this.out("-border", width+"x"+height);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-bordercolor
  proto.borderColor = function borderColor (color) {
    return this.out("-bordercolor", color);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-box
  proto.box = function box (color) {
    return this.out("-box", color);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-channel
  proto.channel = function channel (type) {
    return this.out("-channel", type);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-chop
  proto.chop = function chop (w, h, x, y) {
    return this.in("-chop", w+"x"+h + "+"+(x||0)+"+"+(y||0));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-clip
  proto.clip = function clip () {
    return this.out("-clip");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-coalesce
  proto.coalesce = function coalesce () {
    return this.out("-coalesce");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-colorize
  proto.colorize = function colorize (r, g, b) {
    return this.out("-colorize", [r,g,b].join(","));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-colormap
  proto.colorMap = function colorMap (type) {
    return this.out("-colormap", type);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-compose
  proto.compose = function compose (operator) {
    return this.out("-compose", operator);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-compress
  proto.compress = function compress (type) {
    return this.out("-compress", type);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-kernel
  proto.convolve = function convolve (kernel) {
    return this.out("-convolve", kernel);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-create-directories
  proto.createDirectories = function createDirectories () {
    return this.out("-create-directories");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-deconstruct
  proto.deconstruct = function deconstruct () {
    return this.out("-deconstruct");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-define
  proto.define = function define (value) {
    return this.out("-define", value);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-delay
  proto.delay = function delay (value) {
    return this.out("-delay", value);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-displace
  proto.displace = function displace (horizontalScale, verticalScale) {
    return this.out("-displace", horizontalScale+'x'+verticalScale);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-display
  proto.display = function display (value) {
    return this.out("-display", value);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-dispose
  proto.dispose = function dispose (method) {
    return this.out("-dispose", method);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-dissolve
  proto.dissolve = function dissolve (percent) {
    return this.out("-dissolve", percent+'%');
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-encoding
  proto.encoding = function encoding (type) {
    return this.out("-encoding", type);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-endian
  proto.endian = function endian (type) {
    return this.out("-endian", type);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-file
  proto.file = function file (filename) {
    return this.out("-file", filename);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-flatten
  proto.flatten = function flatten () {
    return this.out("-flatten");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-foreground
  proto.foreground = function foreground (color) {
    return this.out("-foreground", color);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-frame
  proto.frame = function frame (width, height, outerBevelWidth, innerBevelWidth) {
    if(arguments.length==0) return this.out("-frame");
    return this.out("-frame", width+'x'+height+'+'+outerBevelWidth+'+'+innerBevelWidth);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-fuzz
  proto.fuzz = function fuzz (distance, percent) {
    return this.out("-fuzz", distance+(percent?'%':''));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-gaussian
  proto.gaussian = function gaussian (radius, sigma) {
    return this.out("-gaussian", argsToArray(radius, sigma).join('x'));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
  proto.geometry = function geometry (width, height, arg) {
    // If the first argument is a string, and there is only one argument, this is a custom geometry command.
    if(arguments.length == 1 && typeof arguments[0] === "string")
      return this.out("-geometry", arguments[0]);

    // Otherwise, return a resizing geometry command with an option alrgument.
    return this.out("-geometry", width+'x'+height+(arg||''));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-green-primary
  proto.greenPrimary = function greenPrimary (x, y) {
    return this.out("-green-primary", x+','+y);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-highlight-color
  proto.highlightColor = function highlightColor (color) {
    return this.out("-highlight-color", color);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-highlight-style
  proto.highlightStyle = function highlightStyle (style) {
    return this.out("-highlight-style", style);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-iconGeometry
  proto.iconGeometry = function iconGeometry (geometry) {
    return this.out("-iconGeometry", geometry);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-intent
  proto.intent = function intent (type) {
    return this.out("-intent", type);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-lat
  proto.lat = function lat (width, height, offset, percent) {
    return this.out("-lat", width+'x'+height+offset+(percent?'%':''));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-level
  proto.level = function level (blackPoint, gamma, whitePoint, percent) {
    return this.out("-level", argsToArray(blackPoint, gamma, whitePoint).join(',')+(percent?'%':''));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-list
  proto.list = function list (type) {
    return this.out("-list", type);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-log
  proto.log = function log (string) {
    return this.out("-log", string);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-loop
  proto.loop = function loop (iterations) {
    return this.out("-loop", iterations);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-map
  proto.map = function map (filename) {
    return this.out("-map", filename);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-mask
  proto.mask = function mask (filename) {
    return this.out("-mask", filename);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-matte
  proto.matte = function matte () {
    return this.out("-matte");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-mattecolor
  proto.matteColor = function matteColor (color) {
    return this.out("-mattecolor", color);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-maximum-error
  proto.maximumError = function maximumError (limit) {
    return this.out("-maximum-error", limit);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-mode
  proto.mode = function mode (value) {
    return this.out("-mode", value);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-monitor
  proto.monitor = function monitor () {
    return this.out("-monitor");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-mosaic
  proto.mosaic = function mosaic () {
    return this.out("-mosaic");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-motion-blur
  proto.motionBlur = function motionBlur (radius, sigma, angle) {
    var arg=radius;
    if (typeof sigma!='undefined') arg+='x'+sigma;
    if (typeof angle!='undefined') arg+='+'+angle;
    return this.out("-motion-blur", arg);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-name
  proto.name = function name () {
    return this.out("-name");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-noop
  proto.noop = function noop () {
    return this.out("-noop");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-normalize
  proto.normalize = function normalize () {
    return this.out("-normalize");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-opaque
  proto.opaque = function opaque (color) {
    return this.out("-opaque", color);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-operator
  proto.operator = function operator (channel, operator, rvalue, percent) {
    return this.out("-operator", channel, operator, rvalue+(percent?'%':''));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-ordered-dither
  proto.orderedDither = function orderedDither (channeltype, NxN) {
    return this.out("-ordered-dither", channeltype, NxN);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-output-directory
  proto.outputDirectory = function outputDirectory (directory) {
    return this.out("-output-directory", directory);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-page
  proto.page = function page (width, height, arg) {
    return this.out("-page", width+'x'+height+(arg||''));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-pause
  proto.pause = function pause (seconds) {
    return this.out("-pause", seconds);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-pen
  proto.pen = function pen (color) {
    return this.out("-pen", color);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-ping
  proto.ping = function ping () {
    return this.out("-ping");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-pointsize
  proto.pointSize = function pointSize (value) {
    return this.out("-pointsize", value);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-preview
  proto.preview = function preview (type) {
    return this.out("-preview", type);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-process
  proto.process = function process (command) {
    return this.out("-process", command);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-profile
  proto.profile = function profile (filename) {
    return this.out("-profile", filename);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-progress
  proto.progress = function progress () {
    return this.out("+progress");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-random-threshold
  proto.randomThreshold = function randomThreshold (channeltype, LOWxHIGH) {
    return this.out("-random-threshold", channeltype, LOWxHIGH);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-recolor
  proto.recolor = function recolor (matrix) {
    return this.out("-recolor", matrix);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-red-primary
  proto.redPrimary = function redPrimary (x, y) {
    return this.out("-red-primary", x, y);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-remote
  proto.remote = function remote () {
    return this.out("-remote");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-render
  proto.render = function render () {
    return this.out("-render");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-repage
  proto.repage = function repage (width, height, xoff, yoff, arg) {
    if (arguments[0] === "+") return this.out("+repage");
    return this.out("-repage", width+'x'+height+'+'+xoff+'+'+yoff+(arg||''));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-sample
  proto.sample = function sample (geometry) {
    return this.out("-sample", geometry);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-sampling-factor
  proto.samplingFactor = function samplingFactor (horizontalFactor, verticalFactor) {
    return this.out("-sampling-factor", horizontalFactor+'x'+verticalFactor);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-scene
  proto.scene = function scene (value) {
    return this.out("-scene", value);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-scenes
  proto.scenes = function scenes (start, end) {
    return this.out("-scenes", start+'-'+end);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-screen
  proto.screen = function screen () {
    return this.out("-screen");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-set
  proto.set = function set (attribute, value) {
    return this.out("-set", attribute, value);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-segment
  proto.segment = function segment (clusterThreshold, smoothingThreshold) {
    return this.out("-segment", clusterThreshold+'x'+smoothingThreshold);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-shade
  proto.shade = function shade (azimuth, elevation) {
    return this.out("-shade", azimuth+'x'+elevation);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-shadow
  proto.shadow = function shadow (radius, sigma) {
    return this.out("-shadow", argsToArray(radius, sigma).join('x'));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-shared-memory
  proto.sharedMemory = function sharedMemory () {
    return this.out("-shared-memory");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-shave
  proto.shave = function shave (width, height, percent) {
    return this.out("-shave", width+'x'+height+(percent?'%':''));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-shear
  proto.shear = function shear (xDegrees, yDegreees) {
    return this.out("-shear", xDegrees+'x'+yDegreees);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-silent
  proto.silent = function silent (color) {
    return this.out("-silent");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-size
  proto.rawSize = function rawSize (width, height, offset) {
    var off = 'undefined' != typeof offset
      ? '+' + offset
      : '';
    return this.out("-size", width +'x'+ height + off);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-snaps
  proto.snaps = function snaps (value) {
    return this.out("-snaps", value);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-stegano
  proto.stegano = function stegano (offset) {
    return this.out("-stegano", offset);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-stereo
  proto.stereo = function stereo () {
    return this.out("-stereo");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-text-font
  proto.textFont = function textFont (name) {
    return this.out("-text-font", name);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-texture
  proto.texture = function texture (filename) {
    return this.out("-texture", filename);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-threshold
  proto.threshold = function threshold (value, percent) {
    return this.out("-threshold", value+(percent?'%':''));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-thumbnail
  proto.thumbnail = function thumbnail (w, h, options) {
    options = options || "";
    var geometry,
      wIsValid = Boolean(w || w === 0),
      hIsValid = Boolean(h || h === 0);

    if (wIsValid && hIsValid) {
      geometry = w + "x" + h + options
    } else if (wIsValid) {
      // GraphicsMagick requires <width>x<options>, ImageMagick requires <width><options>
      geometry = (this._options.imageMagick) ? w + options : w +
        'x' + options;
    } else if (hIsValid) {
      geometry = 'x' + h + options
    } else {
      return this
    }

    return this.out("-thumbnail", geometry);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-tile
  proto.tile = function tile (filename) {
    return this.out("-tile", filename);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-title
  proto.title = function title (string) {
    return this.out("-title", string);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-transform
  proto.transform = function transform (color) {
    return this.out("-transform", color);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-transparent
  proto.transparent = function transparent (color) {
    return this.out("-transparent", color);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-treedepth
  proto.treeDepth = function treeDepth (value) {
    return this.out("-treedepth", value);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-update
  proto.update = function update (seconds) {
    return this.out("-update", seconds);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-units
  proto.units = function units (type) {
    return this.out("-units", type);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-unsharp
  proto.unsharp = function unsharp (radius, sigma, amount, threshold) {
    var arg=radius;
    if (typeof sigma != 'undefined') arg+='x'+sigma;
    if (typeof amount != 'undefined') arg+='+'+amount;
    if (typeof threshold != 'undefined') arg+='+'+threshold;
    return this.out("-unsharp", arg);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-use-pixmap
  proto.usePixmap = function usePixmap () {
    return this.out("-use-pixmap");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-view
  proto.view = function view (string) {
    return this.out("-view", string);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-virtual-pixel
  proto.virtualPixel = function virtualPixel (method) {
    return this.out("-virtual-pixel", method);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-visual
  proto.visual = function visual (type) {
    return this.out("-visual", type);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-watermark
  proto.watermark = function watermark (brightness, saturation) {
    return this.out("-watermark", brightness+'x'+saturation);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-wave
  proto.wave = function wave (amplitude, wavelength) {
    return this.out("-wave", amplitude+'x'+wavelength);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-white-point
  proto.whitePoint = function whitePoint (x, y) {
    return this.out("-white-point", x+'x'+y);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-white-threshold
  proto.whiteThreshold = function whiteThreshold (red, green, blue, opacity) {
    return this.out("-white-threshold", argsToArray(red, green, blue, opacity).join(','));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-window
  proto.window = function window (id) {
    return this.out("-window", id);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-window-group
  proto.windowGroup = function windowGroup () {
    return this.out("-window-group");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-strip (graphicsMagick >= 1.3.15)
  proto.strip = function strip () {
    if (this._options.imageMagick) return this.out("-strip");
    return this.noProfile().out("+comment");//Equivalent to "-strip" for all versions of graphicsMagick
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-interlace
  proto.interlace = function interlace (type) {
    return this.out("-interlace", type || "None");
  }

  // force output format
  proto.setFormat = function setFormat (format) {
    if (format) this._outputFormat = format;
    return this;
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-resize
  proto.resize = function resize (w, h, options) {
    options = options || "";
    var geometry,
      wIsValid = Boolean(w || w === 0),
      hIsValid = Boolean(h || h === 0);

    if (wIsValid && hIsValid) {
      geometry = w + "x" + h + options
    } else if (wIsValid) {
      // GraphicsMagick requires <width>x<options>, ImageMagick requires <width><options>
      geometry = (this._options.imageMagick) ? w + options : w +
        'x' + options;
    } else if (hIsValid) {
      geometry = 'x' + h + options
    } else {
      return this
    }

    return this.out("-resize", geometry);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-resize with '!' option
  proto.resizeExact = function resize (w, h) {
    var options = "!";
    return proto.resize.apply(this, [w, h, options]);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-scale
  proto.scale = function scale (w, h, options) {
    options = options || "";
    var geometry;
    if (w && h) {
      geometry = w + "x" + h + options
    } else if (w && !h) {
      geometry = (this._options.imageMagick) ? w + options : w + 'x' + options;
    } else if (!w && h) {
      geometry = 'x' + h + options
    }

    return this.out("-scale", geometry);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-filter
  proto.filter = function filter (val) {
    return this.out("-filter", val);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-density
  proto.density = function density (w, h) {
    if (w && !h && this._options.imageMagick) {
      // GraphicsMagick requires <width>x<height>y, ImageMagick may take dpi<resolution>
      // recommended 300dpi for higher quality
      return this.in("-density", w);
    }
    return this.in("-density", w +"x"+ h);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-profile
  proto.noProfile = function noProfile () {
    this.out('+profile', '"*"');
    return this;
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-resample
  proto.resample = function resample (w, h) {
    return this.out("-resample", w+"x"+h);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-rotate
  proto.rotate = function rotate (color, deg) {
    return this.out("-background", color, "-rotate", String(deg || 0));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-flip
  proto.flip = function flip () {
    return this.out("-flip");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-flop
  proto.flop = function flop () {
    return this.out("-flop");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-crop
  proto.crop = function crop (w, h, x, y, percent) {
    if (this.inputIs('jpg')) {
      // avoid error "geometry does not contain image (unable to crop image)" - gh-17
      var index = this._in.indexOf('-size');
      if (~index) {
        this._in.splice(index, 2);
      }
    }

    return this.out("-crop", w + "x" + h + "+" + (x || 0) + "+" + (y || 0) + (percent ? '%' : ''));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-magnify
  proto.magnify = function magnify (factor) {
    return this.in("-magnify");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html
  proto.minify = function minify () {
    return this.in("-minify")
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-quality
  proto.quality = function quality (val) {
    return this.in("-quality", val || 75);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-blur
  proto.blur = function blur (radius, sigma) {
    return this.out("-blur", radius + (sigma ? "x"+sigma : ""));
  }

  // http://www.graphicsmagick.org/convert.html
  proto.charcoal = function charcoal (factor) {
    return this.out("-charcoal", factor || 2);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-modulate
  proto.modulate = function modulate (b, s, h) {
    return this.out("-modulate", [b,s,h].join(","));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-antialias
  // note: antialiasing is enabled by default
  proto.antialias = function antialias (disable) {
    return false === disable
      ? this.out("+antialias")
      : this;
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-depth
  proto.bitdepth = function bitdepth (val) {
    return this.out("-depth", val);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-colors
  proto.colors = function colors (val) {
    return this.out("-colors", val || 128);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-colorspace
  proto.colorspace = function colorspace (val) {
    return this.out("-colorspace", val);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-comment
  proto.comment = comment("-comment");

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-contrast
  proto.contrast = function contrast (mult) {
    var arg = (parseInt(mult, 10) || 0) > 0
      ? "+contrast"
      : "-contrast";

    mult = Math.abs(mult) || 1;

    while (mult--) {
      this.out(arg);
    }

    return this;
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-cycle
  proto.cycle = function cycle (amount) {
    return this.out("-cycle", amount || 2);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html
  proto.despeckle = function despeckle () {
    return this.out("-despeckle");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-dither
  // note: either colors() or monochrome() must be used for this
  // to take effect.
  proto.dither = function dither (on) {
    var sign = false === on
      ? "+"
      : "-";

    return this.out(sign + "dither");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html
  proto.monochrome = function monochrome () {
    return this.out("-monochrome");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html
  proto.edge = function edge (radius) {
    return this.out("-edge", radius || 1);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html
  proto.emboss = function emboss (radius) {
    return this.out("-emboss", radius || 1);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html
  proto.enhance = function enhance () {
    return this.out("-enhance");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html
  proto.equalize = function equalize () {
    return this.out("-equalize");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-gamma
  proto.gamma = function gamma (r, g, b) {
    return this.out("-gamma", [r,g,b].join());
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html
  proto.implode = function implode (factor) {
    return this.out("-implode", factor || 1);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-comment
  proto.label = comment("-label");

  var limits = [ "disk", "file", "map", "memory", "pixels", "threads"];

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-limit
  proto.limit = function limit (type, val) {
    type = type.toLowerCase();

    if (!~limits.indexOf(type)) {
      return this;
    }

    return this.out("-limit", type, val);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html
  proto.median = function median (radius) {
    return this.out("-median", radius || 1);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-negate
  proto.negative = function negative (grayscale) {
    var sign = grayscale ? "+" : "-";
    return this.out(sign + "negate");
  }

  var noises = [
      "uniform"
    , "gaussian"
    , "multiplicative"
    , "impulse"
    , "laplacian"
    , "poisson"
  ];

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-noise
  proto.noise = function noise (radius) {
    radius = (String(radius)).toLowerCase();

    var sign = ~noises.indexOf(radius)
      ? "+"
      : "-";

    return this.out(sign + "noise", radius);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-paint
  proto.paint = function paint (radius) {
    return this.out("-paint", radius);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-raise
  proto.raise = function raise (w, h) {
    return this.out("-raise", (w||0)+"x"+(h||0));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-raise
  proto.lower = function lower (w, h) {
    return this.out("+raise", (w||0)+"x"+(h||0));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-region
  proto.region = function region (w, h, x, y) {
    w = w || 0;
    h = h || 0;
    x = x || 0;
    y = y || 0;
    return this.out("-region", w + "x" + h + "+" + x + "+" + y);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-roll
  proto.roll = function roll (x, y) {
    x = ((x = parseInt(x, 10) || 0) >= 0 ? "+" : "") + x;
    y = ((y = parseInt(y, 10) || 0) >= 0 ? "+" : "") + y;
    return this.out("-roll", x+y);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-sharpen
  proto.sharpen = function sharpen (radius, sigma) {
    sigma = sigma
      ? "x" + sigma
      : "";

    return this.out("-sharpen", radius + sigma);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-solarize
  proto.solarize = function solarize (factor) {
    return this.out("-solarize", (factor || 1)+"%");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-spread
  proto.spread = function spread (amount) {
    return this.out("-spread", amount || 5);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-swirl
  proto.swirl = function swirl (degrees) {
    return this.out("-swirl", degrees || 180);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-type
  proto.type = function type (type) {
    return this.in("-type", type);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-trim
  proto.trim = function trim () {
    return this.out("-trim");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-extent
  proto.extent = function extent (w, h, options) {
    options = options || "";
    var geometry;
    if (w && h) {
      geometry = w + "x" + h + options
    } else if (w && !h) {
      geometry = (this._options.imageMagick) ? w + options : w + 'x' + options;
    } else if (!w && h) {
      geometry = 'x' + h + options
    }

    return this.out("-extent", geometry);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-gravity
  // Be sure to use gravity BEFORE extent
  proto.gravity = function gravity (type) {
    if (!type || !~gravity.types.indexOf(type)) {
      type = "NorthWest"; // Documented default.
    }

    return this.out("-gravity", type);
  }

  proto.gravity.types = [
      "NorthWest"
    , "North"
    , "NorthEast"
    , "West"
    , "Center"
    , "East"
    , "SouthWest"
    , "South"
    , "SouthEast"
  ];

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-flatten
  proto.flatten = function flatten () {
    return this.out("-flatten");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-background
  proto.background = function background (color) {
    return this.in("-background", color);
  }
};

/**
 * Generates a handler for comments/labels.
 */

function comment (arg) {
  return function (format) {
    format = String(format);

    format = "@" == format.charAt(0)
      ? format.substring(1)
      : format;

    return this.out(arg, '"' + format + '"');
  }
}


/***/ }),

/***/ 8176:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


/**
 * Module dependencies.
 */

var spawn = __nccwpck_require__(2746);
var utils = __nccwpck_require__(538);
var debug = __nccwpck_require__(8237)('gm');
var series = __nccwpck_require__(4375);
var PassThrough = (__nccwpck_require__(2781).PassThrough);

/**
 * Error messaging.
 */

var noBufferConcat = 'gm v1.9.0+ required node v0.8+. Please update your version of node, downgrade gm < 1.9, or do not use `bufferStream`.';

/**
 * Extend proto
 */

module.exports = function (proto) {

  function args (prop) {
    return function args () {
      var len = arguments.length;
      var a = [];
      var i = 0;

      for (; i < len; ++i) {
        a.push(arguments[i]);
      }

      this[prop] = this[prop].concat(a);
      return this;
    }
  }
  
  function streamToUnemptyBuffer(stream, callback) {
    var done = false
    var buffers = []

    stream.on('data', function (data) {
      buffers.push(data)
    })

    stream.on('end', function () {
      var result, err;
      if (done)
        return

      done = true
      result = Buffer.concat(buffers)
      buffers = null
      if (result.length==0)
      {
          err = new Error("Stream yields empty buffer"); 
          callback(err, null);
      } else {
          callback(null, result);
      }
    })

    stream.on('error', function (err) {
      done = true
      buffers = null
      callback(err)
    })
  }

  proto.in = args('_in');
  proto.out = args('_out');

  proto._preprocessor = [];
  proto.preprocessor = args('_preprocessor');

  /**
   * Execute the command and write the image to the specified file name.
   *
   * @param {String} name
   * @param {Function} callback
   * @return {Object} gm
   */

  proto.write = function write (name, callback) {
    if (!callback) callback = name, name = null;

    if ("function" !== typeof callback) {
      throw new TypeError("gm().write() expects a callback function")
    }

    if (!name) {
      return callback(TypeError("gm().write() expects a filename when writing new files"));
    }

    this.outname = name;

    var self = this;
    this._preprocess(function (err) {
      if (err) return callback(err);
      self._spawn(self.args(), true, callback);
    });
  }

  /**
   * Execute the command and return stdin and stderr
   * ReadableStreams providing the image data.
   * If no callback is passed, a "through" stream will be returned,
   * and stdout will be piped through, otherwise the error will be passed.
   *
   * @param {String} format (optional)
   * @param {Function} callback (optional)
   * @return {Stream}
   */

  proto.stream = function stream (format, callback) {
    if (!callback && typeof format === 'function') {
      callback = format;
      format = null;
    }

    var throughStream;

    if ("function" !== typeof callback) {
      throughStream = new PassThrough();
      callback = function (err, stdout, stderr) {
        if (err) throughStream.emit('error', err);
        else stdout.pipe(throughStream);
      }
    }

    if (format) {
      format = format.split('.').pop();
      this.outname = format + ":-";
    }

    var self = this;
    this._preprocess(function (err) {
      if (err) return callback(err);
      return self._spawn(self.args(), false, callback);
    });

    return throughStream || this;
  }

  /**
   * Convenience function for `proto.stream`.
   * Simply returns the buffer instead of the stream.
   *
   * @param {String} format (optional)
   * @param {Function} callback
   * @return {null}
   */

  proto.toBuffer = function toBuffer (format, callback) {
    if (!callback) callback = format, format = null;

    if ("function" !== typeof callback) {
      throw new Error('gm().toBuffer() expects a callback.');
    }

    return this.stream(format, function (err, stdout) {
      if (err) return callback(err);

      streamToUnemptyBuffer(stdout, callback);
    })
  }

  /**
    * Run any preProcessor functions in series. Used by autoOrient.
    *
    * @param {Function} callback
    * @return {Object} gm
    */

  proto._preprocess = function _preprocess (callback) {
    series(this._preprocessor, this, callback);
  }

  /**
    * Execute the command, buffer input and output, return stdout and stderr buffers.
    *
    * @param {String} bin
    * @param {Array} args
    * @param {Function} callback
    * @return {Object} gm
    */

  proto._exec = function _exec (args, callback) {
    return this._spawn(args, true, callback);
  }

  /**
    * Execute the command with stdin, returning stdout and stderr streams or buffers.
    * @param {String} bin
    * @param {Array} args
    * @param {ReadableStream} stream
    * @param {Boolean} shouldBuffer
    * @param {Function} callback, signature (err, stdout, stderr) -> * 
    * @return {Object} gm
    * @TODO refactor this mess
    */

  proto._spawn = function _spawn (args, bufferOutput, callback) {
    var appPath = this._options.appPath || '';
    var bin = this._options.imageMagick
      ? appPath + args.shift()
      : appPath + 'gm'

    var cmd = bin + ' ' + args.map(utils.escape).join(' ')
      , self = this
      , proc, err
      , timeout = parseInt(this._options.timeout)
      , disposers = this._options.disposers
      , timeoutId;

    debug(cmd);
    //imageMagick does not support minify (https://github.com/aheckmann/gm/issues/385)
    if(args.indexOf("-minify") > -1 && this._options.imageMagick){
      err = new Error("imageMagick does not support minify, use -scale or -sample. Alternatively, use graphicsMagick");
      return cb(err);
    }
    try {
      proc = spawn(bin, args);
    } catch (e) {
      return cb(e);
    }
    proc.stdin.once('error', cb);
    
    proc.on('error', function(err){
      if (err.code === 'ENOENT') {
        cb(new Error('Could not execute GraphicsMagick/ImageMagick: '+cmd+" this most likely means the gm/convert binaries can't be found"));
      } else {
        cb(err);
      }
    });

    if (timeout) {
      timeoutId = setTimeout(function(){
        dispose('gm() resulted in a timeout.');
      }, timeout);
    }

    if (disposers) {
      disposers.forEach(function(disposer) {
        disposer.events.forEach(function(event) {
          disposer.emitter.on(event, dispose);
        });
      });
    }

    if (self.sourceBuffer) {
      proc.stdin.write(this.sourceBuffer);
      proc.stdin.end();
    } else if (self.sourceStream) {

      if (!self.sourceStream.readable) {
        err = new Error("gm().stream() or gm().write() with a non-readable stream.");
        return cb(err);
      }

      self.sourceStream.pipe(proc.stdin);

      // bufferStream
      // We convert the input source from a stream to a buffer.
      if (self.bufferStream && !this._buffering) {
        if (!Buffer.concat) {
          throw new Error(noBufferConcat);
        }

        // Incase there are multiple processes in parallel,
        // we only need one
        self._buffering = true;

        streamToUnemptyBuffer(self.sourceStream, function (err, buffer) {
          self.sourceBuffer = buffer;
          self.sourceStream = null; // The stream is now dead
        })
      }
    }

    // for _exec operations (identify() mostly), we also
    // need to buffer the output stream before returning
    if (bufferOutput) {
      var stdout = ''
        , stderr = ''
        , onOut
        , onErr
        , onExit

      proc.stdout.on('data', onOut = function (data) {
        stdout += data;
      });

      proc.stderr.on('data', onErr = function (data) {
        stderr += data;
      });

      proc.on('close', onExit = function (code, signal) {
        if (code !== 0 || signal !== null) {
          err = new Error('Command failed: ' + stderr);
          err.code = code;
          err.signal = signal;
        };
        cb(err, stdout, stderr, cmd);
        stdout = stderr = onOut = onErr = onExit = null;
      });
    } else {
      cb(null, proc.stdout, proc.stderr, cmd);
    }

    return self;

    function cb (err, stdout, stderr, cmd) {
      if (cb.called) return;
      if (timeoutId) clearTimeout(timeoutId);
      cb.called = 1;
      if (args[0] !== 'identify' && bin !== 'identify') {
	self._in = [];
	self._out = [];
      }
      callback.call(self, err, stdout, stderr, cmd);
    }

    function dispose (msg) {
      var message = msg ? msg : 'gm() was disposed';
      err = new Error(message);
      cb(err);
      if (proc.exitCode === null) {
        proc.stdin.pause();
        proc.kill();
      }
    }
  }

  /**
   * Returns arguments to be used in the command.
   *
   * @return {Array}
   */

  proto.args = function args () {
    var outname = this.outname || "-";
  	if (this._outputFormat) outname = this._outputFormat + ':' + outname;

    return [].concat(
        this._subCommand
      , this._in
      , this.src()
      , this._out
      , outname
    ).filter(Boolean); // remove falsey
  }

  /**
   * Adds an img source formatter.
   *
   * `formatters` are passed an array of images which will be
   * used as 'input' images for the command. Useful for methods
   * like `.append()` where multiple source images may be used.
   *
   * @param {Function} formatter
   * @return {gm} this
   */

  proto.addSrcFormatter = function addSrcFormatter (formatter) {
    if ('function' != typeof formatter)
      throw new TypeError('sourceFormatter must be a function');
    this._sourceFormatters || (this._sourceFormatters = []);
    this._sourceFormatters.push(formatter);
    return this;
  }

  /**
   * Applies all _sourceFormatters
   *
   * @return {Array}
   */

  proto.src = function src () {
    var arr = [];
    for (var i = 0; i < this._sourceFormatters.length; ++i) {
      this._sourceFormatters[i].call(this, arr);
    }
    return arr;
  }

  /**
   * Image types.
   */

  var types = {
      'jpg': /\.jpe?g$/i
    , 'png' : /\.png$/i
    , 'gif' : /\.gif$/i
    , 'tiff': /\.tif?f$/i
    , 'bmp' : /(?:\.bmp|\.dib)$/i
    , 'webp': /\.webp$/i
  };

  types.jpeg = types.jpg;
  types.tif = types.tiff;
  types.dib = types.bmp;

  /**
   * Determine the type of source image.
   *
   * @param {String} type
   * @return {Boolean}
   * @example
   *   if (this.inputIs('png')) ...
   */

  proto.inputIs = function inputIs (type) {
    if (!type) return false;

    var rgx = types[type];
    if (!rgx) {
      if ('.' !== type[0]) type = '.' + type;
      rgx = new RegExp('\\' + type + '$', 'i');
    }

    return rgx.test(this.source);
  }

  /**
   * add disposer (like 'close' of http.IncomingMessage) in order to dispose gm() with any event
   *
   * @param {EventEmitter} emitter
   * @param {Array} events
   * @return {Object} gm
   * @example
   *   command.addDisposer(req, ['close', 'end', 'finish']);
   */

  proto.addDisposer = function addDisposer (emitter, events) {
    if (!this._options.disposers) {
      this._options.disposers = [];
    }
    this._options.disposers.push({
      emitter: emitter,
      events: events
    });
    return this;
  };
}


/***/ }),

/***/ 1821:
/***/ ((module, exports, __nccwpck_require__) => {

// compare

var spawn = __nccwpck_require__(2746);

/**
 * Compare two images uses graphicsmagicks `compare` command.
 *
 * gm.compare(img1, img2, 0.4, function (err, equal, equality) {
 *   if (err) return handle(err);
 *   console.log('The images are equal: %s', equal);
 *   console.log('There equality was %d', equality);
 * });
 *
 * @param {String} orig Path to an image.
 * @param {String} compareTo Path to another image to compare to `orig`.
 * @param {Number|Object} [options] Options object or the amount of difference to tolerate before failing - defaults to 0.4
 * @param {Function} cb(err, Boolean, equality, rawOutput)
 */

module.exports = exports = function (proto) {
  function compare(orig, compareTo, options, cb) {

    var isImageMagick = this._options && this._options.imageMagick;
    var appPath = this._options && this._options.appPath || '';
    var bin = isImageMagick
      ? appPath + 'compare' 
      : appPath + 'gm'
    var args = ['-metric', 'mse', orig, compareTo]
    if (!isImageMagick) {
        args.unshift('compare');
    }
    var tolerance = 0.4;
    // outputting the diff image
    if (typeof options === 'object') {

      if (options.highlightColor && options.highlightColor.indexOf('"') < 0) {
        options.highlightColor = '"' + options.highlightColor + '"';
      }

      if (options.file) {
        if (typeof options.file !== 'string') {
          throw new TypeError('The path for the diff output is invalid');
        }
         // graphicsmagick defaults to red
        if (options.highlightColor) {
            args.push('-highlight-color');
            args.push(options.highlightColor);
        }
        if (options.highlightStyle) {
            args.push('-highlight-style')
            args.push(options.highlightStyle)
        }
        // For IM, filename is the last argument. For GM it's `-file <filename>`
        if (!isImageMagick) {
            args.push('-file');
        }
        args.push(options.file);
      }
      
      if (typeof options.tolerance != 'undefined') {
        if (typeof options.tolerance !== 'number') {
          throw new TypeError('The tolerance value should be a number');
        }
        tolerance = options.tolerance;
      } 
    } else {
      // For ImageMagick diff file is required but we don't care about it, so null it out
      if (isImageMagick) {
        args.push('null:');
      }

      if (typeof options == 'function') {
        cb = options; // tolerance value not provided, flip the cb place
      } else {
        tolerance = options
      }
    }

    var proc = spawn(bin, args);
    var stdout = '';
    var stderr = '';
    proc.stdout.on('data',function(data) { stdout+=data });
    proc.stderr.on('data',function(data) { stderr+=data });
    proc.on('close', function (code) {
      // ImageMagick returns err code 2 if err, 0 if similar, 1 if dissimilar
      if (isImageMagick) {
        if (code === 0) {
          return cb(null, 0 <= tolerance, 0, stdout);
        }
        else if (code === 1) {
          err = null;
          stdout = stderr;
        } else {
        return cb(stderr);
        }
      } else {
        if(code !== 0) {
          return cb(stderr);
        }
      }
      // Since ImageMagick similar gives err code 0 and no stdout, there's really no matching
      // Otherwise, output format for IM is `12.00 (0.123)` and for GM it's `Total: 0.123`
      var regex = isImageMagick ? /\((\d+\.?[\d\-\+e]*)\)/m : /Total: (\d+\.?\d*)/m;
      var match = regex.exec(stdout);
      if (!match) {
        err = new Error('Unable to parse output.\nGot ' + stdout);
        return cb(err);
      }

      var equality = parseFloat(match[1]);
      cb(null, equality <= tolerance, equality, stdout, orig, compareTo);
    });
  }

  if (proto) {
    proto.compare = compare;
  }
  return compare;
};



/***/ }),

/***/ 8429:
/***/ ((module, exports) => {

// composite

/**
 * Composite images together using the `composite` command in graphicsmagick.
 *
 * gm('/path/to/image.jpg')
 * .composite('/path/to/second_image.jpg')
 * .geometry('+100+150')
 * .write('/path/to/composite.png', function(err) {
 *   if(!err) console.log("Written composite image.");
 * });
 *
 * @param {String} other  Path to the image that contains the changes.
 * @param {String} [mask] Path to the image with opacity informtion. Grayscale.
 */

module.exports = exports = function(proto) {
    proto.composite = function(other, mask) {
        this.in(other);

        // If the mask is defined, add it to the output.
        if(typeof mask !== "undefined")
            this.out(mask);

        this.subCommand("composite");

        return this;
    }
}


/***/ }),

/***/ 5827:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


/**
 * Extend proto
 */

module.exports = function (proto) {
  __nccwpck_require__(7107)(proto);
  __nccwpck_require__(9810)(proto);
  __nccwpck_require__(6401)(proto);
  __nccwpck_require__(7313)(proto);
}


/***/ }),

/***/ 7313:
/***/ ((module) => {


/**
 * Extend proto.
 */

module.exports = function (proto) {

  var exifTransforms = {
      topleft:     ''
    , topright:    ['-flop']
    , bottomright: ['-rotate', 180]
    , bottomleft:  ['-flip']
    , lefttop:     ['-flip', '-rotate', 90]
    , righttop:    ['-rotate', 90]
    , rightbottom: ['-flop', '-rotate', 90]
    , leftbottom:  ['-rotate', 270]
  }

  proto.autoOrient = function autoOrient () {
    // Always strip EXIF data since we can't
    // change/edit it.

    // imagemagick has a native -auto-orient option
    // so does graphicsmagick, but in 1.3.18.
    // nativeAutoOrient option enables this if you know you have >= 1.3.18
    if (this._options.nativeAutoOrient || this._options.imageMagick) {
      this.out('-auto-orient');
      this.strip();
      return this;
    }

    this.preprocessor(function (callback) {
      this.orientation({bufferStream: true}, function (err, orientation) {
        if (err) return callback(err);

        var transforms = exifTransforms[orientation.toLowerCase()];
        if (transforms) {

          // remove any existing transforms that might conflict
          var index = this._out.indexOf(transforms[0]);
          if (~index) {
            this._out.splice(index, transforms.length);
          }

          // repage to fix coordinates
          this._out.unshift.apply(this._out, transforms.concat('-page', '+0+0'));
        }

        this.strip();

        callback();
      });
    });

    return this;
  }
}


/***/ }),

/***/ 9810:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


/**
 * Module dependencies.
 */

var fs = __nccwpck_require__(7147);
var parallel = __nccwpck_require__(9379);

/**
 * Extend proto.
 */

module.exports = function (proto) {

  /**
   * Do nothing.
   */

  function noop () {}

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-morph
  proto.morph = function morph (other, outname, callback) {
    if (!outname) {
      throw new Error("an output filename is required");
    }

    callback = (callback || noop).bind(this)

    var self = this;

    if (Array.isArray(other)) {
      other.forEach(function (img) {
        self.out(img);
      });
      self.out("-morph", other.length);
    } else {
      self.out(other, "-morph", 1);
    }

    self.write(outname, function (err, stdout, stderr, cmd) {
      if (err) return callback(err, stdout, stderr, cmd);

      // Apparently some platforms create the following temporary files.
      // Check if the output file exists, if it doesn't, then
      // work with temporary files.
      fs.exists(outname, function (exists) {
        if (exists) return callback(null, stdout, stderr, cmd);

        parallel([
          fs.unlink.bind(fs, outname + '.0'),
          fs.unlink.bind(fs, outname + '.2'),
          fs.rename.bind(fs, outname + '.1', outname)
        ], function (err) {
          callback(err, stdout, stderr, cmd);
        })
      })
    });

    return self;
  }
}


/***/ }),

/***/ 6401:
/***/ ((module) => {


/**
 * Extend proto.
 */

module.exports = function (proto) {
  proto.sepia = function sepia () {
    return this.modulate(115, 0, 100).colorize(7, 21, 50);
  }
}


/***/ }),

/***/ 7107:
/***/ ((module) => {


/**
 * Extend proto.
 */

module.exports = function (proto) {

  proto.thumb = function thumb (w, h, name, quality, align, progressive, callback, opts) {
    var self = this,
      args = Array.prototype.slice.call(arguments);

    opts = args.pop();

    if (typeof opts === 'function') {
      callback = opts;
      opts = '';
    } else {
      callback = args.pop();
    }

    w = args.shift();
    h = args.shift();
    name = args.shift();
    quality = args.shift() || 63;
    align = args.shift() || 'topleft';
    var interlace = args.shift() ? 'Line' : 'None';

    self.size(function (err, size) {
      if (err) {
        return callback.apply(self, arguments);
      }

      w = parseInt(w, 10);
      h = parseInt(h, 10);

      var w1, h1;
      var xoffset = 0;
      var yoffset = 0;

      if (size.width < size.height) {
        w1 = w;
        h1 = Math.floor(size.height * (w/size.width));
        if (h1 < h) {
          w1 = Math.floor(w1 * (((h-h1)/h) + 1));
          h1 = h;
        }
      } else if (size.width > size.height) {
        h1 = h;
        w1 = Math.floor(size.width * (h/size.height));
        if (w1 < w) {
          h1 = Math.floor(h1 * (((w-w1)/w) + 1));
          w1 = w;
        }
      } else if (size.width == size.height) {
        var bigger = (w>h?w:h);
        w1 = bigger;
        h1 = bigger;
      }

      if (align == 'center') {
        if (w < w1) {
          xoffset = (w1-w)/2;
        }
        if (h < h1) {
          yoffset = (h1-h)/2;
        }
      }

      self
      .quality(quality)
      .in("-size", w1+"x"+h1)
      .scale(w1, h1, opts)
      .crop(w, h, xoffset, yoffset)
      .interlace(interlace)
      .noProfile()
      .write(name, function () {
        callback.apply(self, arguments);
      });
    });

    return self;
  };

  proto.thumbExact = function () {
    var self = this,
      args = Array.prototype.slice.call(arguments);

    args.push('!');

    self.thumb.apply(self, args);
  };
};


/***/ }),

/***/ 6561:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


/**
 * Module dependencies.
 */

var escape = (__nccwpck_require__(538).escape);

/**
 * Extend proto.
 */

module.exports = function (proto) {

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-fill
  proto.fill = function fill (color) {
    return this.out("-fill", color || "none");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-stroke
  proto.stroke = function stroke (color, width) {
    if (width) {
      this.strokeWidth(width);
    }

    return this.out("-stroke", color || "none");
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-strokewidth
  proto.strokeWidth = function strokeWidth (width) {
    return this.out("-strokewidth", width);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-font
  proto.font = function font (font, size) {
    if (size) {
      this.fontSize(size);
    }

    return this.out("-font", font);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html
  proto.fontSize = function fontSize (size) {
    return this.out("-pointsize", size);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-draw
  proto.draw = function draw (args) {
    return this.out("-draw", [].slice.call(arguments).join(" "));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-draw
  proto.drawPoint = function drawPoint (x, y) {
    return this.draw("point", x +","+ y);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-draw
  proto.drawLine = function drawLine (x0, y0, x1, y1) {
    return this.draw("line", x0+","+y0, x1+","+y1);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-draw
  proto.drawRectangle = function drawRectangle (x0, y0, x1, y1, wc, hc) {
    var shape = "rectangle"
      , lastarg;

    if ("undefined" !== typeof wc) {
      shape = "roundRectangle";

      if ("undefined" === typeof hc) {
        hc = wc;
      }

      lastarg = wc+","+hc;
    }

    return this.draw(shape, x0+","+y0, x1+","+y1, lastarg);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-draw
  proto.drawArc = function drawArc (x0, y0, x1, y1, a0, a1) {
    return this.draw("arc", x0+","+y0, x1+","+y1, a0+","+a1);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-draw
  proto.drawEllipse = function drawEllipse (x0, y0, rx, ry, a0, a1) {
    if (a0 == undefined) a0 = 0;
    if (a1 == undefined) a1 = 360;
    return this.draw("ellipse", x0+","+y0, rx+","+ry, a0+","+a1);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-draw
  proto.drawCircle = function drawCircle (x0, y0, x1, y1) {
    return this.draw("circle", x0+","+y0, x1+","+y1);
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-draw
  proto.drawPolyline = function drawPolyline () {
    return this.draw("polyline", formatPoints(arguments));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-draw
  proto.drawPolygon = function drawPolygon () {
    return this.draw("polygon", formatPoints(arguments));
  }

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-draw
  proto.drawBezier = function drawBezier () {
    return this.draw("bezier", formatPoints(arguments));
  }

  proto._gravities = [
      "northwest"
	  , "north"
    , "northeast"
	  , "west"
    , "center"
	  , "east"
    , "southwest"
    , "south"
    , "southeast"];

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-draw
  proto.drawText = function drawText (x0, y0, text, gravity) {
    var gravity = String(gravity || "").toLowerCase()
      , arg = ["text " + x0 + "," + y0 + " " + escape(text)];

    if (~this._gravities.indexOf(gravity)) {
      arg.unshift("gravity", gravity);
    }

    return this.draw.apply(this, arg);
  }

  proto._drawProps = ["color", "matte"];

  // http://www.graphicsmagick.org/GraphicsMagick.html#details-draw
  proto.setDraw = function setDraw (prop, x, y, method) {
    prop = String(prop || "").toLowerCase();

    if (!~this._drawProps.indexOf(prop)) {
      return this;
    }

    return this.draw(prop, x+","+y, method);
  }

}

function formatPoints (points) {
  var len = points.length
    , result = []
    , i = 0;

  for (; i < len; ++i) {
    result.push(points[i].join(","));
  }

  return result;
}


/***/ }),

/***/ 1057:
/***/ ((module) => {

/**
 * Extend proto.
 */

module.exports = function (gm) {

  var proto = gm.prototype;

  /**
   * `identify` states
   */

  const IDENTIFYING = 1;
  const IDENTIFIED = 2;

  /**
   * Map getter functions to output names.
   *
   * - format: specifying the -format argument (see man gm)
   * - verbose: use -verbose instead of -format (only if necessary b/c its slow)
   * - helper: use the conversion helper
   */

  var map = {
      'format': { key: 'format', format: '%m ', helper: 'Format' }
    , 'depth':  { key: 'depth',  format: '%q' }
    , 'filesize': { key: 'Filesize', format: '%b' }
    , 'size':  { key: 'size', format: '%wx%h ', helper: 'Geometry' }
    , 'color': { key: 'color', format: '%k',  helper: 'Colors' }
    , 'orientation': { key: 'Orientation', format: '%[EXIF:Orientation]', helper: 'Orientation' }
    , 'res':   { key: 'Resolution', verbose: true }
  }

  /**
   * Getter functions
   */

  Object.keys(map).forEach(function (getter) {
    proto[getter] = function (opts, callback) {
      if (!callback) callback = opts, opts = {};
      if (!callback) return this;

      var val = map[getter]
        , key = val.key
        , self = this;

      if (self.data[key]) {
        callback.call(self, null, self.data[key]);
        return self;
      }

      self.on(getter, callback);

      self.bufferStream = !!opts.bufferStream;

      if (val.verbose) {
        self.identify(opts, function (err, stdout, stderr, cmd) {
          if (err) {
            self.emit(getter, err, self.data[key], stdout, stderr, cmd);
          } else {
            self.emit(getter, err, self.data[key]);
          }
        });
        return self;
      }

      var args = makeArgs(self, val);
      self._exec(args, function (err, stdout, stderr, cmd) {
        if (err) {
          self.emit(getter, err, self.data[key], stdout, stderr, cmd);
          return;
        }

        var result = (stdout||'').trim();

        if (val.helper in helper) {
          helper[val.helper](self.data, result);
        } else {
          self.data[key] = result;
        }

        self.emit(getter, err, self.data[key]);
      });

      return self;
    }
  });

  /**
   * identify command
   *
   * Overwrites all internal data with the parsed output
   * which is more accurate than the fast shortcut
   * getters.
   */

  proto.identify = function identify (opts, callback) {
    // identify with pattern
    if (typeof(opts) === 'string') {
      opts = {
        format: opts
      }
    }
    if (!callback) callback = opts, opts = {};
    if (!callback) return this;
    if (opts && opts.format) return identifyPattern.call(this, opts, callback);

    var self = this;

    if (IDENTIFIED === self._identifyState) {
      callback.call(self, null, self.data);
      return self;
    }

    self.on('identify', callback);

    if (IDENTIFYING === self._identifyState) {
      return self;
    }

    self._identifyState = IDENTIFYING;

    self.bufferStream = !!opts.bufferStream;

    var args = makeArgs(self, { verbose: true });

    self._exec(args, function (err, stdout, stderr, cmd) {
      if (err) {
        self.emit('identify', err, self.data, stdout, stderr, cmd);
        return;
      }

      err = parse(stdout, self);

      if (err) {
        self.emit('identify', err, self.data, stdout, stderr, cmd);
        return;
      }

      self.data.path = self.source;

      self.emit('identify', null, self.data);
      self._identifyState = IDENTIFIED;
    });

    return self;
  }


  /**
   * identify with pattern
   *
   * Execute `identify -format` with custom pattern
   */

  function identifyPattern (opts, callback) {
    var self = this;

    self.bufferStream = !!opts.bufferStream;

    var args = makeArgs(self, opts);
    self._exec(args, function (err, stdout, stderr, cmd) {
      if (err) {
        return callback.call(self, err, undefined, stdout, stderr, cmd);
      }

      callback.call(self, err, (stdout||'').trim());
    });

    return self;
  }


  /**
   * Parses `identify` responses.
   *
   * @param {String} stdout
   * @param {Gm} self
   * @return {Error} [optionally]
   */

  function parse (stdout, self) {
    // normalize
    var parts = (stdout||"").trim().replace(/\r\n|\r/g, "\n").split("\n");

    // skip the first line (its just the filename)
    parts.shift();

    try {
      var len = parts.length
        , rgx1 = /^( *)(.+?): (.*)$/ // key: val
        , rgx2 = /^( *)(.+?):$/      // key: begin nested object
        , out = { indent: {} }
        , level = null
        , lastkey
        , i = 0
        , res
        , o

      for (; i < len; ++i) {
        res = rgx1.exec(parts[i]) || rgx2.exec(parts[i]);
        if (!res) continue;

        var indent = res[1].length
          , key = res[2] ? res[2].trim() : '';

        if ('Image' == key || 'Warning' == key) continue;

        var val = res[3] ? res[3].trim() : null;

        // first iteration?
        if (null === level) {
          level = indent;
          o = out.root = out.indent[level] = self.data;
        } else if (indent < level) {
          // outdent
          if (!(indent in out.indent)) {
            continue;
          }
          o = out.indent[indent];
        } else if (indent > level) {
          // dropping into a nested object
          out.indent[level] = o;
          // weird format, key/val pair with nested children. discard the val
          o = o[lastkey] = {};
        }

        level = indent;

        if (val) {
          // if previous key was exist and we got the same key
          // cast it to an array.
          if(o.hasOwnProperty(key)){
            // cast it to an array and dont forget the previous value
            if(!Array.isArray(o[key])){
              var tmp = o[key];
              o[key] = [tmp];
            }

            // set value
            o[key].push(val);
          } else {
            o[key] = val;
          }

          if (key in helper) {
            helper[key](o, val);
          }
        }

        lastkey = key;
      }

    } catch (err) {
      err.message = err.message + "\n\n  Identify stdout:\n  " + stdout;
      return err;
    }
  }

  /**
   * Create an argument array for the identify command.
   *
   * @param {gm} self
   * @param {Object} val
   * @return {Array}
   */

  function makeArgs (self, val) {
    var args = [
        'identify'
      , '-ping'
    ];

    if (val.format) {
      args.push('-format', val.format);
    }

    if (val.verbose) {
      args.push('-verbose');
    }

    args = args.concat(self.src());
    return args;
  }

  /**
   * Map exif orientation codes to orientation names.
   */

  var orientations = {
      '1': 'TopLeft'
    , '2': 'TopRight'
    , '3': 'BottomRight'
    , '4': 'BottomLeft'
    , '5': 'LeftTop'
    , '6': 'RightTop'
    , '7': 'RightBottom'
    , '8': 'LeftBottom'
  }

  /**
   * identify -verbose helpers
   */

  var helper = gm.identifyHelpers = {};

  helper.Geometry = function Geometry (o, val) {
    // We only want the size of the first frame.
    // Each frame is separated by a space.
    var split = val.split(" ").shift().split("x");
    var width = parseInt(split[0], 10);
    var height = parseInt(split[1], 10);
    if (o.size && o.size.width && o.size.height) {
      if (width > o.size.width) o.size.width = width;
      if (height > o.size.height) o.size.height = height;
    } else {
      o.size = {
        width:  width,
        height: height
      }
    }
  };

  helper.Format = function Format (o, val) {
    o.format = val.split(" ")[0];
  };

  helper.Depth = function Depth (o, val) {
    o.depth = parseInt(val, 10);
  };

  helper.Colors = function Colors (o, val) {
    o.color = parseInt(val, 10);
  };

  helper.Orientation = function Orientation (o, val) {
    if (val in orientations) {
      o['Profile-EXIF'] || (o['Profile-EXIF'] = {});
      o['Profile-EXIF'].Orientation = val;
      o.Orientation = orientations[val];
    } else {
      o.Orientation = val || 'Unknown';
    }
  };
}



/***/ }),

/***/ 239:
/***/ ((module, exports) => {

// montage

/**
 * Montage images next to each other using the `montage` command in graphicsmagick.
 *
 * gm('/path/to/image.jpg')
 * .montage('/path/to/second_image.jpg')
 * .geometry('+100+150')
 * .write('/path/to/montage.png', function(err) {
 *   if(!err) console.log("Written montage image.");
 * });
 *
 * @param {String} other  Path to the image that contains the changes.
 */

module.exports = exports = function(proto) {
    proto.montage = function(other) {
        this.in(other);

        this.subCommand("montage");

        return this;
    }
}


/***/ }),

/***/ 8179:
/***/ ((module, exports) => {


module.exports = exports = function (proto) {
  proto._options = {};

  proto.options = function setOptions (options) {
    var keys = Object.keys(options)
      , i = keys.length
      , key

    while (i--) {
      key = keys[i];
      this._options[key] = options[key];
    }

    return this;
  }
}


/***/ }),

/***/ 538:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Escape the given shell `arg`.
 *
 * @param {String} arg
 * @return {String}
 * @api public
 */

exports.escape = function escape (arg) {
  return '"' + String(arg).trim().replace(/"/g, '\\"') + '"';
};

exports.unescape = function escape (arg) {
    return String(arg).trim().replace(/"/g, "");
};

exports.argsToArray = function (args) {
  var arr = [];

  for (var i = 0; i <= arguments.length; i++) {
    if ('undefined' != typeof arguments[i])
      arr.push(arguments[i]);
  }

  return arr;
};

exports.isUtil = function (v) {
	var ty = 'object';
	switch (Object.prototype.toString.call(v)) {
	case '[object String]':
		ty = 'String';
		break;
	case '[object Array]':
		ty = 'Array';
		break;
	case '[object Boolean]':
		ty = 'Boolean';
		break;
	}
	return ty;
}

/***/ }),

/***/ 1621:
/***/ ((module) => {

"use strict";


module.exports = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ }),

/***/ 7126:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var fs = __nccwpck_require__(7147)
var core
if (process.platform === 'win32' || global.TESTING_WINDOWS) {
  core = __nccwpck_require__(2001)
} else {
  core = __nccwpck_require__(9728)
}

module.exports = isexe
isexe.sync = sync

function isexe (path, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {
        if (er) {
          reject(er)
        } else {
          resolve(is)
        }
      })
    })
  }

  core(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null
        is = false
      }
    }
    cb(er, is)
  })
}

function sync (path, options) {
  // my kingdom for a filtered catch
  try {
    return core.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}


/***/ }),

/***/ 9728:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = isexe
isexe.sync = sync

var fs = __nccwpck_require__(7147)

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), options)
}

function checkStat (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode
  var uid = stat.uid
  var gid = stat.gid

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid()
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid()

  var u = parseInt('100', 8)
  var g = parseInt('010', 8)
  var o = parseInt('001', 8)
  var ug = u | g

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0

  return ret
}


/***/ }),

/***/ 2001:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = isexe
isexe.sync = sync

var fs = __nccwpck_require__(7147)

function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';')
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase()
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, path, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), path, options)
}


/***/ }),

/***/ 7129:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = LRUCache

// This will be a proper iterable 'Map' in engines that support it,
// or a fakey-fake PseudoMap in older versions.
var Map = __nccwpck_require__(3541)
var util = __nccwpck_require__(3837)

// A linked list to keep track of recently-used-ness
var Yallist = __nccwpck_require__(665)

// use symbols if possible, otherwise just _props
var hasSymbol = typeof Symbol === 'function' && process.env._nodeLRUCacheForceNoSymbol !== '1'
var makeSymbol
if (hasSymbol) {
  makeSymbol = function (key) {
    return Symbol(key)
  }
} else {
  makeSymbol = function (key) {
    return '_' + key
  }
}

var MAX = makeSymbol('max')
var LENGTH = makeSymbol('length')
var LENGTH_CALCULATOR = makeSymbol('lengthCalculator')
var ALLOW_STALE = makeSymbol('allowStale')
var MAX_AGE = makeSymbol('maxAge')
var DISPOSE = makeSymbol('dispose')
var NO_DISPOSE_ON_SET = makeSymbol('noDisposeOnSet')
var LRU_LIST = makeSymbol('lruList')
var CACHE = makeSymbol('cache')

function naiveLength () { return 1 }

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
function LRUCache (options) {
  if (!(this instanceof LRUCache)) {
    return new LRUCache(options)
  }

  if (typeof options === 'number') {
    options = { max: options }
  }

  if (!options) {
    options = {}
  }

  var max = this[MAX] = options.max
  // Kind of weird to have a default max of Infinity, but oh well.
  if (!max ||
      !(typeof max === 'number') ||
      max <= 0) {
    this[MAX] = Infinity
  }

  var lc = options.length || naiveLength
  if (typeof lc !== 'function') {
    lc = naiveLength
  }
  this[LENGTH_CALCULATOR] = lc

  this[ALLOW_STALE] = options.stale || false
  this[MAX_AGE] = options.maxAge || 0
  this[DISPOSE] = options.dispose
  this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false
  this.reset()
}

// resize the cache when the max changes.
Object.defineProperty(LRUCache.prototype, 'max', {
  set: function (mL) {
    if (!mL || !(typeof mL === 'number') || mL <= 0) {
      mL = Infinity
    }
    this[MAX] = mL
    trim(this)
  },
  get: function () {
    return this[MAX]
  },
  enumerable: true
})

Object.defineProperty(LRUCache.prototype, 'allowStale', {
  set: function (allowStale) {
    this[ALLOW_STALE] = !!allowStale
  },
  get: function () {
    return this[ALLOW_STALE]
  },
  enumerable: true
})

Object.defineProperty(LRUCache.prototype, 'maxAge', {
  set: function (mA) {
    if (!mA || !(typeof mA === 'number') || mA < 0) {
      mA = 0
    }
    this[MAX_AGE] = mA
    trim(this)
  },
  get: function () {
    return this[MAX_AGE]
  },
  enumerable: true
})

// resize the cache when the lengthCalculator changes.
Object.defineProperty(LRUCache.prototype, 'lengthCalculator', {
  set: function (lC) {
    if (typeof lC !== 'function') {
      lC = naiveLength
    }
    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC
      this[LENGTH] = 0
      this[LRU_LIST].forEach(function (hit) {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key)
        this[LENGTH] += hit.length
      }, this)
    }
    trim(this)
  },
  get: function () { return this[LENGTH_CALCULATOR] },
  enumerable: true
})

Object.defineProperty(LRUCache.prototype, 'length', {
  get: function () { return this[LENGTH] },
  enumerable: true
})

Object.defineProperty(LRUCache.prototype, 'itemCount', {
  get: function () { return this[LRU_LIST].length },
  enumerable: true
})

LRUCache.prototype.rforEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this[LRU_LIST].tail; walker !== null;) {
    var prev = walker.prev
    forEachStep(this, fn, walker, thisp)
    walker = prev
  }
}

function forEachStep (self, fn, node, thisp) {
  var hit = node.value
  if (isStale(self, hit)) {
    del(self, node)
    if (!self[ALLOW_STALE]) {
      hit = undefined
    }
  }
  if (hit) {
    fn.call(thisp, hit.value, hit.key, self)
  }
}

LRUCache.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this[LRU_LIST].head; walker !== null;) {
    var next = walker.next
    forEachStep(this, fn, walker, thisp)
    walker = next
  }
}

LRUCache.prototype.keys = function () {
  return this[LRU_LIST].toArray().map(function (k) {
    return k.key
  }, this)
}

LRUCache.prototype.values = function () {
  return this[LRU_LIST].toArray().map(function (k) {
    return k.value
  }, this)
}

LRUCache.prototype.reset = function () {
  if (this[DISPOSE] &&
      this[LRU_LIST] &&
      this[LRU_LIST].length) {
    this[LRU_LIST].forEach(function (hit) {
      this[DISPOSE](hit.key, hit.value)
    }, this)
  }

  this[CACHE] = new Map() // hash of items by key
  this[LRU_LIST] = new Yallist() // list of items in order of use recency
  this[LENGTH] = 0 // length of items in the list
}

LRUCache.prototype.dump = function () {
  return this[LRU_LIST].map(function (hit) {
    if (!isStale(this, hit)) {
      return {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }
    }
  }, this).toArray().filter(function (h) {
    return h
  })
}

LRUCache.prototype.dumpLru = function () {
  return this[LRU_LIST]
}

/* istanbul ignore next */
LRUCache.prototype.inspect = function (n, opts) {
  var str = 'LRUCache {'
  var extras = false

  var as = this[ALLOW_STALE]
  if (as) {
    str += '\n  allowStale: true'
    extras = true
  }

  var max = this[MAX]
  if (max && max !== Infinity) {
    if (extras) {
      str += ','
    }
    str += '\n  max: ' + util.inspect(max, opts)
    extras = true
  }

  var maxAge = this[MAX_AGE]
  if (maxAge) {
    if (extras) {
      str += ','
    }
    str += '\n  maxAge: ' + util.inspect(maxAge, opts)
    extras = true
  }

  var lc = this[LENGTH_CALCULATOR]
  if (lc && lc !== naiveLength) {
    if (extras) {
      str += ','
    }
    str += '\n  length: ' + util.inspect(this[LENGTH], opts)
    extras = true
  }

  var didFirst = false
  this[LRU_LIST].forEach(function (item) {
    if (didFirst) {
      str += ',\n  '
    } else {
      if (extras) {
        str += ',\n'
      }
      didFirst = true
      str += '\n  '
    }
    var key = util.inspect(item.key).split('\n').join('\n  ')
    var val = { value: item.value }
    if (item.maxAge !== maxAge) {
      val.maxAge = item.maxAge
    }
    if (lc !== naiveLength) {
      val.length = item.length
    }
    if (isStale(this, item)) {
      val.stale = true
    }

    val = util.inspect(val, opts).split('\n').join('\n  ')
    str += key + ' => ' + val
  })

  if (didFirst || extras) {
    str += '\n'
  }
  str += '}'

  return str
}

LRUCache.prototype.set = function (key, value, maxAge) {
  maxAge = maxAge || this[MAX_AGE]

  var now = maxAge ? Date.now() : 0
  var len = this[LENGTH_CALCULATOR](value, key)

  if (this[CACHE].has(key)) {
    if (len > this[MAX]) {
      del(this, this[CACHE].get(key))
      return false
    }

    var node = this[CACHE].get(key)
    var item = node.value

    // dispose of the old one before overwriting
    // split out into 2 ifs for better coverage tracking
    if (this[DISPOSE]) {
      if (!this[NO_DISPOSE_ON_SET]) {
        this[DISPOSE](key, item.value)
      }
    }

    item.now = now
    item.maxAge = maxAge
    item.value = value
    this[LENGTH] += len - item.length
    item.length = len
    this.get(key)
    trim(this)
    return true
  }

  var hit = new Entry(key, value, len, now, maxAge)

  // oversized objects fall out of cache automatically.
  if (hit.length > this[MAX]) {
    if (this[DISPOSE]) {
      this[DISPOSE](key, value)
    }
    return false
  }

  this[LENGTH] += hit.length
  this[LRU_LIST].unshift(hit)
  this[CACHE].set(key, this[LRU_LIST].head)
  trim(this)
  return true
}

LRUCache.prototype.has = function (key) {
  if (!this[CACHE].has(key)) return false
  var hit = this[CACHE].get(key).value
  if (isStale(this, hit)) {
    return false
  }
  return true
}

LRUCache.prototype.get = function (key) {
  return get(this, key, true)
}

LRUCache.prototype.peek = function (key) {
  return get(this, key, false)
}

LRUCache.prototype.pop = function () {
  var node = this[LRU_LIST].tail
  if (!node) return null
  del(this, node)
  return node.value
}

LRUCache.prototype.del = function (key) {
  del(this, this[CACHE].get(key))
}

LRUCache.prototype.load = function (arr) {
  // reset the cache
  this.reset()

  var now = Date.now()
  // A previous serialized cache has the most recent items first
  for (var l = arr.length - 1; l >= 0; l--) {
    var hit = arr[l]
    var expiresAt = hit.e || 0
    if (expiresAt === 0) {
      // the item was created without expiration in a non aged cache
      this.set(hit.k, hit.v)
    } else {
      var maxAge = expiresAt - now
      // dont add already expired items
      if (maxAge > 0) {
        this.set(hit.k, hit.v, maxAge)
      }
    }
  }
}

LRUCache.prototype.prune = function () {
  var self = this
  this[CACHE].forEach(function (value, key) {
    get(self, key, false)
  })
}

function get (self, key, doUse) {
  var node = self[CACHE].get(key)
  if (node) {
    var hit = node.value
    if (isStale(self, hit)) {
      del(self, node)
      if (!self[ALLOW_STALE]) hit = undefined
    } else {
      if (doUse) {
        self[LRU_LIST].unshiftNode(node)
      }
    }
    if (hit) hit = hit.value
  }
  return hit
}

function isStale (self, hit) {
  if (!hit || (!hit.maxAge && !self[MAX_AGE])) {
    return false
  }
  var stale = false
  var diff = Date.now() - hit.now
  if (hit.maxAge) {
    stale = diff > hit.maxAge
  } else {
    stale = self[MAX_AGE] && (diff > self[MAX_AGE])
  }
  return stale
}

function trim (self) {
  if (self[LENGTH] > self[MAX]) {
    for (var walker = self[LRU_LIST].tail;
      self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      var prev = walker.prev
      del(self, walker)
      walker = prev
    }
  }
}

function del (self, node) {
  if (node) {
    var hit = node.value
    if (self[DISPOSE]) {
      self[DISPOSE](hit.key, hit.value)
    }
    self[LENGTH] -= hit.length
    self[CACHE].delete(hit.key)
    self[LRU_LIST].removeNode(node)
  }
}

// classy, since V8 prefers predictable objects.
function Entry (key, value, length, now, maxAge) {
  this.key = key
  this.value = value
  this.length = length
  this.now = now
  this.maxAge = maxAge || 0
}


/***/ }),

/***/ 7612:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

let fs = __nccwpck_require__(7147)
let gm = __nccwpck_require__(2442)

module.exports = function(options, callback) {

  // Check if image option is set
  if(!('image' in options)) {
    return callback(new Error('options.image is required'), null)
  }

  fs.exists(options.image, (exists) => {

    // If file does not exist return error
    if(!exists) {
      return callback(new Error('File does not exist: ' + options.image), null)
    }

    // Check to see if output file is set
    if(!('outfile' in options)) {
      return callback(new Error('options.outfile is required'), null);
    }

    // Check if topText or bottomText is set
    if(!('topText' in options) && !('bottomText' in options)) {
      return callback(new Error('options.topText or options.bottomText is required'), null)
    }

    // Create new graphicsmagick instance
    let img = gm(options.image)

    // Set some defaults
    const TOP_TEXT = 'topText' in options ? options.topText : ''
    const BOTTOM_TEXT = 'bottomText' in options ? options.bottomText : ''
    const FONT = 'font' in options ? options.font : __nccwpck_require__.ab + "impact.ttf"
    const FONT_SIZE = 'fontSize' in options ? options.fontSize : 50
    const FONT_FILL = 'fontFill' in options ? options.fontFill : '#FFF'
    const TEXT_POS = 'textPos' in options ? options.textPos : 'center'
    const STROKE_COLOR = 'strokeColor' in options ? options.strokeColor : '#000'
    const STROKE_WEIGHT = 'strokeWeight' in options ? options.strokeWeight : 2
    const PADDING = 'padding' in options ? options.padding : 40

    // Get the image size to calculate top and bottom text positions
    img.size(function(err, dimensions) {
console.log(err)
      // Set text position for top and bottom
      const TOP_POS = Math.abs((dimensions.height / 2) - PADDING) * -1
      const BOTTOM_POS = (dimensions.height / 2) - PADDING

      // Write text on image using graphicsmagick
      img.font(FONT, FONT_SIZE)
         .fill(FONT_FILL)
         .stroke(STROKE_COLOR, STROKE_WEIGHT)
         .drawText(0, TOP_POS, TOP_TEXT, TEXT_POS)
         .drawText(0, BOTTOM_POS, BOTTOM_TEXT, TEXT_POS)
         .write(options.outfile, function(err) {
           if (err) return callback(new Error('Failed to save meme: ' + err), null)
           return callback(null)
         })
    })
  })
}


/***/ }),

/***/ 900:
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ 3541:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

if (process.env.npm_package_name === 'pseudomap' &&
    process.env.npm_lifecycle_script === 'test')
  process.env.TEST_PSEUDOMAP = 'true'

if (typeof Map === 'function' && !process.env.TEST_PSEUDOMAP) {
  module.exports = Map
} else {
  module.exports = __nccwpck_require__(7967)
}


/***/ }),

/***/ 7967:
/***/ ((module) => {

var hasOwnProperty = Object.prototype.hasOwnProperty

module.exports = PseudoMap

function PseudoMap (set) {
  if (!(this instanceof PseudoMap)) // whyyyyyyy
    throw new TypeError("Constructor PseudoMap requires 'new'")

  this.clear()

  if (set) {
    if ((set instanceof PseudoMap) ||
        (typeof Map === 'function' && set instanceof Map))
      set.forEach(function (value, key) {
        this.set(key, value)
      }, this)
    else if (Array.isArray(set))
      set.forEach(function (kv) {
        this.set(kv[0], kv[1])
      }, this)
    else
      throw new TypeError('invalid argument')
  }
}

PseudoMap.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  Object.keys(this._data).forEach(function (k) {
    if (k !== 'size')
      fn.call(thisp, this._data[k].value, this._data[k].key)
  }, this)
}

PseudoMap.prototype.has = function (k) {
  return !!find(this._data, k)
}

PseudoMap.prototype.get = function (k) {
  var res = find(this._data, k)
  return res && res.value
}

PseudoMap.prototype.set = function (k, v) {
  set(this._data, k, v)
}

PseudoMap.prototype.delete = function (k) {
  var res = find(this._data, k)
  if (res) {
    delete this._data[res._index]
    this._data.size--
  }
}

PseudoMap.prototype.clear = function () {
  var data = Object.create(null)
  data.size = 0

  Object.defineProperty(this, '_data', {
    value: data,
    enumerable: false,
    configurable: true,
    writable: false
  })
}

Object.defineProperty(PseudoMap.prototype, 'size', {
  get: function () {
    return this._data.size
  },
  set: function (n) {},
  enumerable: true,
  configurable: true
})

PseudoMap.prototype.values =
PseudoMap.prototype.keys =
PseudoMap.prototype.entries = function () {
  throw new Error('iterators are not implemented in this version')
}

// Either identical, or both NaN
function same (a, b) {
  return a === b || a !== a && b !== b
}

function Entry (k, v, i) {
  this.key = k
  this.value = v
  this._index = i
}

function find (data, k) {
  for (var i = 0, s = '_' + k, key = s;
       hasOwnProperty.call(data, key);
       key = s + i++) {
    if (same(data[key].key, k))
      return data[key]
  }
}

function set (data, k, v) {
  for (var i = 0, s = '_' + k, key = s;
       hasOwnProperty.call(data, key);
       key = s + i++) {
    if (same(data[key].key, k)) {
      data[key].value = v
      return
    }
  }
  data.size++
  data[key] = new Entry(k, v, key)
}


/***/ }),

/***/ 9318:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const os = __nccwpck_require__(2037);
const tty = __nccwpck_require__(6224);
const hasFlag = __nccwpck_require__(1621);

const {env} = process;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	forceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = 1;
}

if ('FORCE_COLOR' in env) {
	if (env.FORCE_COLOR === 'true') {
		forceColor = 1;
	} else if (env.FORCE_COLOR === 'false') {
		forceColor = 0;
	} else {
		forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, streamIsTTY) {
	if (forceColor === 0) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream, stream && stream.isTTY);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: translateLevel(supportsColor(true, tty.isatty(1))),
	stderr: translateLevel(supportsColor(true, tty.isatty(2)))
};


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 4207:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = which
which.sync = whichSync

var isWindows = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys'

var path = __nccwpck_require__(1017)
var COLON = isWindows ? ';' : ':'
var isexe = __nccwpck_require__(7126)

function getNotFoundError (cmd) {
  var er = new Error('not found: ' + cmd)
  er.code = 'ENOENT'

  return er
}

function getPathInfo (cmd, opt) {
  var colon = opt.colon || COLON
  var pathEnv = opt.path || process.env.PATH || ''
  var pathExt = ['']

  pathEnv = pathEnv.split(colon)

  var pathExtExe = ''
  if (isWindows) {
    pathEnv.unshift(process.cwd())
    pathExtExe = (opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM')
    pathExt = pathExtExe.split(colon)


    // Always test the cmd itself first.  isexe will check to make sure
    // it's found in the pathExt set.
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('')
  }

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  if (cmd.match(/\//) || isWindows && cmd.match(/\\/))
    pathEnv = ['']

  return {
    env: pathEnv,
    ext: pathExt,
    extExe: pathExtExe
  }
}

function which (cmd, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }

  var info = getPathInfo(cmd, opt)
  var pathEnv = info.env
  var pathExt = info.ext
  var pathExtExe = info.extExe
  var found = []

  ;(function F (i, l) {
    if (i === l) {
      if (opt.all && found.length)
        return cb(null, found)
      else
        return cb(getNotFoundError(cmd))
    }

    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
      pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && (/^\.[\\\/]/).test(cmd)) {
      p = cmd.slice(0, 2) + p
    }
    ;(function E (ii, ll) {
      if (ii === ll) return F(i + 1, l)
      var ext = pathExt[ii]
      isexe(p + ext, { pathExt: pathExtExe }, function (er, is) {
        if (!er && is) {
          if (opt.all)
            found.push(p + ext)
          else
            return cb(null, p + ext)
        }
        return E(ii + 1, ll)
      })
    })(0, pathExt.length)
  })(0, pathEnv.length)
}

function whichSync (cmd, opt) {
  opt = opt || {}

  var info = getPathInfo(cmd, opt)
  var pathEnv = info.env
  var pathExt = info.ext
  var pathExtExe = info.extExe
  var found = []

  for (var i = 0, l = pathEnv.length; i < l; i ++) {
    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
      pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && /^\.[\\\/]/.test(cmd)) {
      p = cmd.slice(0, 2) + p
    }
    for (var j = 0, ll = pathExt.length; j < ll; j ++) {
      var cur = p + pathExt[j]
      var is
      try {
        is = isexe.sync(cur, { pathExt: pathExtExe })
        if (is) {
          if (opt.all)
            found.push(cur)
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
}


/***/ }),

/***/ 665:
/***/ ((module) => {

module.exports = Yallist

Yallist.Node = Node
Yallist.create = Yallist

function Yallist (list) {
  var self = this
  if (!(self instanceof Yallist)) {
    self = new Yallist()
  }

  self.tail = null
  self.head = null
  self.length = 0

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item)
    })
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i])
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next
  var prev = node.prev

  if (next) {
    next.prev = prev
  }

  if (prev) {
    prev.next = next
  }

  if (node === this.head) {
    this.head = next
  }
  if (node === this.tail) {
    this.tail = prev
  }

  node.list.length--
  node.next = null
  node.prev = null
  node.list = null
}

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var head = this.head
  node.list = this
  node.next = head
  if (head) {
    head.prev = node
  }

  this.head = node
  if (!this.tail) {
    this.tail = node
  }
  this.length++
}

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var tail = this.tail
  node.list = this
  node.prev = tail
  if (tail) {
    tail.next = node
  }

  this.tail = node
  if (!this.head) {
    this.head = node
  }
  this.length++
}

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value
  this.tail = this.tail.prev
  if (this.tail) {
    this.tail.next = null
  } else {
    this.head = null
  }
  this.length--
  return res
}

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value
  this.head = this.head.next
  if (this.head) {
    this.head.prev = null
  } else {
    this.tail = null
  }
  this.length--
  return res
}

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.next
  }
}

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.prev
  }
}

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.next
  }
  return res
}

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.prev
  }
  return res
}

Yallist.prototype.reduce = function (fn, initial) {
  var acc
  var walker = this.head
  if (arguments.length > 1) {
    acc = initial
  } else if (this.head) {
    walker = this.head.next
    acc = this.head.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i)
    walker = walker.next
  }

  return acc
}

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc
  var walker = this.tail
  if (arguments.length > 1) {
    acc = initial
  } else if (this.tail) {
    walker = this.tail.prev
    acc = this.tail.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i)
    walker = walker.prev
  }

  return acc
}

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.next
  }
  return arr
}

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.prev
  }
  return arr
}

Yallist.prototype.slice = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.reverse = function () {
  var head = this.head
  var tail = this.tail
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev
    walker.prev = walker.next
    walker.next = p
  }
  this.head = tail
  this.tail = head
  return this
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self)
  if (!self.head) {
    self.head = self.tail
  }
  self.length++
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self)
  if (!self.tail) {
    self.tail = self.head
  }
  self.length++
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list
  this.value = value

  if (prev) {
    prev.next = this
    this.prev = prev
  } else {
    this.prev = null
  }

  if (next) {
    next.prev = this
    this.next = next
  } else {
    this.next = null
  }
}


/***/ }),

/***/ 5500:
/***/ ((module) => {

module.exports = eval("require")("spawn-sync");


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 2081:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 2781:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 6224:
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 1600:
/***/ ((module) => {

"use strict";
module.exports = {"version":"1.23.1"};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const util = __nccwpck_require__(3837);
const core = __nccwpck_require__(2186);
//const core = {getInput(){return '';},setOutput() {}}
const memeMaker = util.promisify(__nccwpck_require__(7612));

let fposit = core.getInput('frase_positiva')+'';
let fnegat = core.getInput('frase_negativa')+'';
const result = core.getInput('resultado_tests')+'';

function splitFrase(f) {
  if (f.indexOf(' y ') !== -1) {
    f = f.split(' y ');
    f[1] = ' y ' + f[1];
  } else {
    f = [f];
  }

  return f;
}

async function makeMeme() {
  const ok = result === 'success';
  fposit = splitFrase(fposit);
  fnegat = splitFrase(fnegat);

  try {
    await memeMaker({
      image: 'res/meme-template.png',
      outfile: 'res/meme.png',
      topText: ok ? fposit[0] : fnegat[0],
      bottomText: (ok ? fposit : fnegat)[1] || '',
      font: 'res/impact.ttf'
    });
  } catch (e) {
    console.error('Error:', e);
    core.setOutput('result', "Meme NO Añadido al Readme");
    process.exit(1);
  }

  core.setOutput('result', "Meme Añadido al Readme");
}

makeMeme();

})();

module.exports = __webpack_exports__;
/******/ })()
;