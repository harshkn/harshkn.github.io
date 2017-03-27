Problem: wanted to use generated sexp conversions.
Original module had several types that were exported
It was not clear to me what the types were.

Solution: I created some submodules.
Next problem: compiling the new modules caused issues with scoping -- I ended up getting the error
    Error: Unbound value bool_of_sexp
Since I wasn't sure if the problem was the pipeline, I compiled locally:
    ocamlfind ocamlc -syntax camlp4o -package sexplib.syntax -package sexplib -c Config_types.ml
This gave me the same error. The next thing I did was to search for where that function was supposed to be (add here let me google that for you link here)
When I found that package, I made sure to open it at the top of the file. This solved part of the problem.

Next 