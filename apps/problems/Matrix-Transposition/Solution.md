```python
def transpose(matrix):
    # Get the number of rows and columns in the input matrix
    rows = len(matrix)
    cols = len(matrix[0])
    
    # Initialize the transposed matrix with zeros
    transposed = [[0 for _ in range(rows)] for _ in range(cols)]
    
    # Transpose the matrix
    for i in range(rows):
        for j in range(cols):
            transposed[j][i] = matrix[i][j]
    
    return transposed