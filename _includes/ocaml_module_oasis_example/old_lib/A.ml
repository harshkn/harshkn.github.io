module A1 = struct
  let a1_fun arg = arg
end

module A2 = struct
  let a2_fun arg = A1.a1_fun arg
end

module A3 = struct
  let a3_fun = A2.a2_fun
end
