```python
def eigenvalues(matrix):
    import math

    a, b = matrix[0]
    c, d = matrix[1]
    
    # Calculate the coefficients of the characteristic equation
    trace = a + d
    determinant = a * d - b * c
    
    # Calculate the discriminant
    discriminant = trace**2 - 4 * determinant
    
    # Compute the two eigenvalues
    eigenvalue1 = (trace + math.sqrt(discriminant)) / 2
    eigenvalue2 = (trace - math.sqrt(discriminant)) / 2
    
    return [eigenvalue1, eigenvalue2]