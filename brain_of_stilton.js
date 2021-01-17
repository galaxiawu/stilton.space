const dictionary_api_key = '95ca5c5d-545c-49ac-b54d-8896ac25b032';

function Get(yourUrl){
    const Httpreq = new XMLHttpRequest();
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return JSON.parse(Httpreq.responseText);
}

function probability(n) {
    return !!n && Math.random() <= n;
}

approved_word_types = ['verb', 'noun', 'adjective', 'adverb',]

test = "I Love my xiao ni!"
const fun_prob = 0.7

const words = test.split(" ").map(remove_punctuation)

white_list
for (const word of words) {
    const word_info = get_info(word)
    if (approved_word_types.indexOf(word_info[0]['fl']) < 0) {
        continue
    }
    if (probability(1 - fun_prob)) {
        continue
    }
    let descriptor_dict = {
        'word': word,
        'emotion': get_emotion(word)
        'word_type'
    }
}

function determine_fun(word) {
    if (approved_word_types.indexOf(word_info[0]['fl']) >= 0) {
        //do something
    }
}

function remove_punctuation(word) {
    return word.replace(/[.,\/#!$?%^&*;:{}=\-_`~()]/g,"")
}



function get_info(word) {
    const target = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${dictionary_api_key}`
    dict_json = Get(target)[0]
}

exports.is_keyword = function (input) {

}

exports.find_emotion = function (keywords) {

}

exports.find_font = function (emotion) {

}