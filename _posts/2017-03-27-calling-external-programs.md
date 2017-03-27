---
layout: post
title: Calling External Programs from OCaml with Core
author:
  display_name: Emma Tosch
---

I have a program I'd like to run with node. The program is typically run like so:

`node $PROGRAM input_filename.js`

and it prints its output to stdout. Now, this program is *not* written to handle streaming input:

`node $PROGRAM < input_filename.js`

So we can see that one of the main challenges is that the node program expects a file name. We could alter the Javascript program to take a stream as input, so that the second version works. However, I'm going to focus on implementing a function that will deal with `$PROGRAM` as is. So, for starters, I'd like to be able to programmatically call this from Ocaml using a function having the signature:

`val exec_program : (prog : string) -> string`

<!--break-->

At a high level, the steps necessary to implement this function are:

1. Create a temp file holding `prog`.
2. Call `node $PROGRAM` on that temp file.
3. Capture the output of the program from stdout into a string.

Now, Jane Street's Core library has a module that handles creating temp files. You can find it in [`Core.Filename`](https://ocaml.janestreet.com/ocaml-core/109.07.00/doc/core/Filename.html). This part is fairly straightforward:

    let exec_program (prog : string) : string =
    	let (fname, out) = Core.Core_filename.open_temp_file "some_prefix" "some_suffix" in
        Core.Out_channel.output_string out file_content;
        ""

The next part is unnervingly tricky, which is why I am writing this post. The obvious next line of code for the above functions might be:

    let {stdout} = Core.Core_unix.create_process ~prog:"node" ~args:["$PROGRAM"; fname] in
    read_until_done stdout

The challenge is that I've been looking for the appropriate function (represented here by `read_until_done`) to take `stdout` as input and read all of the content printed to it. The main problem I faced (as I saw it) was that `stdout` had type `out_channel`; since I needed to be able to read from it, it needed to have type `in_channel`. So instead of calling `create_process`, I called `open_process_in`, which would produce the input channel I needed for reading (I also make sure I flushed the write to the temp file, just in case!):

    let exec_program (prog : string) : string =
        let (fname, out) = Core.Core_filename.open_temp_file "some_prefix" "some_suffix" in
        Core.Out_channel.output_string out file_content;
        Core.Out_channel.flush out;
        let stdout = Core.Core_unix.open_process_in ("node $PROGRAM " ^ fname) in
        Core.In_channel.input_all stdout


After writing this, I did come across a [StackOverflow question](http://stackoverflow.com/questions/29503960/in-ocaml-how-to-get-stdout-string-from-subprocess) addressing the problem of reading the output of a another process. 
	
