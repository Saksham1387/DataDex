```python
def matrix_scalar_multiplication(matrix, scalar):
    return [[element * scalar for element in row] for row in matrix]