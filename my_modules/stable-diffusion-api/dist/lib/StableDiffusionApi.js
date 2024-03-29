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
exports.StableDiffusionApi = void 0;
const axios_1 = __importDefault(require("axios"));
const string_similarity_1 = __importDefault(require("string-similarity"));
const StableDiffusionResult_1 = __importDefault(require("./StableDiffusionResult"));
const ControlNetApi_1 = require("./ControlNetApi");
const base64_1 = require("../utils/base64");
const createScriptsWithCnUnits = (initScripts, controlNetUnit) => __awaiter(void 0, void 0, void 0, function* () {
    const promises = controlNetUnit.map((unit) => __awaiter(void 0, void 0, void 0, function* () { return yield unit.toJson(); }));
    const args = yield Promise.all(promises);
    const ControlNet = { args };
    const scripts = Object.assign(Object.assign({}, initScripts), { ControlNet });
    return scripts;
});
/**
 * @class StableDiffusionApi
 * @classdesc Stable Diffusion API, a translation layer for [Automatic1111's Stable Diffusion API](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
 * @param {StableDiffusionApiConfig} config - Configuration object
 * @property {StableDiffusionApiConfig} config - Configuration object
 * @property {axios.AxiosInstance} api - Axios instance
 * @property {ControlNetApi} controlNet - ControlNet API
 * @example
 * const api = new StableDiffusionApi()
 * const result = await api.txt2img({
 *   prompt: "A computer that has more brain power than a human being",
 *   batch_size: 2,
 * })
 *
 * // Save the first image
 * result.image.toFile("result.png")
 *
 * // Save all images
 * result.images.forEach((image, i) => {
 *   image.toFile(`result_${i}.png`)
 * })
 */
