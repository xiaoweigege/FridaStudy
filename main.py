import z3

s = z3.Solver()

s.add(z3.BitVec('x', 32) + 3 == 10)

if s.check() == z3.sat:

    print(s.model())
else:
    print('2')
