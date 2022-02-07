# Stiltonify

Stiltonify is a website where you can convert boring old text into a Geronimo Stilton-style explosion of typographical goodness. 

Why? To bring joy to a joyless time.

We take the input text and run each word through Merriam-Webster's API to determine word type. If it's a suitable type (noun, adjective, adverb, or verb), then we run it through IBM's tone detection API, then take the cosine similarity between the tone of the word and our self-generated dataset of dozens of fonts and 18 colours. We then change the text to the closest font and colour match and then display the resulting work of art.

Making the world more whimsical, one noun, adjective, adverb, or verb at a time.

Originally created for Hack the North 2020++ 
