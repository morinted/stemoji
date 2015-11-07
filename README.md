# Stemoji

Steno emoji script, made with Plover's default dictionary and Emoji shortnames by [Emoji One](https://github.com/Ranks/emojione).

Run with `babel-node stemoji.js modified_main.json`. You can substitute in your own dictionary, but you'll have to cater to the list of unknown words and add definitions. For example, the emoji will use "mans" instead of "man's". You can handle this by defining your "man's" stroke as "mans". There are some tools inside the script to modify the emoji shortnames, too, in the case of typos or fake words. For example, "couplekiss" will become "couple_kiss". "grey" will map to both "grey" and "gray". Good luck!
