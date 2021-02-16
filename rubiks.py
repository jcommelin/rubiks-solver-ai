import copy

def sum(xs):
    s = 0
    for x in xs:
        s += x
    return s

def dotp(x1, x2):
    return sum([x1[i] * x2[i] for i in range(len(x1))])

def mat_mul_vec(M, v):
    return [dotp(row, v) for row in M]

def matrix(i, o):
    M = [[0,0,0] for i in [0,1,2]]
    j = (i + 1) % 3
    k = (i + 2) % 3
    M[i][i] = 1
    M[j][k] = -o
    M[k][j] = o
    return M

def rot_colors(i, colors):
    new_colors = copy.copy(colors)
    j = (i + 1) % 3
    k = (i + 2) % 3
    new_colors[j] = colors[k]
    new_colors[k] = colors[j]
    return new_colors

def rot_cube(move, cube):
    (i, mask) = move
    new_cube = {}
    for xyz, cs in cube.items():
        c = xyz[i]  # the coordinate on the axis along which we rotate
        o = mask[c+1] # the orientation of the rotation
        if o == 0:
            new_cube[xyz] = cs
        else:
            new_xyz = tuple(mat_mul_vec(matrix(i, o), xyz))
            new_cube[new_xyz] = rot_colors(i, cs)
    return new_cube

def color_format(n):
    f = ';'.join(['0', str(30+n), str(40+n)])
    return '\x1b[' + f + 'm \x1b[0m'

# red, green, yellow, blue, purple, white
[R,G,Y,B,P,W] = [color_format(i) for i in [1,2,3,4,5,7]]
# print (R + G + Y + B + P + W)

def standard_colors(x,y,z):
    cx = [1, 0, 5] # red,    black, purple
    cy = [3, 0, 7] # yellow, black, white
    cz = [4, 0, 2] # blue,   black, green
    return [cx[x+1], cy[y+1], cz[z+1]]

def standard_cube():
    cube = {}
    for x in [-1,0,1]:
        for y in [-1,0,1]:
            for z in [-1,0,1]:
                cube[(x,y,z)] = standard_colors(x,y,z)
    return cube

#  B      G
# LTRb   RWPY
#  F      B

# B = back  = (z =  1)
# L = left  = (x = -1)
# T = top   = (y =  1)
# R = right = (x =  1)
# b = bot   = (y = -1)
# F = front = (z = -1)

def flat_back(cube):
    a = []
    for y in [-1,0,1]:
        a += [[cube[(x,y,1)][2] for x in [-1,0,1]]]
    return a

def flat_left(cube):
    a = []
    for z in [1,0,-1]:
        a += [[cube[(-1,y,z)][0] for y in [-1,0,1]]]
    return a

def flat_top(cube):
    a = []
    for z in [1,0,-1]:
        a += [[cube[(x,1,z)][1] for x in [-1,0,1]]]
    return a

def flat_right(cube):
    a = []
    for z in [1,0,-1]:
        a += [[cube[(1,y,z)][0] for y in [1,0,-1]]]
    return a

def flat_bot(cube):
    a = []
    for z in [1,0,-1]:
        a += [[cube[(x,-1,z)][1] for x in [1,0,-1]]]
    return a

def flat_front(cube):
    a = []
    for y in [1,0,-1]:
        a += [[cube[(x,y,-1)][2] for x in [-1,0,1]]]
    return a

def flat_model(cube):
    back  = flat_back(cube)
    left  = flat_left(cube)
    top   = flat_top(cube)
    right = flat_right(cube)
    bot   = flat_bot(cube)
    front = flat_front(cube)
    empty = [0]*3
    H = [empty + back[i]                      for i in [0,1,2]]
    M = [left[i] + top[i] + right[i] + bot[i] for i in [0,1,2]]
    L = [empty + front[i]                     for i in [0,1,2]]
    return H + M + L

def print_cube(cube):
    for row in flat_model(cube):
        print(''.join([color_format(i) for i in row]))











