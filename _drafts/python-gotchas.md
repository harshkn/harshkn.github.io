One of my friends has started learning Python (2.7, natch) and I wanted her to know some of the beautiful gotchas I've come across. I'm sure someone somewhere has a list of these as well, but I couldn't resist adding my voice to the choir of Python despair.

# List comprehensions are not closed.

Did you think list comprehensions were closed? [I sure did!](https://www.youtube.com/watch?v=3BE95qqkTc0)

So, for clarity let's assume we have the function `map : (('a -> 'b) * ('a list)) -> 'b list` that takes two arguments: (1) a function that takes in objects of type `a`, returning objects of type `b`, and (2) a list of type `a`. `map` executes this function (its first argument: the one having type `'a -> 'b`) on all elements of the list (its second argument: the one having type `'a list`).

# Default variables in constructors are mutable.




# String internment is unreliable.

Well, yeah. That's always true, and it's why we use `==` and not `is`. But, just for funsies, an illustration. 


If you know of any others, post them below!
