require('dotenv').config();
const fetch = require('node-fetch');

// const dictionary_api_key = process.env.DICT_KEY
// const ibm_api_key = process.env.IBM_KEY
// const ibm_url = process.env.IBM_URL

const dictionary_api_key='95ca5c5d-545c-49ac-b54d-8896ac25b032'
const ibm_api_key='DvuygxiAZ-yKDwC4l66UQb1sRSfbJQfAQHCnRFlEc4_Z'
const ibm_url = 'https://api.us-south.tone-analyzer.watson.cloud.ibm.com/instances/add13509-7c4a-4bba-9969-2249bb3d7446'

const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const toneAnalyzer = new ToneAnalyzerV3({
    version: '2017-09-21',
    authenticator: new IamAuthenticator({
        apikey: `${ibm_api_key}`,
    }),
    serviceUrl: `${ibm_url}`,
    disableSslVerification: true,
});

const {fonts} = require("./fonts");
const {colours} = require("./colours");

const boring_font = "goudy-old-style"
const boring_colour = "#191515"

const blacklist = ['i', 'this', 'you', 'would', 'could', 'should', 'and', 'but', 'again', 'if', 'him', 'her', 'when', 'where', 'how']
const approved_word_types = ['verb', 'noun', 'adjective', 'adverb',]

async function return_word(word, fun_prob) {

    if (word.toLowerCase() in blacklist) {
        return word
    }

    const word_info = await get_info(word)
    if (word_info === 1) {
        return word
    } else if (typeof word_info[0] === 'string') {
        return word
    }

    const definition = word_info[0]['shortdef'][0]

    const word_type = word_info[0]['fl']
    if (approved_word_types.indexOf(word_type) < 0) {
        return word
    }

    if (probability(1 - fun_prob)) {
        return word
    }

    let emotion = await get_emotion(definition)
    let font = get_font(emotion)
    let colour = get_colour(emotion)
    return(`<span style="color: ${colour};font-family: ${font};font-size: 1.4em">${word}</span>`)
}

async function get_info(word) {
    const target = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${dictionary_api_key}`
    return await fetch(target)
        .then(res => {
            return res.json()
        })
        .catch(() => {
            return 1;
        })
}

async function get_emotion(input) {
    const toneParams = {
        toneInput: { 'text': input },
        contentType: 'text/plain',
    };
    let emote =
    {
        "anger": 0.,
        "fear": 0.,
        "joy": 0.,
        "sadness": 0.,
        "analytical": 0.,
        "confident": 0.,
        "tentative": 0.,
    }
    await toneAnalyzer.tone(toneParams)
        .then(toneAnalysis => {
            let parsed = toneAnalysis['result']['document_tone']['tones'];
            for (const tone_ind in parsed) {
                emote[parsed[tone_ind]['tone_id']] = parsed[tone_ind]['score']
            }
        })
        .catch(err => {
            console.log('error:', err);
        });
    return [emote["anger"], emote["fear"], emote["joy"], emote["sadness"], emote["analytical"], emote["confident"], emote["tentative"]]
}

function get_font(emotion) {
    let sum = 0.;
    for (let i = 0; i < emotion.length; i++ ){
        sum += emotion[i];
    }
    if (sum === 0.) {
        return boring_font
    }
    let best_match = "";
    let match_val = 0;
    for (const font of fonts) {
        let font_values = [font["anger"], font["fear"], font["joy"], font["sadness"], font["analytical"], font["confident"], font["tentative"]]
        let sim = cosine_similarity(emotion, font_values)
        if (sim > match_val) {
            match_val = sim
            best_match = font['font']
        }
    }
    return best_match
}

function get_colour(emotion) {
    let sum = 0.;
    for (let i = 0; i < emotion.length; i++ ){
        sum += emotion[i];
    }
    if (sum === 0.) {
        return boring_colour
    }
    let best_match = "";
    let match_val = 0;
    for (const colour of colours) {
        let colour_values = [colour["anger"], colour["fear"], colour["joy"], colour["sadness"], colour["analytical"], colour["confident"], colour["tentative"]]
        let sim = cosine_similarity(emotion, colour_values)
        if (sim > match_val) {
            match_val = sim
            best_match = colour['hex']
        }
    }
    return best_match
}

function cosine_similarity(a,b){
    let dot_product = 0;
    let mA = 0;
    let mB = 0;
    for(let i = 0; i < a.length; i++){
        dot_product += (a[i] * b[i]);
        mA += (a[i]*a[i]);
        mB += (b[i]*b[i]);
    }
    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    return (dot_product) / (mA * mB);
}

function probability(n) {
    return !!n && Math.random() <= n;
}

module.exports = { return_word };