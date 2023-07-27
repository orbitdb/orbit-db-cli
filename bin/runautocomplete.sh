#!/usr/bin/env bash

_hello() {
    local cur_word="${COMP_WORDS[COMP_CWORD]}"
	local completions=("feed" "keystore")
    if [[ -z "$cur_word" ]]; then
        COMPREPLY=("${completions[@]}")
        return
    fi

    local matches=()
    for word in "${completions[@]}"; do
        if [[ "$word" == "$cur_word"* ]]; then
            matches+=("$word")
        fi
    done

    COMPREPLY=("${matches[@]}")
}

complete -F _hello run
