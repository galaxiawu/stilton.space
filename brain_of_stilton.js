const dictionary_api_key = '95ca5c5d-545c-49ac-b54d-8896ac25b032';
const ibm_api_key = 'DvuygxiAZ-yKDwC4l66UQb1sRSfbJQfAQHCnRFlEc4_Z';
const ibm_url = 'https://api.us-south.tone-analyzer.watson.cloud.ibm.com/instances/add13509-7c4a-4bba-9969-2249bb3d7446'

const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

import (fonts)
import (colours)

const toneAnalyzer = new ToneAnalyzerV3({
    version: '2017-09-21',
    authenticator: new IamAuthenticator({
        apikey: `${ibm_api_key}`,
    }),
    serviceUrl: `${ibm_url}`,
});

const boring_font = "goudy-old-style"
const boring_colour = "#191515"

function Get(yourUrl){
    const Httpreq = new XMLHttpRequest();
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return JSON.parse(Httpreq.responseText);
}

function stiltonify() {
    let slider = document.getElementById("fun_slider");
    const input = document.getElementById('stiltonify').innerHTML;
    const enter = document.getElementById('enter')
    const fun_prob = slider.value/100
    const special_words = [];
    const words = input.split(" ").map(remove_punctuation)
    const blacklist = ['i', 'this', 'you', 'would', 'could', 'should', 'and', 'but', 'again', 'if', 'him', 'her', 'when', 'where', 'how']
    for (const word of words) {
        enter.innerHTML = (word)
        if (word.toLowerCase() in blacklist) {
            continue
        }
        const word_info = get_info(word)
        const approved_word_types = ['verb', 'noun', 'adjective', 'adverb',]
        if (approved_word_types.indexOf(word_info[0]['fl']) < 0) {
            continue
        }
        if (probability(1 - fun_prob)) {
            continue
        }
        let descriptor_dict = {
            'word': word,
            'emotion': get_emotion(word_info[0]['shortdef'][0])
        }
        descriptor_dict['font'] = get_font(descriptor_dict['emotion'])
        descriptor_dict['colour'] = get_colour(descriptor_dict['emotion'])
        special_words.push(descriptor_dict)
        console.log(descriptor_dict)
    }
    let out = input
    const text_area = document.getElementById('stiltonified');
    for (const word of special_words) {
        out.replace(word['word'], `<span style="color: ${word['colour']};font-family: ${word['font']};font-size: 1.4em">${word['word']}</span>`)

    }
    text_area.innerHTML = out
}


function remove_punctuation(word) {
    return word.replace(/[.,\/#!$?%^&*;:{}=\-_`~()]/g,"")
}

function get_info(word) {
    const target = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${dictionary_api_key}`
    return Get(target)
}

function get_emotion(input) {
    const toneParams = {
        toneInput: { 'text': input },
        contentType: 'text/plain',
    };
    let emote =
    {
        "anger": 0,
        "fear": 0,
        "joy": 0,
        "sadness": 0,
        "analytical": 0,
        "confident": 0,
        "tentative": 0
    }
    toneAnalyzer.tone(toneParams)
        .then(toneAnalysis => {
            let ibm_response = JSON.stringify(toneAnalysis, null, 2);
            for (const tone in ibm_response['document_tone']['tones']) {
                const tone_name = tone['tone_id']
                emote[tone_name] = tone['score']
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

module.exports = {
    stiltonify,
}