class StableDiffusionApi {
    constructor({ host = "127.0.0.1", port = 7860, protocol = "http", timeout = 30000, baseUrl = null, defaultSampler = "Euler a", defaultStepCount = 20, } = {}) {
        this.ControlNet = new ControlNetApi_1.ControlNetApi(this);
        const baseURL = baseUrl || `${protocol}://${host}${port ? `:${port}` : ""}`;
        this.config = {
            host,
            port,
            protocol,
            timeout,
            baseUrl,
            defaultSampler,
            defaultStepCount,
        };
        this.api = axios_1.default.create({
            baseURL,
            timeout,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    /**
     * Set the authentication for the axios API
     * @param {string} username
     * @param {string} password
     * @returns {StableDiffusionApi} this StableDiffusionApi instance
     */
    setAuth(username, password) {
        this.api.defaults.auth = {
            username,
            password,
        };
        return this;
    }
    /**
     * Stable Diffusion txt2img call
     * @param {Txt2ImgOptions} options
     * @returns {Promise<StableDiffusionResult>} ApiResult containing the generated image(s)
     * @memberof StableDiffusionApi
     * @async
     * @example
     * const api = new StableDiffusionApi();
     * const result = await api.txt2img({
     *   prompt: "An angry artist that claims that the Stable Diffusion model contains an exact copy of their artwork",
     * });
     */
    txt2img(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16;
        return __awaiter(this, void 0, void 0, function* () {
            const alwayson_scripts = yield createScriptsWithCnUnits(options.alwayson_scripts, (_a = options.controlnet_units) !== null && _a !== void 0 ? _a : []);
            const response = yield this.api.post("/sdapi/v1/txt2img", {
                enable_hr: (_b = options.enable_hr) !== null && _b !== void 0 ? _b : false,
                hr_scale: (_c = options.hr_scale) !== null && _c !== void 0 ? _c : 2,
                hr_upscaler: (_d = options.hr_upscaler) !== null && _d !== void 0 ? _d : "Latent",
                hr_second_pass_steps: (_e = options.hr_second_pass_steps) !== null && _e !== void 0 ? _e : 0,
                hr_resize_x: (_f = options.hr_resize_x) !== null && _f !== void 0 ? _f : 0,
                hr_resize_y: (_g = options.hr_resize_y) !== null && _g !== void 0 ? _g : 0,
                denoising_strength: (_h = options.denoising_strength) !== null && _h !== void 0 ? _h : 0.7,
                firstphase_width: (_j = options.firstphase_width) !== null && _j !== void 0 ? _j : 0,
                firstphase_height: (_k = options.firstphase_height) !== null && _k !== void 0 ? _k : 0,
                prompt: (_l = options.prompt) !== null && _l !== void 0 ? _l : "",
                styles: (_m = options.styles) !== null && _m !== void 0 ? _m : [],
                seed: (_o = options.seed) !== null && _o !== void 0 ? _o : -1,
                subseed: (_p = options.subseed) !== null && _p !== void 0 ? _p : -1,
                subseed_strength: (_q = options.subseed_strength) !== null && _q !== void 0 ? _q : 0.0,
                seed_resize_from_h: (_r = options.seed_resize_from_h) !== null && _r !== void 0 ? _r : 0,
                seed_resize_from_w: (_s = options.seed_resize_from_w) !== null && _s !== void 0 ? _s : 0,
                batch_size: (_t = options.batch_size) !== null && _t !== void 0 ? _t : 1,
                n_iter: (_u = options.n_iter) !== null && _u !== void 0 ? _u : 1,
                steps: (_v = options.steps) !== null && _v !== void 0 ? _v : this.config.defaultStepCount,
                cfg_scale: (_w = options.cfg_scale) !== null && _w !== void 0 ? _w : 7.0,
                width: (_x = options.width) !== null && _x !== void 0 ? _x : 512,
                height: (_y = options.height) !== null && _y !== void 0 ? _y : 512,
                restore_faces: (_z = options.restore_faces) !== null && _z !== void 0 ? _z : false,
                tiling: (_0 = options.tiling) !== null && _0 !== void 0 ? _0 : false,
                do_not_save_samples: (_1 = options.do_not_save_samples) !== null && _1 !== void 0 ? _1 : false,
                do_not_save_grid: (_2 = options.do_not_save_grid) !== null && _2 !== void 0 ? _2 : false,
                negative_prompt: (_3 = options.negative_prompt) !== null && _3 !== void 0 ? _3 : "",
                eta: (_4 = options.eta) !== null && _4 !== void 0 ? _4 : 1.0,
                s_churn: (_5 = options.s_churn) !== null && _5 !== void 0 ? _5 : 0,
                s_tmax: (_6 = options.s_tmax) !== null && _6 !== void 0 ? _6 : 0,
                s_tmin: (_7 = options.s_tmin) !== null && _7 !== void 0 ? _7 : 0,
                s_noise: (_8 = options.s_noise) !== null && _8 !== void 0 ? _8 : 1,
                override_settings: (_9 = options.override_settings) !== null && _9 !== void 0 ? _9 : {},
                override_settings_restore_afterwards: (_10 = options.override_settings_restore_afterwards) !== null && _10 !== void 0 ? _10 : true,
                script_args: (_11 = options.script_args) !== null && _11 !== void 0 ? _11 : [],
                script_name: (_12 = options.script_name) !== null && _12 !== void 0 ? _12 : null,
                send_images: (_13 = options.send_images) !== null && _13 !== void 0 ? _13 : true,
                save_images: (_14 = options.save_images) !== null && _14 !== void 0 ? _14 : false,
                alwayson_scripts,
                sampler_name: (_15 = options.sampler_name) !== null && _15 !== void 0 ? _15 : this.config.defaultSampler,
                use_deprecated_controlnet: (_16 = options.use_deprecated_controlnet) !== null && _16 !== void 0 ? _16 : false,
            });
            return new StableDiffusionResult_1.default(response);
        });
    }
    /**
     * Stable Diffusion img2img call
     * @param {Img2ImgOptions} options Options for the img2img call
     * @returns {Promise<StableDiffusionResult>} ApiResult containing the generated image(s)
     * @memberof StableDiffusionApi
     * @async
     * @example
     * const api = new StableDiffusionApi();
     * const init_image = sharp("dog.png");
     * const result = await api.img2img({
     *   init_images: [init_image],
     *   prompt: "Just a funky disco dog",
     * });
     */
    img2img(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17;
        return __awaiter(this, void 0, void 0, function* () {
            const init_images = yield Promise.all(options.init_images.map((image) => __awaiter(this, void 0, void 0, function* () { return yield (0, base64_1.toBase64)(image); })));
            const mask = options.mask_image ? yield (0, base64_1.toBase64)(options.mask_image) : null;
            const alwayson_scripts = yield createScriptsWithCnUnits(options.alwayson_scripts, (_a = options.controlnet_units) !== null && _a !== void 0 ? _a : []);
            const response = yield this.api.post("/sdapi/v1/img2img", {
                init_images,
                resize_mode: (_b = options.resize_mode) !== null && _b !== void 0 ? _b : 0,
                denoising_strength: (_c = options.denoising_strength) !== null && _c !== void 0 ? _c : 0.75,
                image_cfg_scale: (_d = options.image_cfg_scale) !== null && _d !== void 0 ? _d : 1.5,
                mask,
                mask_blur: (_e = options.mask_blur) !== null && _e !== void 0 ? _e : 4,
                inpainting_fill: (_f = options.inpainting_fill) !== null && _f !== void 0 ? _f : 0,
                inpaint_full_res: (_g = options.inpaint_full_res) !== null && _g !== void 0 ? _g : true,
                inpaint_full_res_padding: (_h = options.inpaint_full_res_padding) !== null && _h !== void 0 ? _h : 0,
                inpainting_mask_invert: (_j = options.inpainting_mask_invert) !== null && _j !== void 0 ? _j : 0,
                initial_noise_multiplier: (_k = options.initial_noise_multiplier) !== null && _k !== void 0 ? _k : 1,
                prompt: (_l = options.prompt) !== null && _l !== void 0 ? _l : "",
                styles: (_m = options.styles) !== null && _m !== void 0 ? _m : [],
                seed: (_o = options.seed) !== null && _o !== void 0 ? _o : -1,
                subseed: (_p = options.subseed) !== null && _p !== void 0 ? _p : -1,
                subseed_strength: (_q = options.subseed_strength) !== null && _q !== void 0 ? _q : 0,
                seed_resize_from_h: (_r = options.seed_resize_from_h) !== null && _r !== void 0 ? _r : 0,
                seed_resize_from_w: (_s = options.seed_resize_from_w) !== null && _s !== void 0 ? _s : 0,
                sampler_name: (_t = options.sampler_name) !== null && _t !== void 0 ? _t : this.config.defaultSampler,
                batch_size: (_u = options.batch_size) !== null && _u !== void 0 ? _u : 1,
                n_iter: (_v = options.n_iter) !== null && _v !== void 0 ? _v : 1,
                steps: (_w = options.steps) !== null && _w !== void 0 ? _w : this.config.defaultStepCount,
                cfg_scale: (_x = options.cfg_scale) !== null && _x !== void 0 ? _x : 7.0,
                width: (_y = options.width) !== null && _y !== void 0 ? _y : 512,
                height: (_z = options.height) !== null && _z !== void 0 ? _z : 512,
                restore_faces: (_0 = options.restore_faces) !== null && _0 !== void 0 ? _0 : false,
                tiling: (_1 = options.tiling) !== null && _1 !== void 0 ? _1 : false,
                do_not_save_samples: (_2 = options.do_not_save_samples) !== null && _2 !== void 0 ? _2 : false,
                do_not_save_grid: (_3 = options.do_not_save_grid) !== null && _3 !== void 0 ? _3 : false,
                negative_prompt: (_4 = options.negative_prompt) !== null && _4 !== void 0 ? _4 : "",
                eta: (_5 = options.eta) !== null && _5 !== void 0 ? _5 : 1.0,
                s_churn: (_6 = options.s_churn) !== null && _6 !== void 0 ? _6 : 0,
                s_tmax: (_7 = options.s_tmax) !== null && _7 !== void 0 ? _7 : 0,
                s_tmin: (_8 = options.s_tmin) !== null && _8 !== void 0 ? _8 : 0,
                s_noise: (_9 = options.s_noise) !== null && _9 !== void 0 ? _9 : 1,
                override_settings: (_10 = options.override_settings) !== null && _10 !== void 0 ? _10 : {},
                override_settings_restore_afterwards: (_11 = options.override_settings_restore_afterwards) !== null && _11 !== void 0 ? _11 : true,
                script_args: (_12 = options.script_args) !== null && _12 !== void 0 ? _12 : [],
                include_init_images: (_13 = options.include_init_images) !== null && _13 !== void 0 ? _13 : false,
                script_name: (_14 = options.script_name) !== null && _14 !== void 0 ? _14 : null,
                send_images: (_15 = options.send_images) !== null && _15 !== void 0 ? _15 : true,
                save_images: (_16 = options.save_images) !== null && _16 !== void 0 ? _16 : false,
                alwayson_scripts,
                use_deprecated_controlnet: (_17 = options.use_deprecated_controlnet) !== null && _17 !== void 0 ? _17 : false,
            });
            return new StableDiffusionResult_1.default(response);
        });
    }
    /**
     * Stable Diffusion extra's call for single images
     * @param {ExtraSingleOptions} options Options for the extra's call
     * @returns {Promise<StableDiffusionResult>} ApiResult containing the generated image(s)
     * @memberof StableDiffusionApi
     * @async
     * @example
     * const api = new StableDiffusionApi();
     * const image = sharp("dog.png");
     * const result = await api.extraSingle({
     *   image,
     *   upscaler_1: "Lanczos",
     *   upscaling_resize: 2,
     * });
     */
    extraSingle(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield (0, base64_1.toBase64)(options.image);
            const response = yield this.api.post("/sdapi/v1/extra-single-image", {
                image,
                resize_mode: (_a = options.resize_mode) !== null && _a !== void 0 ? _a : 0,
                show_extras_results: (_b = options.show_extras_results) !== null && _b !== void 0 ? _b : true,
                gfpgan_visibility: (_c = options.gfpgan_visibility) !== null && _c !== void 0 ? _c : 0,
                codeformer_weight: (_d = options.codeformer_weight) !== null && _d !== void 0 ? _d : 0,
                upscaling_resize: (_e = options.upscaling_resize) !== null && _e !== void 0 ? _e : 2,
                upscaling_resize_w: (_f = options.upscaling_resize_w) !== null && _f !== void 0 ? _f : 512,
                upscaling_resize_h: (_g = options.upscaling_resize_h) !== null && _g !== void 0 ? _g : 512,
                upscaling_resize_crop: (_h = options.upscaling_resize_crop) !== null && _h !== void 0 ? _h : true,
                upscaler_1: (_j = options.upscaler_1) !== null && _j !== void 0 ? _j : "None",
                upscaler_2: (_k = options.upscaler_2) !== null && _k !== void 0 ? _k : "None",
                extras_upscaler_2_visibility: (_l = options.extras_upscaler_2_visibility) !== null && _l !== void 0 ? _l : 0,
                upscale_first: (_m = options.upscale_first) !== null && _m !== void 0 ? _m : false,
            });
            return new StableDiffusionResult_1.default(response);
        });
    }
    /**
     * Stable Diffusion extra's call for batch images
     * @param {ExtraBatchOptions} batchOptions Options for the extra's call
     * @returns {Promise<StableDiffusionResult>} ApiResult containing the generated image(s)
     * @memberof StableDiffusionApi
     * @async
     * @example
     * const api = new StableDiffusionApi();
     * const image1 = sharp("dog.png");
     * const image2 = sharp("cat.png");
     * const result = await api.extraBatch({
     *   images: [image1, image2],
     *   name_list: ["dog", "cat"],
     *   upscaler_1: "Lanczos",
     *   upscaling_resize: 2,
     * });
     */
    extraBatch(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __awaiter(this, void 0, void 0, function* () {
            if (options.images.length !== options.name_list.length) {
                throw new Error("The number of images and names must be the same in extraBatch");
            }
            const images = yield Promise.all(options.images.map((image) => __awaiter(this, void 0, void 0, function* () { return yield (0, base64_1.toBase64)(image); })));
            const image_list = images.map((image, index) => {
                return {
                    image,
                    name: options.name_list[index],
                };
            });
            const response = yield this.api.post("/sdapi/v1/extra-batch-images", {
                image_list,
                resize_mode: (_a = options.resize_mode) !== null && _a !== void 0 ? _a : 0,
                show_extras_results: (_b = options.show_extras_results) !== null && _b !== void 0 ? _b : true,
                gfpgan_visibility: (_c = options.gfpgan_visibility) !== null && _c !== void 0 ? _c : 0,
                codeformer_weight: (_d = options.codeformer_weight) !== null && _d !== void 0 ? _d : 0,
                upscaling_resize: (_e = options.upscaling_resize) !== null && _e !== void 0 ? _e : 2,
                upscaling_resize_w: (_f = options.upscaling_resize_w) !== null && _f !== void 0 ? _f : 512,
                upscaling_resize_h: (_g = options.upscaling_resize_h) !== null && _g !== void 0 ? _g : 512,
                upscaling_resize_crop: (_h = options.upscaling_resize_crop) !== null && _h !== void 0 ? _h : true,
                upscaler_1: (_j = options.upscaler_1) !== null && _j !== void 0 ? _j : "None",
                upscaler_2: (_k = options.upscaler_2) !== null && _k !== void 0 ? _k : "None",
                extras_upscaler_2_visibility: (_l = options.extras_upscaler_2_visibility) !== null && _l !== void 0 ? _l : 0,
                upscale_first: (_m = options.upscale_first) !== null && _m !== void 0 ? _m : false,
            });
            return new StableDiffusionResult_1.default(response);
        });
    }
    /**
     * Gets the info of a png image
     * @param {Sharp} image Image to get info from
     * @returns {Promise<StableDiffusionResult>} ApiResult containing the info
     */
    pngInfo(image) {
        return __awaiter(this, void 0, void 0, function* () {
            const image_data = yield (0, base64_1.toBase64)(image);
            const response = yield this.api.post("/sdapi/v1/png-info", {
                image: image_data,
            });
            return new StableDiffusionResult_1.default(response);
        });
    }
    /**
     * Interrogates an image with an interrogation model
     * @param {Sharp} image Image to interrogate
     * @param model Model to use for interrogation
     * @returns {Promise<StableDiffusionResult>} The result of the interrogation
     */
    interrogate(image, model) {
        return __awaiter(this, void 0, void 0, function* () {
            const image_data = yield (0, base64_1.toBase64)(image);
            const response = yield this.api.post("/sdapi/v1/interrogate", {
                image: image_data,
            });
            return new StableDiffusionResult_1.default(response);
        });
    }
    getOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.get("/sdapi/v1/options");
            return response.data;
        });
    }
    setOptions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.post("/sdapi/v1/options", options);
            return response.data;
        });
    }
    /**
     * Gets the progress status of the current session
     * @param {boolean} skipCurrentImage True to skip the current image, false to include it
     * @returns {Promise<Progress>} The progress status of the current session
     */
    getProgress(skipCurrentImage = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.get(`/sdapi/v1/progress?skipCurrentImage=${skipCurrentImage}`);
            return response.data;
        });
    }
    /**
     * Gets the list of command line flags that are available
     * @returns {Promise<Record<string, unknown>>} The list of command line flags that are available
     */
    getCmdFlags() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.get("/sdapi/v1/cmd-flags");
            return response.data;
        });
    }
    /**
     * Gets the list of samplers
     * @returns {Promise<Sampler[]>} The list of samplers
     */
    getSamplers() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.get("/sdapi/v1/samplers");
            return response.data;
        });
    }
    /**
     * Gets the list of upscalers
     * @returns {Promise<Upscaler[]>} The list of upscalers
     */
    getUpscalers() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.get("/sdapi/v1/upscalers");
            return response.data;
        });
    }
    /**
     * Gets the list of Stable Diffusion models
     * @returns {Promise<StableDiffusionModel[]>} The list of Stable Diffusion models
     */
    getSdModels() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.get("/sdapi/v1/sd-models");
            return response.data;
        });
    }
    /**
     * Gets the list of hypernetworks
     * @returns {Promise<HyperNetwork[]>} The list of hypernetworks
     */
    getHypernetworks() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.get("/sdapi/v1/hypernetworks");
            return response.data;
        });
    }
    /**
     * Gets the list of face restorers
     * @returns {Promise<FaceRestorer[]>} The list of face restorers
     */
    getFaceRestorers() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.get("/sdapi/v1/face-restorers");
            return response.data;
        });
    }
    /**
     * Gets the list of Real-ESRGAN models
     * @returns {Promise<RealESRGanModel[]>} The list of Real-ESRGAN models
     */
    getRealesrganModels() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.get("/sdapi/v1/realesrgan-models");
            return response.data;
        });
    }
    /**
     * Gets the list of Stable Diffusion prompt styles
     * @returns {Promise<PromptStyle[]>} The list of prompt styles
     */
    getPromptStyles() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.get("/sdapi/v1/prompt-styles");
            return response.data;
        });
    }
    /**
     * Refreshes the list of Stable Diffusion checkpoints
     * @returns {Promise<void>}
     */
    refreshCheckpoints() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.api.post("/sdapi/v1/refresh-checkpoints");
        });
    }
    /**
     * Gets the name of the current Stable Diffusion checkpoint being used
     * @returns {Promise<string>} The name of the current Stable Diffusion checkpoint being used
     */
    getCurrentModel() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = yield this.getOptions();
            return options.sd_model_checkpoint;
        });
    }
    /**
     * Sets the Stable Diffusion checkpoint to use
     * @param name Name of the model to set.
     * @param findClosest If true, will try to find the closest model name if the exact name is not found
     * @returns {Promise<void>}
     */
    setModel(name, findClosest = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const models = yield this.getSdModels();
            const modelNames = models.map((model) => model.model_name);
            let foundModel = null;
            if (modelNames.includes(name)) {
                foundModel = name;
            }
            else if (findClosest) {
                const bestMatch = string_similarity_1.default.findBestMatch(name, modelNames);
                if (bestMatch.bestMatch.rating > 0.5) {
                    foundModel = bestMatch.bestMatch.target;
                }
            }
            if (foundModel) {
                const options = {
                    sd_model_checkpoint: foundModel,
                };
                yield this.setOptions(options);
            }
            else {
                throw new Error("Model not found");
            }
        });
    }
    /**
     * Waits for the Stable Diffusion server to be ready to accept new requests
     * @param checkInterval Interval in seconds to check progress
     * @returns {Promise<boolean>} Only resolves when progress is 0.0 and job_count is 0
     */
    waitForReady(checkInterval = 5.0) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, _reject) => {
                const interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    const result = yield this.getProgress();
                    const progress = result.progress;
                    const jobCount = result.state.job_count;
                    if (progress === 0.0 && jobCount === 0) {
                        clearInterval(interval);
                        resolve(true);
                    }
                    else {
                        console.log(`[WAIT]: progress = ${progress.toFixed(4)}, job_count = ${jobCount}`);
                    }
                }), checkInterval * 1000);
            });
        });
    }
}
exports.StableDiffusionApi = StableDiffusionApi;
